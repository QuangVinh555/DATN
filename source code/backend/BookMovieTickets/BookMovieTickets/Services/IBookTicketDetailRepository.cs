using BookMovieTickets.Models;
using BookMovieTickets.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public interface IBookTicketDetailRepository
    {
        List<MessageVM> GetAll();
        MessageVM GetById(int id);
        List<MessageVM> GetByTicketId(int bookTicketId);
        MessageVM CreateBookTicketDetail(BookTicketDetailDTO dto);
        MessageVM UpdateBookTicketDetail(BookTicketDetailDTO dto, int id);
        MessageVM DeleteBookTicketDetail(int chairStatusId, int bookTicketId);
        MessageVM DeleteBookTicketDetailByState(int bookTicketId, int hourTimeId);
    }
}
