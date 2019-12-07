using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BLL.DTO;
using BLL.Services;
using Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EventPicker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MarkController : ControllerBase
    {
        private MarkService markService;

        public MarkController(MarkService markService) => this.markService = markService;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await markService.ReadAll();
            if (result == null)
            {
                return new JsonResult(ErrorHelper.GetError(Enum.ErrorEnum.NotFound));
            }
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserMarks([FromRoute]int id)
        {
            
            var result = await markService.ReadAll(id);
            if (result == null)
            {
                return new JsonResult(ErrorHelper.GetError(Enum.ErrorEnum.NotFound));
            }
            return Ok(result);
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> Create([FromRoute]int id, [FromBody]CoordinatesDTO coordinates)
        {
            var result = await markService.Create(id, coordinates);
            if (result == null)
            {
                return new JsonResult(ErrorHelper.GetError(Enum.ErrorEnum.BadRequest));
            }
            if (result.Id == -1)
            {
                return new JsonResult(ErrorHelper.GetError(Enum.ErrorEnum.Unauthorized));
            }
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromRoute]int id, [FromBody]MarkDTO mark)
        {
            var result = await markService.Update(id, mark);
            switch(result)
            {
                case -1:
                    return new JsonResult(ErrorHelper.GetError(Enum.ErrorEnum.NotFound));
                case 0:
                    return new JsonResult(ErrorHelper.GetError(Enum.ErrorEnum.BadRequest));
                default:
                    return Ok(result);
            }
        }

        [HttpDelete("{markId}/user/{userId}")]
        public async Task<IActionResult> Delete([FromRoute]int markId, [FromRoute]int userId)
        {
            var result = await markService.Delete(markId, userId);
            if (result == null)
            {
                return new JsonResult(ErrorHelper.GetError(Enum.ErrorEnum.BadRequest));
            }
            return Ok(result);
        }
    }
}