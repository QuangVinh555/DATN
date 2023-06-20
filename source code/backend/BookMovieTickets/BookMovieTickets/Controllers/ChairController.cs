using BookMovieTickets.Data;
using BookMovieTickets.Models;
using BookMovieTickets.Services;
using Microsoft.AspNetCore.Authorization;
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
    public class ChairController : ControllerBase
    {
        private readonly IChairRepository _chairRepository;

        public ChairController(IChairRepository chairRepository)
        {
            _chairRepository = chairRepository;
        }

        [HttpPost]
        public IActionResult CreateChair(ChairDTO dto)
        {
            try
            {
                return Ok(_chairRepository.CreateChair(dto));
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
                return Ok(_chairRepository.GetAll());
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
                return Ok(_chairRepository.GetById(id));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet("cinemaroom/{cinemaRoomId}")]
        public IActionResult GetByCinemaRoomId(int cinemaRoomId)
        {
            try
            {
                return Ok(_chairRepository.GetByCinemaRoomId(cinemaRoomId));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateChair(ChairDTO dto, int id)
        {
            try
            {
                return Ok(_chairRepository.UpdateChair(dto, id));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteChair(int id)
        {
            try
            {
                return Ok(_chairRepository.DeleteChair(id));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
