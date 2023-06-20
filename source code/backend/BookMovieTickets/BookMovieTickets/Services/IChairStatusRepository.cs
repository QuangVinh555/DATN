using BookMovieTickets.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public interface IChairStatusRepository
    {
        List<MessageVM> GetAllChairByHourTimeId(int HourTimeId);
        MessageVM DeleteChairStatus();
    }

}