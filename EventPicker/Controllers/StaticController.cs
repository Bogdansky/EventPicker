using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Web;

namespace EventPicker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaticController : ControllerBase
    {
        [HttpGet("{name}")]
        public IActionResult GetFile([FromRoute]string name)
        {
            string path = Directory.GetFiles("~/Static", name).FirstOrDefault();
            return PhysicalFile(path, MimeMapping.MimeUtility.GetMimeMapping(path));
        }
    }
}