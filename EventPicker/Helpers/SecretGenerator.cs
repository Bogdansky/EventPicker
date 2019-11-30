using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Helpers
{
    class SecretGenerator
    {
        public static string GetSecretKey()
        {
            TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();
            tdes.GenerateKey();
            return Encoding.ASCII.GetString(tdes.Key);
        }
    }
}
