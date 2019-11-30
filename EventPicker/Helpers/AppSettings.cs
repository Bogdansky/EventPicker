using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Helpers
{
    static class AppSettings
    {
        private static string SecretKey { get; set; }

        public static void SetSecretKey(string secretKey)
        {
            if (SecretKey != null)
            {
                return;
            }
            SecretKey = secretKey;
        }

        public static string GetSecretKey()
        {
            return SecretKey;
        }
    }
}
