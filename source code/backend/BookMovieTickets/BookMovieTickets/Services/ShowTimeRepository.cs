using BookMovieTickets.Data;
using BookMovieTickets.Models;
using BookMovieTickets.Views;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public class ShowTimeRepository : IShowTimeRepository
    {
        private readonly BookMovieTicketsContext _context;

        public ShowTimeRepository(BookMovieTicketsContext context)
        {
            _context = context;
        }

        public MessageVM CreateShowTime(ShowTimeDTO dto)
        {
            try
            {
                var _showTime = new ShowTime();
                var _listShowTimes = _context.ShowTimes.ToList();
                foreach (var showtime in _listShowTimes)
                {
                    if (showtime.State == false)
                    {
                        _showTime.Id = _context.ShowTimes.Where(x => x.Id == showtime.Id).SingleOrDefault().Id;
                        _showTime.CinemaNameId = null;
                        _showTime.MovieId = null;
                        _showTime.ShowDate = null;
                        _showTime.TicketPrice = null;
                        _showTime.NumTicket = null;
                        _showTime.Role = null;
                        _showTime.State = false;
                        _context.SaveChanges();
                        return new MessageVM
                        {
                            Message = "Tạo thành công suất chiếu có sẵn",
                            Data = new ShowTimeVM
                            {
                                Id = _showTime.Id
                            }
                        };
                    }
                }
                _showTime.CinemaNameId = null;
                _showTime.MovieId = null;
                _showTime.ShowDate = null;
                _showTime.TicketPrice = null;
                _showTime.NumTicket = null;
                _showTime.Role = null;
                _showTime.State = false;
                _context.Add(_showTime);
                _context.SaveChanges();

                return new MessageVM
                {
                    Message = "Tạo thành công suất chiếu",
                    Data = new ShowTimeVM
                    {
                        Id = _showTime.Id
                    }
                };
            }
            catch (Exception e)
            {
                return new MessageVM
                {
                    Message = e.Message
                };
            }
        }

        public MessageVM DeleteShowTime(int id)
        {
            var _showtime = _context.ShowTimes.Where(x => x.Id == id && x.Deleted == false).SingleOrDefault();
            if(_showtime != null)
            {
                _showtime.Deleted = true;
                _context.SaveChanges();
                return new MessageVM
                {
                    Message = "Đã xóa suất chiếu thành công"
                };
            }
            else
            {
                return new MessageVM
                {
                    Message = "Không tìm thấy dữ liệu thông tin này!"
                };
            }

        }

        public List<MessageVM> GetAll()
        {
            var _listShowTimes = _context.ShowTimes.Where(x => x.Deleted == false).ToList();
            List<MessageVM> list = new List<MessageVM>();
            foreach (var item in _listShowTimes)
            {
                var _movie = _context.Movies.Where(x => x.Id == item.MovieId).SingleOrDefault();
                var _cinemaName = _context.CinemaNames.Where(x => x.Id == item.CinemaNameId).SingleOrDefault();
                var _cinemaType = _context.CinemaTypes.Where(x => x.Id == _cinemaName.CinemaTypeId).SingleOrDefault();
                var _location = _context.Locations.Where(x => x.Id == _cinemaName.LocationId).SingleOrDefault();
                var _showTime = new MessageVM
                {
                    Message = " Lấy dữ liệu thành công",
                    Data = new ShowTimeVM
                    {
                        Id = item.Id,
                        Location = _location.Province,
                        CinemaType = _cinemaType.Name,
                        CinemaName = _cinemaName.Name,
                        LocationDetail = _cinemaName.LocationDetail,
                        Movie = _movie.Name,
                        ShowDate = item.ShowDate,
                        TicketPrice = item.TicketPrice,
                        NumTicket = item.NumTicket,
                        Role = item.Role
                    }
                };
                list.Add(_showTime);
            }
            return list;
        }

        public List<MessageVM> GetByCinemaNameIdAndDate(int cinemaName_id, DateTime date)
        {
            var _listShowTimes = _context.ShowTimes.Where(x => x.CinemaNameId == cinemaName_id && x.ShowDate == date && x.Deleted == false).ToList();
            List<MessageVM> list = new List<MessageVM>();
            foreach (var item in _listShowTimes)
            {
                var _movie = _context.Movies.Where(x => x.Id == item.MovieId).SingleOrDefault();
                var _banner = _context.Banners.Where(x => x.MovieId == _movie.Id).SingleOrDefault();
                var _cinemaName = _context.CinemaNames.Where(x => x.Id == item.CinemaNameId).SingleOrDefault();
                var _cinemaType = _context.CinemaTypes.Where(x => x.Id == _cinemaName.CinemaTypeId).SingleOrDefault();
                var _location = _context.Locations.Where(x => x.Id == _cinemaName.LocationId).SingleOrDefault();
                var _showTime = new MessageVM
                {
                    Message = " Lấy dữ liệu thành công",
                    Data = new ShowTimeVM
                    {
                        Id = item.Id,
                        Location = _location.Province,
                        CinemaType = _cinemaType.Name,
                        CinemaName = _cinemaName.Name,
                        LocationDetail = _cinemaName.LocationDetail,
                        Name = _movie.Name,
                        MainSlide = _banner.MainSlide,
                        Category = _movie.Category,
                        Author = _movie.Author,
                        ShowDate = item.ShowDate,
                        TicketPrice = item.TicketPrice,
                        NumTicket = item.NumTicket,
                        Stamp = _movie.Stamp,
                        Role = item.Role
                    }
                };
                list.Add(_showTime);
            }
            return list;
        }

        public MessageVM GetById(int id)
        {
            var _showTime = _context.ShowTimes.Where(x => x.Id == id && x.Deleted == false).SingleOrDefault();
            var _movie = _context.Movies.Where(x => x.Id == _showTime.MovieId).SingleOrDefault();
            var _cinemaName = _context.CinemaNames.Where(x => x.Id == _showTime.CinemaNameId).SingleOrDefault();
            var _cinemaType = _context.CinemaTypes.Where(x => x.Id == _cinemaName.CinemaTypeId).SingleOrDefault();
            var _location = _context.Locations.Where(x => x.Id == _cinemaName.LocationId).SingleOrDefault();
            if (_showTime != null)
            {
                return new MessageVM
                {
                    Message = "Lấy dữ liệu thành công",
                    Data = new ShowTimeVM
                    {
                        Id = _showTime.Id,
                        Location = _location.Province,
                        CinemaType = _cinemaType.Name,
                        CinemaName = _cinemaName.Name,
                        LocationDetail = _cinemaName.LocationDetail,
                        Movie = _movie.Name,
                        ShowDate = _showTime.ShowDate,
                        TicketPrice = _showTime.TicketPrice,
                        NumTicket = _showTime.NumTicket,
                        Role = _showTime.Role
                    }
                };
            }
            else
            {
                return new MessageVM
                {
                    Message = "Không tìm thấy thông tin id này!",
                };
            }
        }

        public List<MessageVM> GetByMovieId(int movieId, int locationId, DateTime date, int cinemaTypeId)
        {
            List<MessageVM> list = new List<MessageVM>();
            // TH cả 4
            if(cinemaTypeId != 0)
            {
                var _listCinemaNames = _context.CinemaNames
                    .Where(x => x.LocationId == locationId && x.CinemaTypeId == cinemaTypeId)
                    .ToList();
                foreach (var cinemaName in _listCinemaNames)
                {
                    var _listShowTimes = _context.ShowTimes
                        .Where(x => x.MovieId == movieId && x.ShowDate == date && x.CinemaNameId == cinemaName.Id)
                        .ToList();
                    foreach (var item in _listShowTimes)
                    {
                        var _cinemaName = _context.CinemaNames.Where(x => x.Id == item.CinemaNameId).SingleOrDefault();
                        var _cinemaType = _context.CinemaTypes.Where(x => x.Id == _cinemaName.CinemaTypeId).SingleOrDefault();
                        var _movie = _context.Movies.Where(x => x.Id == item.MovieId).SingleOrDefault();
                        var _banner = _context.Banners.Where(x => x.MovieId == _movie.Id).SingleOrDefault();
                        var _location = _context.Locations.Where(x => x.Id == _cinemaName.LocationId).SingleOrDefault();
                        var showTime = new MessageVM
                        {
                            Data = new ShowTimeVM
                            {
                                Id = item.Id,
                                CinemaName = _cinemaName.Name,
                                LocationDetail = _cinemaName.LocationDetail,
                                Logo = _cinemaType.Logo,
                                Location = _location.Province,
                                CinemaType = _cinemaType.Name,
                                Name = _movie.Name,
                                MainSlide = _banner.MainSlide,
                                Category = _movie.Category,
                                Author = _movie.Author,
                                ShowDate = item.ShowDate,
                                TicketPrice = item.TicketPrice,
                                NumTicket = item.NumTicket,
                                Stamp = _movie.Stamp,
                                Role = item.Role
                            }
                        };
                        list.Add(showTime);
                    }
                }
                return list;
            }
            // TH cả 3
            else
            {
                var _listCinemaNames = _context.CinemaNames
                    .Where(x => x.LocationId == locationId)
                    .ToList();
                foreach (var cinemaName in _listCinemaNames)
                {
                    var _listShowTimes = _context.ShowTimes
                        .Where(x => x.MovieId == movieId && x.ShowDate == date && x.CinemaNameId == cinemaName.Id)
                        .ToList();
                    foreach (var item in _listShowTimes)
                    {
                        var _cinemaName = _context.CinemaNames.Where(x => x.Id == item.CinemaNameId).SingleOrDefault();
                        var _cinemaType = _context.CinemaTypes.Where(x => x.Id == _cinemaName.CinemaTypeId).SingleOrDefault();
                        var _movie = _context.Movies.Where(x => x.Id == item.MovieId).SingleOrDefault();
                        var _banner = _context.Banners.Where(x => x.MovieId == _movie.Id).SingleOrDefault();
                        var _location = _context.Locations.Where(x => x.Id == _cinemaName.LocationId).SingleOrDefault();
                        var showTime = new MessageVM
                        {
                            Data = new ShowTimeVM
                            {
                                Id = item.Id,
                                CinemaName = _cinemaName.Name,
                                LocationDetail = _cinemaName.LocationDetail,
                                Logo = _cinemaType.Logo,
                                Location = _location.Province,
                                CinemaType = _cinemaType.Name,
                                Name = _movie.Name,
                                MainSlide = _banner.MainSlide,
                                Category = _movie.Category,
                                Author = _movie.Author,
                                ShowDate = item.ShowDate,
                                TicketPrice = item.TicketPrice,
                                NumTicket = item.NumTicket,
                                Stamp = _movie.Stamp,
                                Role = item.Role
                            }
                        };
                        list.Add(showTime);
                    }
                }
                return list;
            }
        }

        public MessageVM UpdateShowTime(ShowTimeDTO dto)
        {
            try
            {
                var _showTime = _context.ShowTimes.Where(x => x.State == false && x.Deleted == false).SingleOrDefault();
                var _movie = _context.Movies.Where(x => x.Id == dto.MovieId).SingleOrDefault();
                var _cinemaName = _context.CinemaNames.Where(x => x.Id == dto.CinemaNameId).SingleOrDefault();
                var _cinemaType = _context.CinemaTypes.Where(x => x.Id == _cinemaName.CinemaTypeId).SingleOrDefault();
                var _location = _context.Locations.Where(x => x.Id == _cinemaName.LocationId).SingleOrDefault();
                //DateTime datetime = DateTime.ParseExact(dto.ShowDate.ToString(), "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                if (_showTime != null)
                {
                    if (_movie == null)
                    {
                        return new MessageVM
                        {
                            Message = "Nhập sai thông tin id movie",
                        };
                    }
                    if (_cinemaName == null)
                    {
                        return new MessageVM
                        {
                            Message = "Nhập sai thông tin id cinemaRoom",
                        };
                    }
                    _showTime.CinemaNameId = _cinemaName.Id;
                    _showTime.MovieId = _movie.Id;
                    _showTime.ShowDate = dto.ShowDate;
                    _showTime.TicketPrice = dto.TicketPrice;
                    _showTime.NumTicket = dto.NumTicket;
                    _showTime.Role = dto.Role;
                    _showTime.State = true;
                    _context.SaveChanges();
                    return new MessageVM
                    {
                        Message = "Cập nhật đầy đủ thông tin suất chiếu thành công",
                        Data = new ShowTimeVM
                        {
                            Id = _showTime.Id,
                            Location = _location.Province,
                            CinemaType = _cinemaType.Name,
                            CinemaName = _cinemaName.Name,
                            LocationDetail = _cinemaName.LocationDetail,
                            Movie = _movie.Name,
                            ShowDate = _showTime.ShowDate,
                            TicketPrice = _showTime.TicketPrice,
                            NumTicket = _showTime.NumTicket,
                            Role = _showTime.Role
                        }
                    };
                }
                else
                {
                    return new MessageVM
                    {
                        Message = "Không tìm thấy thông tin của suất chiếu này"
                    };
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.InnerException.Message);
                return new MessageVM
                {
                    Message = e.Message
                };
            }
        }

        public MessageVM UpdateShowTimeById(ShowTimeDTO dto, int id)
        {
            var _showTime = _context.ShowTimes.Where(x => x.Id == id).SingleOrDefault();
            var _movie = _context.Movies.Where(x => x.Id == dto.MovieId).SingleOrDefault();
            var _cinemaName = _context.CinemaNames.Where(x => x.Id == dto.CinemaNameId).SingleOrDefault();
            var _cinemaType = _context.CinemaTypes.Where(x => x.Id == _cinemaName.CinemaTypeId).SingleOrDefault();
            var _location = _context.Locations.Where(x => x.Id == _cinemaName.LocationId).SingleOrDefault();
            if (_showTime != null)
            {
                if (_movie == null)
                {
                    return new MessageVM
                    {
                        Message = "Nhập sai thông tin id movie",
                    };
                }
                if (_cinemaName == null)
                {
                    return new MessageVM
                    {
                        Message = "Nhập sai thông tin id cinemaRoom",
                    };
                }
                _showTime.CinemaNameId = _cinemaName.Id;
                _showTime.MovieId = _movie.Id;
                _showTime.ShowDate = dto.ShowDate;
                _showTime.TicketPrice = dto.TicketPrice;
                _showTime.NumTicket = dto.NumTicket;
                _showTime.Role = dto.Role;
                _showTime.State = true;
                _context.SaveChanges();
                return new MessageVM
                {
                    Message = "Cập nhật đầy đủ thông tin suất chiếu thành công",
                    Data = new ShowTimeVM
                    {
                        Id = _showTime.Id,
                        Location = _location.Province,
                        CinemaType = _cinemaType.Name,
                        CinemaName = _cinemaName.Name,
                        LocationDetail = _cinemaName.LocationDetail,
                        Movie = _movie.Name,
                        ShowDate = _showTime.ShowDate,
                        TicketPrice = _showTime.TicketPrice,
                        NumTicket = _showTime.NumTicket,
                        Role = _showTime.Role
                    }
                };
            }
            else
            {
                return new MessageVM
                {
                    Message = "Không tìm thấy thông tin của suất chiếu này"
                };
            }
        }
    }
}
