using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Entities
{
    public class Coordinates
    {
        public int Id { get; set; }
        public decimal Latitude { get; set; } // долгота
        public decimal Longitude { get; set; } // широта

        public int? MarkId { get; set; }
        public Mark Mark { get; set; }
    }
}
