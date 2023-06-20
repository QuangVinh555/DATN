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
    public class CinemaRoomController : ControllerBase
    {
        private readonly ICinemaRoomRepository _cinemaRoomRepository;

        public CinemaRoomController(ICinemaRoomRepository cinemaRoomRepository)
        {
            _cinemaRoomRepository = cinemaRoomRepository;
        }

        [HttpPost]
        public IActionResult CreateCinemaRoom(CinemaRoomDTO dto)
        {
            try
            {
                return Ok(_cinemaRoomRepository.CreateCinemaRoom(dto));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet]
        public IActionResult GetAlll()
        {
            try
            {
                return Ok(_cinemaRoomRepository.GetAll());
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
                return Ok(_cinemaRoomRepository.GetById(id));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet("/api/CinemaRoom/CinemaName")]
        public IActionResult GetAllByCinemaNameId(int cinemaNameId)
        {
            try
            {
                return Ok(_cinemaRoomRepository.GetAllByCinemaNameId(cinemaNameId));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateCinemaRoom(CinemaRoomDTO dto, int id)
        {
            try
            {
                return Ok(_cinemaRoomRepository.UpdateCinemaRoom(dto,id));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteCinemaRoom(int id)
        {
            try
            {
                return Ok(_cinemaRoomRepository.DeleteCinemaRoom(id));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
