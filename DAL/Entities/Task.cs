using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Entities
{
    public class Task
    {
        public int Id { get; set; }
        public int Pages { get; set; }

        public int? ProgressId { get; set; }
        public Progress Progress { get; set; }
    }
}
