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
    public class ChairStatusController : ControllerBase
    {
        private readonly IChairStatusRepository _chairStatusRepository;

        public ChairStatusController(IChairStatusRepository chairStatusRepository)
        {
            _chairStatusRepository = chairStatusRepository;
        }

        [HttpGet("hourtime/{HourTimeId}")]
        public IActionResult GetAllChairByHourTimeId(int HourTimeId)
        {
            try
            {
                return Ok(_chairStatusRepository.GetAllChairByHourTimeId(HourTimeId));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpDelete]
        public IActionResult DeleteChairStatus()
        {
            try
            {
                return Ok(_chairStatusRepository.DeleteChairStatus());
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
