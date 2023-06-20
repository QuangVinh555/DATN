using BookMovieTickets.Models;
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
    public class HourTimeController : ControllerBase
    {
        private readonly IHourTimeRepository _hourTimeRepository;

        public HourTimeController(IHourTimeRepository hourTimeRepository)
        {
            _hourTimeRepository = hourTimeRepository;
        }

        [HttpPost]
        public IActionResult CreateHourTime(HourTimeDTO dto)
        {
            try
            {
                return Ok(_hourTimeRepository.CreateHourTime(dto));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            try
            {
                return Ok(_hourTimeRepository.GetAll());
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            try
            {
                return Ok(_hourTimeRepository.GetById(id));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet("showtime/{showtime_id}")]
        public IActionResult GetByShowTimeId(int showtime_id)
        {
            try
            {
                return Ok(_hourTimeRepository.GetByShowTimeId(showtime_id));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet("cinemaRoom")]
        public IActionResult GetHourByCinemaRoomId(int cinemaRoom_id, int showTime_id)
        {
            try
            {
                return Ok(_hourTimeRepository.GetHourByCinemaRoomId(cinemaRoom_id, showTime_id));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateRole(HourTimeDTO dto, int id)
        {
            try
            {
                return Ok(_hourTimeRepository.UpdateHourTime(dto, id));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteHourTime(int id)
        {
            try
            {
                return Ok(_hourTimeRepository.DeleteHourTime(id));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
