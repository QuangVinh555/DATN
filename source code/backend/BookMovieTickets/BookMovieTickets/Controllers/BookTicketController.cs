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
    public class BookTicketController : ControllerBase
    {
        private readonly IBookTicketRepository _bookTicketRepository;

        public BookTicketController(IBookTicketRepository bookTicketRepository)
        {
            _bookTicketRepository = bookTicketRepository;
        }

        [HttpPost]
        public IActionResult CreateBookTicket(BookTicketDTO dto)
        {
            try
            {
                return Ok(_bookTicketRepository.CreateBookTicket(dto));
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
                return Ok(_bookTicketRepository.GetAll());
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
                return Ok(_bookTicketRepository.GetById(id));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet("/api/bookticket/page")]
        public IActionResult GetBookTicketByUserId(int page, int userId)
        {
            try
            {
                return Ok(_bookTicketRepository.GetBookTicketByUserId(page, userId));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateBookTicket(BookTicketDTO dto, int id)
        {
            try
            {
                return Ok(_bookTicketRepository.UpdateBookTicket(dto,id));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteCombo(int id)
        {
            try
            {
                return Ok(_bookTicketRepository.DeleteBookTicket(id));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
