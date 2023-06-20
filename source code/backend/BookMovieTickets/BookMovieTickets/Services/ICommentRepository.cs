using BookMovieTickets.Models;
using BookMovieTickets.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public interface ICommentRepository
    {
        List<MessageVM> GetAllCommentsByMovieId(int MovieId);
        MessageVM CreateComment(CommentDTO dto);
        MessageVM DeleteComment(int id, int UserId);
    }
}
