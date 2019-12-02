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
            var user = await Context.Users.Include(u => u.Marks).Where(u => u.Id == id).FirstOrDefaultAsync();
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
            var user = await Context.Users.Include(u => u.Marks).FirstOrDefaultAsync(u => u.Id == id);
            return user == null ? null : new UserDTO
            {
                Id = user.Id,
                Login = user.Login,
                Password = user.Password
            };
        }

        async public Task<UserDTO> Read(string email, string password)
        {
            var user = await Context.Users.Include(u => u.Marks).FirstOrDefaultAsync(u => u.Login.Equals(email) && u.Verify(password));
            return user == null ? null : new UserDTO
            {
                Id = user.Id,
                Login = user.Login,
                Password = user.Password
            };
        }

        async public Task<IEnumerable<UserDTO>> ReadAll()
        {
            return await Context.Users.Select(u => new UserDTO
            {
                Id = u.Id,
                Login = u.Login
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
    }
}
