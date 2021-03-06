﻿using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Infrastructure
{
    [Serializable]
    public class Error
    {
        public int StatusCode { get; set; }
        public string Message { get; set; }

        public override string ToString()
        {
            return $"{{ \"statusCode\":\"{StatusCode}\",\"message\":\"{Message}\"}}";
        }
    }
}
