using BookMovieTickets.Data;
using BookMovieTickets.Models;
using BookMovieTickets.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public class HourTimeRepository : IHourTimeRepository
    {
        private readonly BookMovieTicketsContext _context;

        public HourTimeRepository(BookMovieTicketsContext context)
        {
            _context = context;
        }
        public MessageVM CreateHourTime(HourTimeDTO dto)
        {
            var _hourTime = new HourTime();
            var _listHourTimes = _context.HourTimes.ToList();
            var _showTime = _context.ShowTimes.Where(x => x.Id == dto.ShowTimeId).SingleOrDefault();
            if(_showTime == null)
            {
                return new MessageVM
                {
                    Message = "Thông tin id showtime không chính xác",
                };
            }
            foreach(var hourTime in _listHourTimes)
            {
                if(hourTime.ShowTimeId == _showTime.Id)
                {
                    if (string.Compare(hourTime.Time, dto.Time, StringComparison.CurrentCultureIgnoreCase) == 0)
                    {
                        return new MessageVM
                        {
                            Message = "Trong suất chiếu này, giờ này đã được tạo"
                        };
                    }
                }
            }
            _hourTime.ShowTimeId = _showTime.Id;
            _hourTime.CinemaRoomId = dto.CinemaRoomId;
            _hourTime.Time = dto.Time;
            _hourTime.EndTime = dto.EndTime;
            _context.Add(_hourTime);
            _context.SaveChanges();

            var _cinemaRoom = _context.CinemaRooms.Where(x => x.Id == _hourTime.CinemaRoomId).SingleOrDefault();
            var _listChairs = _context.Chairs.Where(x=>x.Deleted == false && x.CinemaRoomId == _cinemaRoom.Id).ToList();
            foreach (var item in _listChairs)
            {
                    var _chairStatus = new ChairStatus();
                    _chairStatus.HourTimeId = _hourTime.Id;
                    _chairStatus.ChairId = item.Id;
                    _context.Add(_chairStatus);
                    _context.SaveChanges();
            }
            return new MessageVM
            {
                Message = "Tạo giờ chiếu thành công",
                Data = new HourTimeVM
                {
                    Id = _hourTime.Id,
                    ShowTimeId = _hourTime.ShowTimeId,
                    CinemaRoomId = _hourTime.CinemaRoomId,
                    Time = _hourTime.Time,
                    EndTime = _hourTime.EndTime
                }
            };
        }

        public MessageVM DeleteHourTime(int id)
        {
            var _hourTime = _context.HourTimes.Where(x => x.Id == id).SingleOrDefault();
            if(_hourTime != null)
            {
                var _listChairStatus = _context.ChairStatuses.Where(x => x.HourTimeId == _hourTime.Id).ToList();
                _context.ChairStatuses.RemoveRange(_listChairStatus);
                _context.Remove(_hourTime);
                _context.SaveChanges();
                return new MessageVM
                {
                    Message = "Xóa thành công"
                };
            }
            else
            {
                return new MessageVM
                {
                    Message = "Không tìm thấy thông tin id này!"
                };
            }
        }

        public List<MessageVM> GetAll()
        {
            var _listHourTimes = _context.HourTimes.Select(x => new MessageVM
            {
                Message = "Lấy dữ liệu thành công",
                Data = new HourTimeVM
                {
                    Id = x.Id,
                    ShowTimeId = x.ShowTimeId,
                    CinemaRoomId = x.CinemaRoomId,
                    CinemaRoom = _context.CinemaRooms.Where(y => y.Id == x.CinemaRoomId).SingleOrDefault().Name,
                    Time = x.Time,
                    EndTime = x.EndTime
                }
            }).ToList();
            return _listHourTimes;
        }

        public MessageVM GetById(int id)
        {
            var _hourTime = _context.HourTimes.Where(x => x.Id == id).SingleOrDefault();
            if(_hourTime != null)
            {
                return new MessageVM
                {
                    Message = "Lấy dữ liệu thành công",
                    Data = new HourTimeVM
                    {
                        Id = _hourTime.Id,
                        ShowTimeId = _hourTime.ShowTimeId,
                        CinemaRoomId = _hourTime.CinemaRoomId,
                        CinemaRoom = _context.CinemaRooms.Where(x => x.Id == _hourTime.CinemaRoomId).SingleOrDefault().Name,
                        Time = _hourTime.Time,
                        EndTime = _hourTime.EndTime
                    }
                };
            }
            else
            {
                return new MessageVM
                {
                    Message = "Không tìm thấy thông tin id này!"
                };
            }
        }

        public MessageVM GetByShowTimeId(int showTime_id)
        {
            var _hourTime = _context.HourTimes.Where(x => x.ShowTimeId == showTime_id).ToList();
            if(_hourTime.Count > 0)
            {
                var _listHourTimes = _hourTime.Select(x => new HourTimeVM
                {
                    Id = x.Id,
                    ShowTimeId = x.ShowTimeId,
                    CinemaRoomId = x.CinemaRoomId,
                    CinemaRoom = _context.CinemaRooms.Where(y => y.Id == x.CinemaRoomId).SingleOrDefault().Name,
                    Time = x.Time,
                    EndTime = x.EndTime
                });
                return new MessageVM
                {
                    Message = "Lấy dữ liệu thành công",
                    Data = _listHourTimes
                };
            }
            else
            {
                return new MessageVM
                {
                    Message = "Không tìm thấy thông tin của showtime này"
                };
            }
        }

        public List<MessageVM> GetHourByCinemaRoomId(int cinemaRoom_id, int showTime_id)
        {
            List<MessageVM> list = new List<MessageVM>();
            var _listHourTimes = _context.HourTimes.Where(x => x.CinemaRoomId == cinemaRoom_id && x.ShowTimeId == showTime_id).ToList();
            foreach (var item in _listHourTimes)
            {
                var _hourTime = new MessageVM
                {
                    Message = "Lấy dữ liệu thành công",
                    Data = new HourTimeVM
                    {
                        Id = item.Id,
                        ShowTimeId = item.ShowTimeId,
                        CinemaRoomId = item.CinemaRoomId,
                        Time = item.Time,
                        EndTime = item.EndTime
                    }
                };
                list.Add(_hourTime);
            }
            return list;
        }

        public MessageVM UpdateHourTime(HourTimeDTO dto, int id)
        {
            var _hourTime = _context.HourTimes.Where(x => x.Id == id).SingleOrDefault();
            var _showTime = _context.ShowTimes.Where(x => x.Id == dto.ShowTimeId).SingleOrDefault();
            if(_hourTime != null)
            {
                if(_showTime == null)
                {
                    return new MessageVM
                    {
                        Message = "Nhập thông tin showtime chưa chính xác"
                    };
                }
                _hourTime.ShowTimeId = _showTime.Id;
                _hourTime.Time = dto.Time;
                _hourTime.EndTime = dto.EndTime;
                _context.SaveChanges();
                return new MessageVM
                {
                    Message = "Cập nhật thành công",
                    Data = new HourTimeVM
                    {
                        Id = _hourTime.Id,
                        ShowTimeId = _hourTime.ShowTimeId,
                        Time = _hourTime.Time,
                        EndTime = _hourTime.EndTime
                    }
                };
            }
            else
            {
                return new MessageVM
                {
                    Message = "Không tìm thấy thông tin id này!"
                };
            }
        }
    }
}
