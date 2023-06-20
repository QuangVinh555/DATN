using BookMovieTickets.Models;
using BookMovieTickets.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public interface ICinemaNameRepository
    {
        List<MessageVM> GetById(int? locationId, int? cinemaTypeId);
        List<MessageVM> GetByMovieId(int? locationId, int? cinemaTypeId, int movieId, DateTime date);
        List<MessageVM> GetAllByPage(int page);
        MessageVM CreateCinemaName(CinemaNameDTO dto);
        MessageVM UpdateCinemaName(CinemaNameDTO dto, int id);
        MessageVM DeleteCinemaName(int id);
    }
}
