using BookMovieTickets.Data;
using BookMovieTickets.Models;
using BookMovieTickets.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public class CinemaRoomRepository : ICinemaRoomRepository
    {
        private readonly BookMovieTicketsContext _context;

        public CinemaRoomRepository(BookMovieTicketsContext context)
        {
            _context = context;
        }
        public MessageVM CreateCinemaRoom(CinemaRoomDTO dto)
        {

            var _cinemaRoom = new CinemaRoom();
            var _listCinemaRooms = _context.CinemaRooms.ToList();
            var _cinemaName = _context.CinemaNames.Where(x => x.Id == dto.CinemaNameId).SingleOrDefault();
            if (_cinemaName == null)
            {
                return new MessageVM
                {
                    Message = "Phải điền thông tin rạp cho phòng chiếu này"
                };
            }
            else
            {
                foreach (var cinemaRoom in _listCinemaRooms)
                {
                    if (_cinemaName.Id == cinemaRoom.CinemaNameId)
                    {
                        if (string.Compare(cinemaRoom.Name, dto.Name, StringComparison.CurrentCultureIgnoreCase) == 0)
                        {
                            return new MessageVM
                            {
                                Message = "Tên đã tồn tại"
                            };
                        }
                    }
                }
                _cinemaRoom.CinemaNameId = _cinemaName.Id;
                _cinemaRoom.Name = dto.Name;
                _cinemaRoom.NumChair = dto.NumChair;
                _context.Add(_cinemaRoom);
                _context.SaveChanges();

                try
                {
                    var _cinemaRoomNew = _context.CinemaRooms.Where(x => x.Id == _cinemaRoom.Id).SingleOrDefault();
                    int _chairType = 0;
                    var _nameChair = "";
                    int a = 1, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, s = 1;
                    for (int i = 1; i <= _cinemaRoomNew.NumChair; i++)
                    {
                        if (i <= 64)
                        {
                            _chairType = 1;
                            if (i <= 16)
                            {
                                _nameChair = "A" + a;
                                a++;
                            }
                            else if (i > 16 && i <= 32)
                            {
                                _nameChair = "B" + b;
                                b++;
                            }
                            else if (i > 32 && i <= 48)
                            {
                                _nameChair = "C" + c;
                                c++;
                            }
                            else if (i > 48 && i <= 64)
                            {
                                _nameChair = "D" + d;
                                d++;
                            }
                        }
                        else if (i > 64 && i <= 128)
                        {
                            _chairType = 2;
                            if (i > 64 && i <= 80)
                            {
                                _nameChair = "E" + e;
                                e++;
                            }
                            else if (i > 80 && i <= 96)
                            {
                                _nameChair = "F" + f;
                                f++;
                            }
                            else if (i > 96 && i <= 112)
                            {
                                _nameChair = "G" + g;
                                g++;
                            }
                            else if (i > 112 && i <= 128)
                            {
                                _nameChair = "H" + h;
                                h++;
                            }
                        }
                        else
                        {
                            _chairType = 3;
                            _nameChair = "S" + s + " " + "S" + ++s;
                            s++;
                        }
                        ChairDTO _chairDTO = new ChairDTO
                        {
                            CinemaRoomId = _cinemaRoom.Id,
                            ChairTypeId = _chairType,
                            Name = _nameChair,
                            Flag = 0
                        };
                        ChairRepository _chairRepository = new ChairRepository(_context);
                        _chairRepository.CreateChair(_chairDTO);
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.InnerException.Message);
                    return new MessageVM
                    {
                        Message = e.Message,
                    };
                }

                return new MessageVM
                {
                    Message = "Thêm phòng chiếu thành công",
                    Data = new CinemaRoomVM
                    {
                        Id = _cinemaRoom.Id,
                        Name = _cinemaRoom.Name,
                        CinemaNameId = _cinemaRoom.CinemaNameId,
                        NumChair = _cinemaRoom.NumChair
                    }
                };
            }



            //var _cinemaRoom = new CinemaRoom();
            //var _listCinemaRooms = _context.CinemaRooms.ToList();
            //var _cinemaName = _context.CinemaNames.Where(x => x.Id == dto.CinemaNameId).SingleOrDefault();
            //if(_cinemaName == null)
            //{
            //    return new MessageVM
            //    {
            //        Message = "Phải điền thông tin rạp cho phòng chiếu này"
            //    };
            //}
            //else
            //{
            //    foreach (var cinemaRoom in _listCinemaRooms)
            //    {
            //        if(_cinemaName.Id == cinemaRoom.CinemaNameId)
            //        {
            //            if (string.Compare(cinemaRoom.Name, dto.Name, StringComparison.CurrentCultureIgnoreCase) == 0)
            //            {
            //                return new MessageVM
            //                {
            //                    Message = "Tên đã tồn tại"
            //                };
            //            }
            //        }
            //    }
            //    _cinemaRoom.CinemaNameId = _cinemaName.Id;
            //    _cinemaRoom.Name = dto.Name;
            //    _context.Add(_cinemaRoom);
            //    _context.SaveChanges();
            //    return new MessageVM
            //    {
            //        Message = "Thêm phòng chiếu thành công",
            //        Data = new CinemaRoomVM
            //        {
            //            Id = _cinemaRoom.Id,
            //            Name = _cinemaRoom.Name,
            //            CinemaNameId = _cinemaRoom.CinemaNameId
            //        }
            //    };
            //}

        }

        public MessageVM DeleteCinemaRoom(int id)
        {
            var _cinemaRoom = _context.CinemaRooms.Where(x => x.Id == id).SingleOrDefault();
            if(_cinemaRoom != null)
            {
                var _hourTime = _context.HourTimes.Where(x => x.CinemaRoomId == _cinemaRoom.Id).ToList();
                var _chair = _context.Chairs.Where(x => x.CinemaRoomId == _cinemaRoom.Id).ToList();
                _context.RemoveRange(_hourTime);
                _context.RemoveRange(_chair);
                _context.Remove(_cinemaRoom);
                _context.SaveChanges();
                return new MessageVM
                {
                    Message = "Xóa dữ liệu thành công",
                };
            }
            else
            {
                return new MessageVM
                {
                    Message = "Không tìm thấy dữ liệu"
                };
            }
        }

        public List<MessageVM> GetAll()
        {
            var _listCinemaRooms = _context.CinemaRooms.Select(x => new MessageVM
            {
                Message = "Lấy dữ liệu thành công",
                Data = new CinemaRoomVM
                {
                    Id = x.Id,
                    Name = x.Name,
                    CinemaNameId = x.CinemaNameId,
                    NumChair = x.NumChair

                }
            }).ToList();
            return _listCinemaRooms;
        }

        public List<MessageVM> GetAllByCinemaNameId(int cinemaNameId)
        {
            var _listCinemaRooms = _context.CinemaRooms.Where(x => x.CinemaNameId == cinemaNameId).ToList();
            List<MessageVM> list = new List<MessageVM>();
            foreach (var item in _listCinemaRooms)
            {
                var cinemaRoom = new MessageVM
                {
                    Message = "Lấy dữ liệu thành công",
                    Data = new CinemaRoomVM
                    {
                        Id = item.Id,
                        CinemaNameId = item.CinemaNameId,
                        Name = item.Name,
                        NumChair = item.NumChair
                    }
                };
                list.Add(cinemaRoom);
            }
            return list;
        }

        public MessageVM GetById(int id)
        {
            var _cinemaRoom = _context.CinemaRooms.Where(x => x.Id == id).SingleOrDefault();
            if(_cinemaRoom != null)
            {
                return new MessageVM
                {
                    Message = "Lấy dữ liệu thành công",
                    Data = new CinemaRoomVM
                    {
                        Id = _cinemaRoom.Id,
                        Name = _cinemaRoom.Name,
                        CinemaNameId = _cinemaRoom.CinemaNameId,
                        NumChair = _cinemaRoom.NumChair

                    }
                };
            }
            else
            {
                return new MessageVM
                {
                    Message = "Không tìm thấy Id này"
                };
            }
        }

        public MessageVM UpdateCinemaRoom(CinemaRoomDTO dto, int id)
        {
            var _cinemaRoom = _context.CinemaRooms.Where(x => x.Id == id).SingleOrDefault();
            var _cinemaName = _context.CinemaNames.Where(x => x.Id == dto.CinemaNameId).SingleOrDefault();
            var _listCinemaRooms = _context.CinemaRooms.ToList();
            if (_cinemaRoom != null)
            {
                if(dto.NumChair > _cinemaRoom.NumChair || dto.NumChair < _cinemaRoom.NumChair || _cinemaRoom.NumChair == null)
                {
                    try
                    {

                    var _listChairs = _context.Chairs.Where(x => x.CinemaRoomId == _cinemaRoom.Id).ToList();
                        foreach (var item in _listChairs)
                        {
                            item.Deleted = true;
                        }
                        _context.SaveChanges();
                    }
                    catch(Exception e)
                    {
                        Console.WriteLine(e.InnerException.Message);
                    }

                    try
                    {
                        int _chairType = 0;
                        var _nameChair = "";
                        int a = 1, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, s = 1;
                        for (int i = 1; i <= dto.NumChair; i++)
                        {
                            if (i <= 64)
                            {
                                _chairType = 1;
                                if (i <= 16)
                                {
                                    _nameChair = "A" + a;
                                    a++;
                                }
                                else if (i > 16 && i <= 32)
                                {
                                    _nameChair = "B" + b;
                                    b++;
                                }
                                else if (i > 32 && i <= 48)
                                {
                                    _nameChair = "C" + c;
                                    c++;
                                }
                                else if (i > 48 && i <= 64)
                                {
                                    _nameChair = "D" + d;
                                    d++;
                                }
                            }
                            else if (i > 64 && i <= 128)
                            {
                                _chairType = 2;
                                if (i > 64 && i <= 80)
                                {
                                    _nameChair = "E" + e;
                                    e++;
                                }
                                else if (i > 80 && i <= 96)
                                {
                                    _nameChair = "F" + f;
                                    f++;
                                }
                                else if (i > 96 && i <= 112)
                                {
                                    _nameChair = "G" + g;
                                    g++;
                                }
                                else if (i > 112 && i <= 128)
                                {
                                    _nameChair = "H" + h;
                                    h++;
                                }
                            }
                            else
                            {
                                _chairType = 3;
                                _nameChair = "S" + s + " " + "S" + ++s;
                                s++;
                            }
                            ChairDTO _chairDTO = new ChairDTO
                            {
                                CinemaRoomId = _cinemaRoom.Id,
                                ChairTypeId = _chairType,
                                Name = _nameChair
                            };
                            ChairRepository _chairRepository = new ChairRepository(_context);
                            _chairRepository.CreateChair(_chairDTO);
                        }
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e.InnerException.Message);
                        return new MessageVM
                        {
                            Message = e.Message,
                        };
                    }
                }
               
                _cinemaRoom.Name = dto.Name;
                _cinemaRoom.CinemaNameId = _cinemaName.Id;
                _cinemaRoom.NumChair = dto.NumChair;
                _context.SaveChanges();
    
                return new MessageVM
                {
                    Message = "Cập nhật phòng chiếu thành công",
                    Data = new CinemaRoomVM
                    {
                        Id = _cinemaRoom.Id,
                        Name = _cinemaRoom.Name,
                        CinemaNameId = _cinemaRoom.CinemaNameId
                    }
                };
            }
            else
            {
                return new MessageVM
                {
                    Message = "Không tìm thấy Id này",                
                };
            }
        }
    }
}
