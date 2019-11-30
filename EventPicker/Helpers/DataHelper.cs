using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.Threading.Tasks;

namespace Helpers
{
    public class DataHelper<T> where T: class
    {
        public static async Task<string> GetJsonString(T obj)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(T));
                serializer.WriteObject(ms, obj);
                ms.Position = 0;
                using (StreamReader sr = new StreamReader(ms))
                {
                    return await sr.ReadToEndAsync();
                }
            }
        }
    }
}
