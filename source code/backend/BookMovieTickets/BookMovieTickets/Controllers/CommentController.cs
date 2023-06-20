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
    public class CommentController : ControllerBase
    {
        private readonly ICommentRepository _commentRepository;

        public CommentController(ICommentRepository commentRepository)
        {
            _commentRepository = commentRepository;
        }
        [HttpPost]
        public IActionResult CreateComment(CommentDTO dto)
        {
            try
            {
                return Ok(_commentRepository.CreateComment(dto));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet("movie/{MovieId}")]
        public IActionResult GetAllCommentsByMovieId(int MovieId)
        {
            try
            {
                return Ok(_commentRepository.GetAllCommentsByMovieId(MovieId));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpDelete("{MovieId}/{UserId}")]
        public IActionResult DeleteComment(int MovieId, int UserId)
        {
            try
            {
                return Ok(_commentRepository.DeleteComment(MovieId, UserId));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
