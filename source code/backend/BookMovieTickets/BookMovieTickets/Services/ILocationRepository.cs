using BookMovieTickets.Models;
using BookMovieTickets.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public interface ILocationRepository
    {
        MessageVM CreateLocation(LocationDTO dto);
        List<MessageVM> GetAll();
        List<MessageVM> GetAllByPage(int page);
    }
}
