using System;
using System.Collections.Generic;
using System.Text;

namespace Reading_organizer.BLL.Infrastructure
{
    public class Util
    {
        public static DateTime TryParse(string maybeDate)
        {
            try
            {
                return Convert.ToDateTime(maybeDate);
            }
            catch
            {
                return DateTime.Now;
            }
        }
    }
}
