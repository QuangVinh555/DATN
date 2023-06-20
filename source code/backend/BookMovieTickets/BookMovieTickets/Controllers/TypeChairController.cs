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
    public class TypeChairController : ControllerBase
    {
        private readonly ITypeChairRepository _typeChairRepository;

        public TypeChairController(ITypeChairRepository typeChairRepository)
        {
            _typeChairRepository = typeChairRepository;
        }

        [HttpPost]
        public IActionResult CreateTypeChair(TypeChairDTO dto)
        {
            try
            {
                return Ok(_typeChairRepository.CreateTypeChair(dto));
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
                return Ok(_typeChairRepository.GetAll());
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
                return Ok(_typeChairRepository.GetById(id));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateTypeChair(TypeChairDTO dto, int id)
        {
            try
            {
                return Ok(_typeChairRepository.UpdateTypeChair(dto, id));
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
                return Ok(_typeChairRepository.DeleteTypeChair(id));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
