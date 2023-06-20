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
    public class TypeCinemaController : ControllerBase
    {
        private readonly ITypeCinemaRepository _typeCinemaRepository;

        public TypeCinemaController(ITypeCinemaRepository typeCinemaRepository)
        {
            _typeCinemaRepository = typeCinemaRepository;
        }

        [HttpPost]
        public IActionResult CreateTypeCinema(TypeCinemaDTO dto)
        {
            try
            {
                return Ok(_typeCinemaRepository.CreateTypeCinema(dto));
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
                return Ok(_typeCinemaRepository.GetAll());
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateTypeCinema(TypeCinemaDTO dto, int id)
        {
            try
            {
                return Ok(_typeCinemaRepository.UpdateTypeCinema(dto, id));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTypeCinema(int id)
        {
            try
            {
                return Ok(_typeCinemaRepository.DeleteTypeCinema(id));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
