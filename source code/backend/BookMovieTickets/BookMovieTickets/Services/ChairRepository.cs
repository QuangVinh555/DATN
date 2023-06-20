using BookMovieTickets.Data;
using BookMovieTickets.Models;
using BookMovieTickets.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public class ChairRepository : IChairRepository
    {
        private readonly BookMovieTicketsContext _context;

        public ChairRepository(BookMovieTicketsContext context)
        {
            _context = context;
        }
        public MessageVM CreateChair(ChairDTO dto)
        {
            var _chair = new Chair();
            var _cinemaRoom = _context.CinemaRooms.Where(x => x.Id == dto.CinemaRoomId).SingleOrDefault();
            var _typeChair = _context.ChairTypes.Where(x => x.Id == dto.ChairTypeId).SingleOrDefault();
            if(_cinemaRoom == null)
            {
                return new MessageVM
                {
                    Message = "Thông tin id cinemaRoom không chính xác"
                };
            }
            if (_typeChair == null)
            {
                return new MessageVM
                {
                    Message = "Thông tin id typeChair không chính xác"
                };
            }
            _chair.CinemaRoomId = _cinemaRoom.Id;
            _chair.ChairTypeId = _typeChair.Id;
            _chair.Name = dto.Name;
            _chair.Status = dto.Status;
            _context.Add(_chair);
            _context.SaveChanges();

            if(dto.Flag != 0)
            {
                var _cinemaRoomNew = _context.CinemaRooms.Where(x => x.Id == _chair.CinemaRoomId).SingleOrDefault();
                _cinemaRoomNew.NumChair++;
                _context.SaveChanges();
            }
            return new MessageVM
            {
                Message = "Thêm ghế thành công",
                Data = new ChairVM
                {
                    Id = _chair.Id,
                    CinemaRoomId = _chair.CinemaRoomId,
                    ChairTypeId = _chair.ChairTypeId,
                    Name = _chair.Name,
                    Status = _chair.Status
                }
            };
        }

        public MessageVM DeleteChair(int id)
        {
            var _chair = _context.Chairs.Where(x => x.Id == id && x.Deleted == false).SingleOrDefault();
            if(_chair != null)
            {
                _chair.Deleted = true;
                _context.SaveChanges();
                var _cinemaRoom = _context.CinemaRooms.Where(x => x.Id == _chair.CinemaRoomId).SingleOrDefault();
                _cinemaRoom.NumChair--;
                _context.SaveChanges();
                return new MessageVM
                {
                    Message = "Xóa ghế thành công"
                };
            }
            else
            {
                return new MessageVM
                {
                    Message = "Không tìm thấy thông tin Id này!"
                };
            }
        }

        public List<MessageVM> GetAll()
        {
            var _listChairs = _context.Chairs.Where(x => x.Deleted == false && x.Deleted == false).ToList();
            List<MessageVM> list = new List<MessageVM>();
            foreach (var item in _listChairs)
            {
                var chair = new MessageVM
                {
                   Message = "Lấy dữ liệu thành công",
                   Data = new ChairVM
                   {
                       Id = item.Id,
                       CinemaRoomId = item.CinemaRoomId,
                       ChairTypeId = item.ChairTypeId,
                       Name = item.Name,
                       Status = item.Status
                   }
                };
                list.Add(chair);
            }
            return list;

        }

        public List<MessageVM> GetByCinemaRoomId(int cinemaRoomId)
        {
            var _listChairs = _context.Chairs.Where(x => x.CinemaRoomId == cinemaRoomId && x.Deleted == false).ToList();
            List<MessageVM> list = new List<MessageVM>();
            foreach (var item in _listChairs)
            {
                var _chair = new MessageVM
                {
                    Message = "Lấy dữ liệu thành công",
                    Data = new ChairVM
                    {
                        Id = item.Id,
                        CinemaRoomId = item.CinemaRoomId,
                        ChairTypeId = item.ChairTypeId,
                        Name = item.Name,
                        Status = item.Status
                    }
                };
                list.Add(_chair);
            }
            return list;
        }

        public MessageVM GetById(int id)
        {
            var _chair = _context.Chairs.Where(x => x.Id == id && x.Deleted == false).SingleOrDefault();
            if(_chair != null)
            {
                return new MessageVM
                {
                    Message = "Lấy dữ liệu thành công",
                    Data = new ChairVM
                    {
                        Id = _chair.Id,
                        CinemaRoomId = _chair.CinemaRoomId,
                        ChairTypeId = _chair.ChairTypeId,
                        Name = _chair.Name,
                        Status = _chair.Status
                    }
                };
            }
            else
            {
                return new MessageVM
                {
                    Message = "Không tìm thấy thông tin Id này!"
                };
            }
        }

        public MessageVM UpdateChair(ChairDTO dto, int id)
        {
            var _chair = _context.Chairs.Where(x => x.Id == id && x.Deleted == false).SingleOrDefault();
            if (_chair != null)
            {
                var _cinemaRoom = _context.CinemaRooms.Where(x => x.Id == dto.CinemaRoomId).SingleOrDefault();
                var _typeChair = _context.ChairTypes.Where(x => x.Id == dto.ChairTypeId).SingleOrDefault();
                if (_cinemaRoom == null)
                {
                    return new MessageVM
                    {
                        Message = "Thông tin id cinemaRoom không chính xác"
                    };
                }
                if (_typeChair == null)
                {
                    return new MessageVM
                    {
                        Message = "Thông tin id typeChair không chính xác"
                    };
                }
                _chair.CinemaRoomId = _cinemaRoom.Id;
                _chair.ChairTypeId = _typeChair.Id;
                _chair.Name = dto.Name;
                _chair.Status = dto.Status;
                _context.SaveChanges();
                return new MessageVM
                {
                    Message = "Cập nhật ghế thành công",
                    Data = new ChairVM
                    {
                        Id = _chair.Id,
                        CinemaRoomId = _chair.CinemaRoomId,
                        ChairTypeId = _chair.ChairTypeId,
                        Name = _chair.Name,
                        Status = _chair.Status
                    }
                };
            }
            else
            {
                return new MessageVM
                {
                    Message = "Không tìm thấy thông tin Id này!"
                };
            }
        }
    }
}
