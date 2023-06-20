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
    public class CinemaNameController : ControllerBase
    {
        private readonly ICinemaNameRepository _cinemaNameRepository;

        public CinemaNameController(ICinemaNameRepository cinemaNameRepository)
        {
            _cinemaNameRepository = cinemaNameRepository;
        }

        [HttpPost]
        public IActionResult CreateCinemaName(CinemaNameDTO dto)
        {
            try
            {
                return Ok(_cinemaNameRepository.CreateCinemaName(dto));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet]
        public IActionResult GetById(int locationId, int cinemaTypeId)
        {
            try
            {
                return Ok(_cinemaNameRepository.GetById(locationId, cinemaTypeId));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet("/api/cinemaName/page")]
        public IActionResult GetAllByPage(int page)
        {
            try
            {
                return Ok(_cinemaNameRepository.GetAllByPage(page));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet("/api/cinemaName/bymovie")]
        public IActionResult GetByMovieId(int locationId, int cinemaTypeId, int movieId, DateTime date)
        {
            try
            {
                return Ok(_cinemaNameRepository.GetByMovieId(locationId, cinemaTypeId, movieId, date));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateCinemaName(CinemaNameDTO dto, int id)
        {
            try
            {
                return Ok(_cinemaNameRepository.UpdateCinemaName(dto, id));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteCinemaName(int id)
        {
            try
            {
                return Ok(_cinemaNameRepository.DeleteCinemaName(id));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
