using BookMovieTickets.Models;
using BookMovieTickets.Services;
using BookMovieTickets.Views;
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
    public class ShowTimeController : ControllerBase
    {
        private readonly IShowTimeRepository _showTimeRepository;

        public ShowTimeController(IShowTimeRepository showTimeRepository)
        {
            _showTimeRepository = showTimeRepository;
        }

        [HttpPost]
        public IActionResult CreateShowTime(ShowTimeDTO dto)
        {
            try
            {
                return Ok(_showTimeRepository.CreateShowTime(dto));
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
                return Ok(_showTimeRepository.GetAll());
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
                return Ok(_showTimeRepository.GetById(id));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet("movie")]
        public IActionResult GetByMovieId(int movieId, int locationId, DateTime date, int cinemaTypeId)
        {
            try
            {
                return Ok(_showTimeRepository.GetByMovieId(movieId, locationId, date, cinemaTypeId));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet("/api/ShowTime/info")]
        public IActionResult GetByCinemaNameIdAndDate(int cinemaName_id, DateTime date)
        {
            try
            {
                return Ok(_showTimeRepository.GetByCinemaNameIdAndDate(cinemaName_id, date));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPut]
        public IActionResult UpdateShowTime(ShowTimeDTO dto)
        {
            try
            {
                return Ok(_showTimeRepository.UpdateShowTime(dto));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateShowTimeById(ShowTimeDTO dto, int id)
        {
            try
            {
                return Ok(_showTimeRepository.UpdateShowTimeById(dto,id));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteRole(int id)
        {
            try
            {
                return Ok(_showTimeRepository.DeleteShowTime(id));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
