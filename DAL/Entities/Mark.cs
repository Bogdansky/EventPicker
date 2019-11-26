using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Entities
{
    public class Mark
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        public ICollection<Category> Categories { get; set; }
        
        public Coordinates Coordinates { get; set; }
    }
}
