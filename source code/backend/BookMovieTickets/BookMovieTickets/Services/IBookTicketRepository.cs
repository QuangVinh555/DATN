using BookMovieTickets.Models;
using BookMovieTickets.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public interface IBookTicketRepository
    {
        List<MessageVM> GetAll();
        MessageVM GetById(int id);
        MessageVM CreateBookTicket(BookTicketDTO dto);
        MessageVM UpdateBookTicket(BookTicketDTO dto, int id);
        MessageVM DeleteBookTicket(int id);
        List<MessageVM> GetBookTicketByUserId(int page, int userId);

    }
}
