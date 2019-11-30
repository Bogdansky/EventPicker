using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Helpers
{
    public  static class StringExtension
    {
        public static bool IsSign(this string word)
        {
            try
            {
                var parts = word.Split("/");
                return Regex.IsMatch(parts.Last(), @"sign(up|in)"); 
            }
            catch
            {
                return false;
            }
            
        }
    }
}
