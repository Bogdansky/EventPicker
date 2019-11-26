using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading.Tasks;

namespace Reading_organizer.BLL.Infrastructure
{
    public static class ErrorMethods
    {
        const string redundant = "k__BackingField";
        public static string ToJson(this Error error)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(Error));
                serializer.WriteObject(ms, error);
                ms.Position = 0;
                using (StreamReader sr = new StreamReader(ms))
                {
                    string result = sr.ReadToEnd();
                    return Process(result);
                }
            }
        }

        static string Process(string json)
        {
            string result = json.Replace("\"<", "\"");
            result = result.Replace($">{redundant}\"","\"");
            return result;
        }
    }
}