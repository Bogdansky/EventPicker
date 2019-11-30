using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EventPicker.Enum
{
    public enum ErrorEnum
    {
        BadRequest = 400, Unauthorized, Forbidden = 403,
        NotFound, Conflict = 409,

        InternalServerError = 500
    }
}
