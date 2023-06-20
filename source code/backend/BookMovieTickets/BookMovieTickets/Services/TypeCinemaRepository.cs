using BookMovieTickets.Data;
using BookMovieTickets.Models;
using BookMovieTickets.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public class TypeCinemaRepository : ITypeCinemaRepository
    {
        private readonly BookMovieTicketsContext _context;

        public TypeCinemaRepository(BookMovieTicketsContext context)
        {
            _context = context;
        }

        public MessageVM CreateTypeCinema(TypeCinemaDTO dto)
        {
            var _typeCinema = new CinemaType
            {
                Name = dto.Name,
                Logo = dto.Logo
            };
            _context.Add(_typeCinema);
            _context.SaveChanges();
            return new MessageVM
            {
                Message = "Thêm thành công",
                Data = new TypeCinemaVM
                {
                    Id = _typeCinema.Id,
                    Name = _typeCinema.Name,
                    Logo = _typeCinema.Logo                  
                }
            };
        }

        public MessageVM DeleteTypeCinema(int id)
        {
            var _typeCinema = _context.CinemaTypes.Where(x => x.Id == id).SingleOrDefault();
            if(_typeCinema != null)
            {
                var _cinemaName = _context.CinemaNames.Where(x => x.CinemaTypeId == _typeCinema.Id).ToList();
                _context.CinemaNames.RemoveRange(_cinemaName);
                _context.Remove(_typeCinema);
                _context.SaveChanges();
                return new MessageVM
                {
                    Message = "Xóa dữ liệu thành công"
                };
            }
            else
            {
                return new MessageVM
                {
                    Message = "Không tìm thấy dữ liệu cần xóa!"
                };
            }

        }

        public List<MessageVM> GetAll()
        {
            var _listTypeCinemas = _context.CinemaTypes.Select(x => new MessageVM
            {
                Message = "Lấy dữ liệu thành công",
                Data = new TypeCinemaVM
                {
                    Id = x.Id,
                    Name = x.Name,
                    Logo = x.Logo
                }
            }).ToList();
            return _listTypeCinemas;
        }

        public MessageVM UpdateTypeCinema(TypeCinemaDTO dto, int id)
        {
            var _typeCinema = _context.CinemaTypes.Where(x => x.Id == id).SingleOrDefault();
            if(_typeCinema != null)
            {
                _typeCinema.Name = dto.Name;
                _typeCinema.Logo = dto.Logo;
                _context.SaveChanges();
                return new MessageVM
                {
                    Message = "Cập nhật thông tin thành công",
                    Data = new TypeCinemaVM
                    {
                        Id = _typeCinema.Id,
                        Name = _typeCinema.Name,
                        Logo = _typeCinema.Logo
                    }
                };
            }
            else
            {
                return new MessageVM
                {
                    Message = "Không tìm thấy thông tin Id này"
                };
            }
        }
    }
}
