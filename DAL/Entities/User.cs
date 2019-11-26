using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace DAL.Entities
{
    public class User
    {
        public static User CreateUser(string email, string password)
        {
            var saltBytes = new byte[32];
            new Random().NextBytes(saltBytes);
            return new User
            {
                Email = email ?? throw new ArgumentNullException(nameof(email)),
                Salt = Convert.ToBase64String(saltBytes),
                Password = password == null ? throw new ArgumentNullException(nameof(password)) : ComputeHash(Concat(password, saltBytes))
            };
        }

        static string ComputeHash(byte[] bytes)
        {
            using (var sha256 = SHA256.Create())
            {
                return Convert.ToBase64String(sha256.ComputeHash(bytes));
            }
        }

        static byte[] Concat(string password, byte[] saltBytes)
        {
            var bytes = Encoding.UTF8.GetBytes(password);
            return bytes.Concat(saltBytes).ToArray();
        }

        public bool Verify(string password)
        {
            byte[] saltBytes = Convert.FromBase64String(Salt);
            byte[] anyBytes = Concat(password, saltBytes);
            string hashAttempt = ComputeHash(anyBytes);
            return Password == hashAttempt;
        }

        public int Id { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        public string Password { get; set; }
        public string Salt { get; set; }
        public UserInfo UserInfo { get; set; }

        public List<Progress> Progress { get; set; }
    }
}
