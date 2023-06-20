using BookMovieTickets.Models;
using BookMovieTickets.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public interface ITypeCinemaRepository
    {
        MessageVM CreateTypeCinema(TypeCinemaDTO dto);
        List<MessageVM> GetAll();
        MessageVM UpdateTypeCinema(TypeCinemaDTO dto, int id);
        MessageVM DeleteTypeCinema(int id);
    }
}
