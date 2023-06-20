using BookMovieTickets.Models;
using BookMovieTickets.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public interface IMovieRepository
    {
        List<MessageVM> GetAll();
        MessageVM GetById(int id);
        List<MessageVM> GetMovieByDateBigger(DateTime id);
        List<MessageVM> GetMovieByDateSmaller(DateTime id);
        MessageVM CreateMovie(MovieDTO dto);
        MessageVM UpdateMovie(MovieDTO dto, int id);
        MessageVM DeleteMovie(int id);
    }
}
