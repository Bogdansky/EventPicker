using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Entities
{
    public class Progress
    {
        public int Id { get; set; }
        public DateTime Day { get; set; }
        [Column(TypeName = "BIT")]
        public bool Done { get; set; }
        public Task Task { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public int BookId { get; set; }
        public Book Book { get; set; }
    }
}
