using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Entities
{
    public class UserInfo
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }

        public int? UserId { get; set; }
        public User User { get; set; }
    }
}
