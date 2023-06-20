using BookMovieTickets.Data;
using BookMovieTickets.Views;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public class ChairStatusRepository : IChairStatusRepository
    {
        private readonly BookMovieTicketsContext _context;

        public ChairStatusRepository(BookMovieTicketsContext context)
        {
            _context = context;
        }

        public MessageVM DeleteChairStatus()
        {
            try
            {
                var currentDate = DateTime.Now.Date;
                var _listShowTimes = _context.ShowTimes.Where(x =>x.Deleted == false).ToList();
                foreach (var showTime in _listShowTimes)
                {
                    var sqlDateTime = showTime.ShowDate;
                    if (sqlDateTime < currentDate)
                    {
                        var _listHourTimes = _context.HourTimes.Where(x => x.ShowTimeId == showTime.Id).ToList();
                        foreach (var hourTime in _listHourTimes)
                        {
                            var _listChairStatus = _context.ChairStatuses.Where(x => x.HourTimeId == hourTime.Id).ToList();
                            _context.ChairStatuses.RemoveRange(_listChairStatus);
                        }

                    }
                }
                _context.SaveChanges();
                return new MessageVM
                {
                    Message = "Đã xóa thành công!"
                };
            }catch(Exception e)
            {
                Console.WriteLine(e.InnerException.Message);
                return new MessageVM
                {
                    Message = e.Message
                };
            }
        }

        public List<MessageVM> GetAllChairByHourTimeId(int HourTimeId)
        {
            List<MessageVM> list = new List<MessageVM>();
            var _listChairs = _context.ChairStatuses.Where(x => x.HourTimeId == HourTimeId).ToList();
            foreach (var item in _listChairs)
            {
                var _chair = new MessageVM
                {
                    Message = "Lấy dữ liệu thành công",
                    Data = new ChairStatusVM
                    {
                        Id = item.Id,
                        ChairId = item.ChairId,
                        Chair = _context.Chairs.Where(x => x.Id == item.ChairId).SingleOrDefault().Name,
                        ChairTypeId = _context.Chairs.Where(x => x.Id == item.ChairId).SingleOrDefault().ChairTypeId,
                        Status = item.Status
                    }
                };
                list.Add(_chair);
            }
            return list;
        }
    }
}
