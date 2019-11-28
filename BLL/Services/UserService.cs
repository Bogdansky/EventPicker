using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DAL;
using DAL.Entities;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using BLL.DTO;
using BLL;

namespace BLL.Services
{
    public class UserService : IService<UserDTO>
    {
        Context Context { get; set; }

        public UserService()
        {
            Context = new Context();
        }

        public async Task<UserDTO> Authenticate(UserDTO obj, string secretKey)
        {
            var user = await Read(obj.Login, obj.Password);

            if (user is null)
            {
                return null;
            }

            user.Token = GetToken(user.Id, secretKey);
            user.Password = "";
            return user;
        }

        private string GetToken(int id, string secretKey)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            byte[] key = Encoding.ASCII.GetBytes(secretKey);

            var tokenDescriptor = GetSecurityTokenDescriptor(id, key);
            SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        private SecurityTokenDescriptor GetSecurityTokenDescriptor(int id, byte[] key)
        {
            return new SecurityTokenDescriptor
            {
                Subject = new System.Security.Claims.ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.PrimarySid, id.ToString())
                }),
                Expires = DateTime.UtcNow.AddMinutes(30),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
        }

        async public Task<string> Create(UserDTO obj)
        {
            var exist = await Context.Users.CountAsync(u => u.Login == obj.Login) > 0;
            if (exist)
            {
                return "User is exist";
            }
            var newUser = await Context.Users.AddAsync(User.CreateUser(obj.Login, obj.Password));
            var result = await Context.SaveChangesAsync();
            return result > 0 ? newUser.Entity.Id.ToString() : "error";
        }

        async public Task<UserDTO> Delete(int id)
        {
            var user = await Context.Users.Include(u => u.UserInfo).Where(u => u.Id == id).FirstOrDefaultAsync();
            if (user == null)
            {
                return null;
            }
            Context.Users.Remove(user);
            int result = await Context.SaveChangesAsync();
            return result > 0 ? UserDTO.ToUserDTO(user) : null;
        }

        async public Task<UserDTO> Read(int id)
        {
            var user = await Context.Users.Include(u => u.UserInfo).FirstOrDefaultAsync(u => u.Id == id);
            return user == null ? null : new UserDTO
            {
                Id = user.Id,
                Login = user.Login,
                Password = user.Password
            };
        }

        async public Task<UserDTO> Read(string email, string password)
        {
            var user = await Context.Users.Include(u => u.UserInfo).FirstOrDefaultAsync(u => u.Login.Equals(email) && u.Verify(password));
            return user == null ? null : new UserDTO
            {
                Id = user.Id,
                Login = user.Login,
                Password = user.Password
            };
        }

        async public Task<IEnumerable<UserDTO>> ReadAll()
        {
            return await Context.Users.Include(u => u.UserInfo).Select(u => new UserDTO
            {
                Id = u.Id,
                Login = u.Login,
                Password = null
            }).ToArrayAsync();
        }

        async public Task<int> Update(int id, UserDTO obj)
        {
            try
            {
                var user = await Context.Users.FindAsync(id);
                user.Login = obj.Login;
                return await Context.SaveChangesAsync();
            }
            catch
            {
                return 0;
            }
        }

        Task<UserDTO> IService<UserDTO>.Create(UserDTO obj)
        {
            throw new NotImplementedException();
        }

        public async void CheckTasks(int userId)
        {
            try
            {
                var user = Context.Users.Include(u => u.Progress).FirstOrDefault(u => u.Id == userId);
                List<Progress> lostProgress = Context.Progress.Include(p => p.Task).Where(p => p.UserId == userId && !p.Done && p.Day < DateTime.Now).ToList();
                if (lostProgress.Count() == 0)
                {
                    return;
                }
                var idSequence = lostProgress.Distinct(new ProgressComparer()).Select(p => p.BookId).ToList();
                var books = Context.Books.Where(b => idSequence.Contains(b.Id)).ToList();
                string message = GetHtml(lostProgress, books);
            }
            catch
            {

            }
        }

        private string GetHtml(List<Progress> progress, List<Book> books)
        {
            StringBuilder html = new StringBuilder("Dear user! You have missed tasks<br/>");
            foreach (var book in books)
            {
                StringBuilder bookHtml = new StringBuilder($"<h3>{book.Author} \"{book.Name}\"({book.NumberOfPages} pages)</h3><br/>")
                                            .Append("<table border='1'>")
                                            .Append("<thead>")
                                            .Append("<th>Date</th><th>Pages</th>")
                                            .Append("</thead><tbody>");
                foreach (var p in progress.Where(pr => pr.BookId == book.Id))
                {
                    bookHtml = bookHtml.Append("<tr>")
                                       .AppendFormat("<td>{0}</td><td>{1}</td>", p.Day.ToShortDateString(), p.Task.Pages)
                                       .Append("</tr>");
                }
                bookHtml = bookHtml.Append("</tbody></table><br/>");
                html = html.Append(bookHtml, 0, bookHtml.Length);
            }
            return html.Append("<h2>We hope you're alright. Good luck!</h2>").ToString();
        }
    }

    internal class ProgressComparer : EqualityComparer<Progress>
    {
        public override bool Equals(Progress x, Progress y)
        {
            return x.BookId == y.BookId;
        }

        public override int GetHashCode(Progress obj)
        {
            return obj == null ? 0 : obj.BookId.GetHashCode();
        }
    }
}
