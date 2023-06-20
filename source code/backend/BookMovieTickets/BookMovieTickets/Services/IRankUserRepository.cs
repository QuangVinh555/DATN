using BookMovieTickets.Models;
using BookMovieTickets.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public interface IRankUserRepository

    {
        MessageVM CreateRankUser(RankUserDTO dto);
        MessageVM UpdateRankUser(RankUserDTO dto, int id);
        List<MessageVM> GetAll();
        MessageVM DeleteRankUser(int id);

    }
}
