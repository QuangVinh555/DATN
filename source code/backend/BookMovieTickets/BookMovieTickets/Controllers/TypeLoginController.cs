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
    public class TypeLoginController : ControllerBase
    {
        private readonly ITypeLoginRepository _typeLoginRepository;

        public TypeLoginController(ITypeLoginRepository typeLoginRepository)
        {
            _typeLoginRepository = typeLoginRepository;
        }

        [HttpPost]
        public IActionResult CreateTypeLogin(TypeLoginDTO dto)
        {
            try
            {
                return Ok(_typeLoginRepository.CreateTypeLogin(dto));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
