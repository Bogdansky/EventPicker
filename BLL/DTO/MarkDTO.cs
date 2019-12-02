using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.DTO
{
    public class MarkDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }

        public string Categories { get; set; }

        public CoordinatesDTO Coordinates { get; set; }

        public int UserId { get; set; }
        public UserDTO User { get; set; }
    }

    
}
