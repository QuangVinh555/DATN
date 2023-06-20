using BookMovieTickets.Data;
using BookMovieTickets.Models;
using BookMovieTickets.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public class CinemaNameRepository : ICinemaNameRepository
    {
        private readonly BookMovieTicketsContext _context;
        public int PAGE_SIZE { get; set; } = 9;

        public CinemaNameRepository(BookMovieTicketsContext context)
        {
            _context = context;
        }
        public MessageVM CreateCinemaName(CinemaNameDTO dto)
        {
            var _cinemaName = new CinemaName();
            var _listCinemaNames = _context.CinemaNames.ToList();
            if(_listCinemaNames.Count > 0)
            {
                foreach(var cinemaName in _listCinemaNames)
                {
                    if (string.Compare(cinemaName.Name, dto.Name, StringComparison.CurrentCultureIgnoreCase) == 0)
                    {
                        return new MessageVM
                        {
                            Message = "Tên đã tồn tại"
                        };
                    }
                }
                _cinemaName.CinemaTypeId = _context.CinemaTypes.Where(x => x.Id == dto.CinemaTypeId).SingleOrDefault().Id;
                _cinemaName.LocationId = _context.Locations.Where(x => x.Id == dto.LocationId).SingleOrDefault().Id;
                _cinemaName.Name = dto.Name;
                _cinemaName.LocationDetail = dto.LocationDetail;
                _context.Add(_cinemaName);
                _context.SaveChanges();
                return new MessageVM
                {
                    Message = "Thêm thành công",
                    Data = new CinemaNameVM
                    {
                        Id = _cinemaName.Id,
                        LocationId = _cinemaName.LocationId,
                        Location = _context.Locations.Where(x => x.Id == _cinemaName.LocationId).SingleOrDefault().Province,
                        CinemaTypeId = _cinemaName.CinemaTypeId,
                        CinemaType = _context.CinemaTypes.Where(x => x.Id == _cinemaName.CinemaTypeId).SingleOrDefault().Name,
                        Logo = _context.CinemaTypes.Where(x => x.Id == _cinemaName.CinemaTypeId).SingleOrDefault().Logo,
                        Name = _cinemaName.Name,
                        LocationDetail = _cinemaName.LocationDetail,
                    }
                };
            }
            else
            {
                _cinemaName.CinemaTypeId = _context.CinemaTypes.Where(x => x.Id == dto.CinemaTypeId).SingleOrDefault().Id;
                _cinemaName.LocationId = _context.Locations.Where(x => x.Id == dto.LocationId).SingleOrDefault().Id;
                _cinemaName.Name = dto.Name;
                _cinemaName.LocationDetail = dto.LocationDetail;
                _context.Add(_cinemaName);
                _context.SaveChanges();
                //var _testCinema = _context.CinemaNames.Where(x => x.Id == _cinemaName.Id).SingleOrDefault();
                //CinemaRoomDTO _testDTO = new CinemaRoomDTO {
                //    CinemaNameId = _cinemaName.Id,
                //    Name = _cinemaName.Name
                //};
                //CinemaRoomRepository _testCinemaRoom = new CinemaRoomRepository(_context);
                //_testCinemaRoom.CreateCinemaRoom(_testDTO);
                //_context.Add(_testCinemaRoom);
                //_context.SaveChanges();
                return new MessageVM
                {
                    Message = "Thêm thành công",
                    Data = new CinemaNameVM
                    {
                        Id = _cinemaName.Id,
                        CinemaTypeId = _cinemaName.CinemaTypeId,
                        LocationId = _cinemaName.LocationId,
                        Name = _cinemaName.Name,
                        Logo = _context.CinemaTypes.Where(x => x.Id == _cinemaName.CinemaTypeId).SingleOrDefault().Logo,
                        LocationDetail = _cinemaName.LocationDetail,
                    }
                };
            }
        }

        public MessageVM DeleteCinemaName(int id)
        {
            var _cinemaName = _context.CinemaNames.Where(x => x.Id == id).SingleOrDefault();
            var _cinemaRoom = _context.CinemaRooms.Where(x => x.CinemaNameId == _cinemaName.Id).ToList();
            if(_cinemaName != null)
            {
                _context.CinemaRooms.RemoveRange(_cinemaRoom);
                _context.CinemaNames.Remove(_cinemaName);
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
                    Message = "Không tìm thấy dữ liệu để xóa !"
                };
            }
        }

        public List<MessageVM> GetAllByPage(int page)
        {
            int totalPage = 0;
            var _list = _context.CinemaNames.ToList();
            foreach (var item in _list)
            {
                totalPage++;
            }
            List<MessageVM> list = new List<MessageVM>();
            var _listCinemaNames = _context.CinemaNames
                 .Skip((int)((page - 1) * PAGE_SIZE)).Take(PAGE_SIZE)
                 .ToList();
            foreach (var item in _listCinemaNames)
            {
                var cinemaName = new MessageVM
                {
                    Message = "Lấy dữ liệu thành công",
                    TotalPage = totalPage,
                    Data = new CinemaNameVM
                    {
                        Id = item.Id,
                        LocationId = item.LocationId,
                        Location = _context.Locations.Where(x =>x.Id == item.LocationId).SingleOrDefault().Province,
                        CinemaTypeId = item.CinemaTypeId,
                        CinemaType = _context.CinemaTypes.Where(x => x.Id == item.CinemaTypeId).SingleOrDefault().Name,
                        Logo = _context.CinemaTypes.Where(x => x.Id == item.CinemaTypeId).SingleOrDefault().Logo,
                        Name = item.Name,
                        LocationDetail = item.LocationDetail
                    }
                };
                list.Add(cinemaName);
            }
            return list;
        }

        public List<MessageVM> GetById(int? locationId, int? cinemaTypeId)
        {
            List<MessageVM> list = new List<MessageVM>();
            if (locationId != 0 && cinemaTypeId != 0)
            {
                var _location = _context.Locations.Where(x => x.Id == locationId).SingleOrDefault();
                var _cinemaType = _context.CinemaTypes.Where(x => x.Id == cinemaTypeId).SingleOrDefault();

                int totalPage = 0;
                var _list = _context.CinemaNames.Where(x => x.LocationId == _location.Id && x.CinemaTypeId == _cinemaType.Id).ToList();
                foreach (var item in _list)
                {
                    totalPage++;
                }

                //var _listCinemaNames = _context.CinemaNames
                //  .Where(x => x.LocationId == _location.Id && x.CinemaTypeId == _cinemaType.Id)
                //  .Skip((int)((page - 1) * PAGE_SIZE)).Take(PAGE_SIZE)
                //  .ToList();

                foreach (var item in _list)
                {
                    var cinemaName = new MessageVM
                    {
                        Message = "Lấy dữ liệu thành công",
                        TotalPage = totalPage,
                        Data = new CinemaNameVM
                        {
                            Id = item.Id,
                            LocationId = item.LocationId,
                            Location = _location.Province,
                            CinemaTypeId = item.CinemaTypeId,
                            CinemaType = _cinemaType.Name,
                            Logo = _cinemaType.Logo,
                            Name = item.Name,
                            LocationDetail = item.LocationDetail
                        }
                    };
                    list.Add(cinemaName);
                }
                return list;

            }
            else if (locationId != 0)
            {
                var _location = _context.Locations.Where(x => x.Id == locationId).SingleOrDefault();
                int totalPage = 0;
                var _list = _context.CinemaNames.Where(x => x.LocationId == _location.Id).ToList();
                foreach (var item in _list)
                {
                    totalPage++;
                }

                //var _listCinemaNames = _context.CinemaNames
                //    .Where(x => x.LocationId == _location.Id)
                //    .Skip((int)((page - 1) * PAGE_SIZE)).Take(PAGE_SIZE)
                //    .ToList();


                foreach (var item in _list)
                {
                    var _cinemaType = _context.CinemaTypes.Where(x => x.Id == item.CinemaTypeId).SingleOrDefault();
                    var cinemaName = new MessageVM
                    {
                        Message = "Lấy dữ liệu thành công",
                        TotalPage = totalPage,
                        Data = new CinemaNameVM
                        {
                            Id = item.Id,
                            LocationId = item.LocationId,
                            Location = _location.Province,
                            CinemaTypeId = item.CinemaTypeId,
                            CinemaType = _cinemaType.Name,
                            Logo = _cinemaType.Logo,
                            Name = item.Name,
                            LocationDetail = item.LocationDetail
                        }
                    };
                    list.Add(cinemaName);
                }
                return list;
            }
            else if (cinemaTypeId != 0)
            {
                var _cinemaType = _context.CinemaTypes.Where(x => x.Id == cinemaTypeId).SingleOrDefault();
                int totalPage = 0;
                var _list = _context.CinemaNames.Where(x => x.CinemaTypeId == _cinemaType.Id).ToList();
                foreach (var item in _list)
                {
                    totalPage++;
                }

                //var _listCinemaNames = _context.CinemaNames
                //    .Where(x => x.CinemaTypeId == _cinemaType.Id)
                //    .Skip((int)((page - 1) * PAGE_SIZE)).Take(PAGE_SIZE)
                //    .ToList();
                foreach (var item in _list)
                {
                    var _location = _context.Locations.Where(x => x.Id == item.LocationId).SingleOrDefault();
                    var cinemaName = new MessageVM
                    {
                        Message = "Lấy dữ liệu thành công",
                        TotalPage = totalPage,
                        Data = new CinemaNameVM
                        {
                            Id = item.Id,
                            LocationId = item.LocationId,
                            Location = _location.Province,
                            CinemaTypeId = item.CinemaTypeId,
                            CinemaType = _cinemaType.Name,
                            Logo = _cinemaType.Logo,
                            Name = item.Name,
                            LocationDetail = item.LocationDetail
                        }
                    };
                    list.Add(cinemaName);
                }
                return list;
            }
            else
            {
                var _listCinemaNames = _context.CinemaNames.Select(x => new MessageVM
                {
                    Message = "Lấy dữ liệu thành công",
                    Data = new CinemaNameVM
                    {
                        Id = x.Id,
                        CinemaTypeId = x.CinemaTypeId,
                        Logo = _context.CinemaTypes.Where(y => y.Id == x.CinemaTypeId).SingleOrDefault().Logo,
                        LocationId = x.Id,
                        Name = x.Name,
                        LocationDetail = x.LocationDetail
                    }
                }).ToList();

                return _listCinemaNames;
            }
        }

        public MessageVM UpdateCinemaName(CinemaNameDTO dto, int id)
        {
            try
            {
                var _cinemaName = _context.CinemaNames.Where(x => x.Id == id).SingleOrDefault();
                if(_cinemaName != null)
                {
                    _cinemaName.LocationId = dto.LocationId;
                    _cinemaName.CinemaTypeId = dto.CinemaTypeId;
                    _cinemaName.Name = dto.Name;
                    _cinemaName.LocationDetail = dto.LocationDetail;
                    _context.SaveChanges();
                    return new MessageVM
                    {
                        Message = "Cập nhật dữ liệu thành công",
                        Data = new CinemaNameVM
                        {
                            Id = _cinemaName.Id,
                            LocationId = _cinemaName.LocationId,
                            Location = _context.Locations.Where(x => x.Id == _cinemaName.LocationId).SingleOrDefault().Province,
                            CinemaTypeId = _cinemaName.Id,
                            CinemaType = _context.CinemaTypes.Where(x => x.Id == _cinemaName.CinemaTypeId).SingleOrDefault().Name,
                            Logo = _context.CinemaTypes.Where(x => x.Id == _cinemaName.CinemaTypeId).SingleOrDefault().Logo,
                            LocationDetail = _cinemaName.LocationDetail
                        }
                    };

                }
                else
                {
                    return new MessageVM
                    {
                        Message = "Không tìm thấy dữ liệu !"
                    };
                }
            }catch(Exception e)
            {
                Console.WriteLine(e.InnerException.Message);
                return new MessageVM
                {
                    Message = e.Message
                };
            }
        }

        public List<MessageVM> GetByMovieId(int? locationId, int? cinemaTypeId, int movieId, DateTime date)
        {
            List<MessageVM> list = new List<MessageVM>();
            if(locationId != 0 && cinemaTypeId != 0)
            {
                var _cinemaNames = _context.CinemaNames.Where(x => x.LocationId == locationId && x.CinemaTypeId == cinemaTypeId).ToList();
                foreach (var item in _cinemaNames)
                {
                    var _showTime = _context.ShowTimes.Where(x => x.CinemaNameId == item.Id && x.MovieId == movieId && x.ShowDate == date).SingleOrDefault();
                    if(_showTime != null)
                    {
                        var cinemaName = _context.CinemaNames.Where(x => x.Id == _showTime.CinemaNameId).SingleOrDefault();
                        var _cinemaName = new MessageVM
                        {
                            Message = "Lấy dữ liệu thành công!",
                            Data = new CinemaNameVM
                            {
                                Id = cinemaName.Id,
                                LocationId = cinemaName.LocationId,
                                Location = _context.Locations.Where(x => x.Id == cinemaName.LocationId).SingleOrDefault().Province,
                                CinemaTypeId = cinemaName.Id,
                                CinemaType = _context.CinemaTypes.Where(x => x.Id == cinemaName.CinemaTypeId).SingleOrDefault().Name,
                                Logo = _context.CinemaTypes.Where(x => x.Id == cinemaName.CinemaTypeId).SingleOrDefault().Logo,
                                LocationDetail = cinemaName.LocationDetail,
                                Name = cinemaName.Name
                            }
                        };
                        list.Add(_cinemaName);
                    }
                    
                }
                return list;
            } else if(locationId != 0)
            {
                var _cinemaNames = _context.CinemaNames.Where(x => x.LocationId == locationId).ToList();
                foreach (var item in _cinemaNames)
                {
                    var _showTime = _context.ShowTimes.Where(x => x.CinemaNameId == item.Id && x.MovieId == movieId && x.ShowDate == date).SingleOrDefault();
                    if (_showTime != null)
                    {
                        var cinemaName = _context.CinemaNames.Where(x => x.Id == _showTime.CinemaNameId).SingleOrDefault();
                        var _cinemaName = new MessageVM
                        {
                            Message = "Lấy dữ liệu thành công!",
                            Data = new CinemaNameVM
                            {
                                Id = cinemaName.Id,
                                LocationId = cinemaName.LocationId,
                                Location = _context.Locations.Where(x => x.Id == cinemaName.LocationId).SingleOrDefault().Province,
                                CinemaTypeId = cinemaName.Id,
                                CinemaType = _context.CinemaTypes.Where(x => x.Id == cinemaName.CinemaTypeId).SingleOrDefault().Name,
                                Logo = _context.CinemaTypes.Where(x => x.Id == cinemaName.CinemaTypeId).SingleOrDefault().Logo,
                                LocationDetail = cinemaName.LocationDetail,
                                Name = cinemaName.Name
                            }
                        };
                        list.Add(_cinemaName);
                    }

                }
                return list;
            }
            else if(cinemaTypeId != 0)
            {
                var _cinemaNames = _context.CinemaNames.Where(x => x.CinemaTypeId == cinemaTypeId).ToList();
                foreach (var item in _cinemaNames)
                {
                    var _showTime = _context.ShowTimes.Where(x => x.CinemaNameId == item.Id && x.MovieId == movieId && x.ShowDate == date).SingleOrDefault();
                    if (_showTime != null)
                    {
                        var cinemaName = _context.CinemaNames.Where(x => x.Id == _showTime.CinemaNameId).SingleOrDefault();
                        var _cinemaName = new MessageVM
                        {
                            Message = "Lấy dữ liệu thành công!",
                            Data = new CinemaNameVM
                            {
                                Id = cinemaName.Id,
                                LocationId = cinemaName.LocationId,
                                Location = _context.Locations.Where(x => x.Id == cinemaName.LocationId).SingleOrDefault().Province,
                                CinemaTypeId = cinemaName.Id,
                                CinemaType = _context.CinemaTypes.Where(x => x.Id == cinemaName.CinemaTypeId).SingleOrDefault().Name,
                                Logo = _context.CinemaTypes.Where(x => x.Id == cinemaName.CinemaTypeId).SingleOrDefault().Logo,
                                LocationDetail = cinemaName.LocationDetail,
                                Name = cinemaName.Name
                            }
                        };
                        list.Add(_cinemaName);
                    }

                }
                return list;
            }
            else
            {
                var _listCinemaNames = _context.CinemaNames.Select(x => new MessageVM
                {
                    Message = "Lấy dữ liệu thành công",
                    Data = new CinemaNameVM
                    {
                        Id = x.Id,
                        CinemaTypeId = x.CinemaTypeId,
                        Logo = _context.CinemaTypes.Where(y => y.Id == x.CinemaTypeId).SingleOrDefault().Logo,
                        LocationId = x.Id,
                        Name = x.Name,
                        LocationDetail = x.LocationDetail
                    }
                }).ToList();

                return _listCinemaNames;
            }
        }
    }
}
