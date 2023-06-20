using BookMovieTickets.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserPointController : ControllerBase
    {
        private readonly IUserPointRepository _userPointRepository;

        public UserPointController(IUserPointRepository userPointRepository)
        {
            _userPointRepository = userPointRepository;
        }

        [HttpGet("{userId}")]
        public IActionResult GetUserPointByUserId(int userId)
        {
            try
            {
                return Ok(_userPointRepository.GetUserPointByUserId(userId));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
