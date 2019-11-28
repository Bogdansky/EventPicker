using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BLL.DTO;
using BLL.Services;
using Helpers;

namespace EventPicker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserService _usersService;

        public UsersController(UserService userService)
        {
            _usersService = userService;
        }

        // GET api/users
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var users = await _usersService.ReadAll();
            return Ok(users);
        }

        // GET api/users/5
        [HttpGet("{id}")]
        public async Task<UserDTO> Get(int id)
        {
            var user = await _usersService.Read(id);
            user.Password = "";
            return user;
        }

        // POST api/users

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] UserDTO body)
        {
            var result = await _usersService.Create(body);
            if (result.Contains("exist"))
            {
                return new JsonResult(new { StatusCode = 400, Message = result });
            }
            var authResult = result == "error" ? null : await _usersService.Authenticate(body, Helpers.AppSettings.GetSecretKey());
            if (authResult != null)
            {
                Response.Cookies.Append("token", authResult.Token);
            }
            else
            {
                return new JsonResult(ErrorHelper.GetError(Enums.ErrorEnum.InternalServerError));
            }
            return Ok(authResult);
        }

        [HttpPost("signin")]
        public async Task<IActionResult> SignIn([FromBody] UserDTO body)
        {
            var authResult = await _usersService.Authenticate(body, AppSettings.GetSecretKey());
            if (authResult != null)
            {
                Response.Cookies.Append("token", authResult.Token);
                _ = Task.Run(() => _usersService.CheckTasks(authResult.Id));
                return Ok(authResult);
            }
            return new JsonResult(new { StatusCode = 400, Message = "Incorrect email or password" });
        }

        // PUT api/users/5
        [HttpPut("{id}")]
        public async void Put(int id, [FromBody] UserDTO value)
        {
            int result = await _usersService.Update(id, value);
        }

        // DELETE api/users/5
        [HttpDelete("{id}")]
        public async Task<UserDTO> Delete(int id)
        {
            try
            {
                return await _usersService.Delete(id);
            }
            catch
            {
                return null;
            }
        }
    }
}
