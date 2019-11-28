using DAL.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.DTO
{
    [Serializable]
    public class UserDTO
    {
        public int Id { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
        public string Token { get; set; }

        public static UserDTO ToUserDTO(User user)
        {
            return user is null ? null : new UserDTO
            {
                Id = user.Id,
                Login = user.Login
            };
        }

        //public override string ToString()
        //{
        //    return $"{UserInfo.Surname} {UserInfo.Name}";
        //}
    }
}
