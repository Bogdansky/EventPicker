using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.DTO
{
    public class CoordinatesDTO
    {
        public int Id { get; set; }
        public decimal Latitude { get; set; } // долгота
        public decimal Longitude { get; set; } // широта

        public override bool Equals(object obj)
        {
            if(obj.GetType() == typeof(DAL.Entities.Coordinates)) return false;
            var coords = obj as DAL.Entities.Coordinates;
            return Latitude == coords.Latitude && Longitude == coords.Longitude;
        }
    }
}
