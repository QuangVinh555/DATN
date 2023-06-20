using BookMovieTickets.Models;
using BookMovieTickets.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public interface IHourTimeRepository
    {
        List<MessageVM> GetAll();
        MessageVM GetById(int id);
        MessageVM GetByShowTimeId(int showtime_id);
        List<MessageVM> GetHourByCinemaRoomId(int cinemaRoom_id, int showTime_id);
        MessageVM CreateHourTime(HourTimeDTO dto);
        MessageVM UpdateHourTime(HourTimeDTO dto, int id);
        MessageVM DeleteHourTime(int id);
    }
}
