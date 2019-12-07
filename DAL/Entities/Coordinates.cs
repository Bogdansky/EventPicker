using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DAL.Entities
{
    public class Coordinates
    {
        public int Id { get; set; }
        [Column(TypeName = "decimal(10,7)")]
        public decimal Latitude { get; set; } // долгота
        [Column(TypeName = "decimal(10,7)")]
        public decimal Longitude { get; set; } // широта

        public int? MarkId { get; set; }
        public Mark Mark { get; set; }
    }
}
