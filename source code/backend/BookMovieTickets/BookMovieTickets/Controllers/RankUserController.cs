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
    public class RankUserController : ControllerBase
    {
        private readonly IRankUserRepository _rankUserRepository;

        public RankUserController(IRankUserRepository rankUserRepository)
        {
            _rankUserRepository = rankUserRepository;
        }

        [HttpPost]
        public IActionResult CreateRankUser(RankUserDTO dto)
        {
            try
            {
                return Ok(_rankUserRepository.CreateRankUser(dto));
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
                return Ok(_rankUserRepository.GetAll());
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateRankUser(RankUserDTO dto, int id)
        {
            try
            {
                return Ok(_rankUserRepository.UpdateRankUser(dto, id));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteRankUser(int id)
        {
            try
            {
                return Ok(_rankUserRepository.DeleteRankUser(id));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
