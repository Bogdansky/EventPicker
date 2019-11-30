using BLL.Infrastructure;
using EventPicker.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Helpers
{
    public class ErrorHelper
    {

        private static Error[] Errors => new[]
        {
            new Error {StatusCode = 400, Message = "Bad request"},
            new Error {StatusCode = 401, Message = "User is unathorized"},
            new Error {StatusCode = 403, Message = "Forbidden"},
            new Error {StatusCode = 409, Message = "Conflict. Resource is exist yet"},
            new Error {StatusCode = 500, Message = "Inner server exception"}
        };

        public static Error GetError(ErrorEnum error)
        {
            return Errors.FirstOrDefault(err => err.StatusCode == (int)error);
        }

        public static Error GetError(string statusCode)
        {
            int code = Convert.ToInt32(statusCode);
            code = code != 0 ? code : 400;
            return Errors.FirstOrDefault(err => err.StatusCode == code);
        }

        public static string GetErrorJson(string statusCode)
        {
            return ErrorMethods.ToJson(GetError(statusCode));
        }
    }
}
