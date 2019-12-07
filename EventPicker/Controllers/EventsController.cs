using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BLL.Services;
using Helpers;

namespace EventPicker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private MarkService markService;

        public EventsController(MarkService markService)
        {
            this.markService = markService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery]int page, [FromQuery]int offset)
        {
            var result = await markService.ReadForView(page, offset);
            if (result == null)
            {
                return new JsonResult(ErrorHelper.GetError(Enum.ErrorEnum.NotFound));
            }
            return Ok(result);
        }
    }
}