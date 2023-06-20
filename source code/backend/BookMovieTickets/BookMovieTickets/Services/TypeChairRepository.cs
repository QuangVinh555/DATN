using BookMovieTickets.Data;
using BookMovieTickets.Models;
using BookMovieTickets.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public class TypeChairRepository : ITypeChairRepository
    {
        private readonly BookMovieTicketsContext _context;

        public TypeChairRepository(BookMovieTicketsContext context)
        {
            _context = context;
        }
        public MessageVM CreateTypeChair(TypeChairDTO dto)
        {
            var _typeChair = new ChairType();
            var _listTypeChair = _context.ChairTypes.ToList();
            foreach(var typeChair in _listTypeChair)
            {
                if (string.Compare(typeChair.Name, dto.Name, StringComparison.CurrentCultureIgnoreCase) == 0)
                {
                    return new MessageVM
                    {
                        Message = "Loại ghế này đã được tạo!"
                    };
                }
            }
            _typeChair.Name = dto.Name;
            _context.Add(_typeChair);
            _context.SaveChanges();
            return new MessageVM
            {
                Message = "Thêm loại ghế thành công",
                Data = new TypeChairVM
                {
                    Id = _typeChair.Id,
                    Name = _typeChair.Name
                }
            };
        }

        public MessageVM DeleteTypeChair(int id)
        {
            var _typeChair = _context.ChairTypes.Where(x => x.Id == id).SingleOrDefault();
            if (_typeChair != null)
            {
                _context.Remove(_typeChair);
                _context.SaveChanges();
                return new MessageVM
                {
                    Message = "Xóa loại ghế này thành công",
                };
            }
            else
            {
                return new MessageVM
                {
                    Message = "Không tìm thấy thông tin Id này!",
                };
            }
        }

        public List<MessageVM> GetAll()
        {
            var _listTypeChairs = _context.ChairTypes.Select(x => new MessageVM
            {
                Message = "Lấy dữ liệu thành công",
                Data = new TypeChairVM
                {
                    Id = x.Id,
                    Name = x.Name
                }
            }).ToList();
            return _listTypeChairs;
        }

        public MessageVM GetById(int id)
        {
            var _typeChair = _context.ChairTypes.Where(x => x.Id == id).SingleOrDefault();
            if (_typeChair != null)
            {
                return new MessageVM
                {
                    Message = "Cập nhật loại ghế thành công",
                    Data = new TypeChairVM
                    {
                        Id = _typeChair.Id,
                        Name = _typeChair.Name
                    }
                };
            }
            else
            {
                return new MessageVM
                {
                    Message = "Không tìm thấy thông tin Id này!",
                };
            }
        }

        public MessageVM UpdateTypeChair(TypeChairDTO dto, int id)
        {
            var _typeChair = _context.ChairTypes.Where(x => x.Id == id).SingleOrDefault();
            if(_typeChair != null)
            {
                var _listTypeChair = _context.ChairTypes.ToList();
                foreach (var typeChair in _listTypeChair)
                {
                    if (string.Compare(typeChair.Name, dto.Name, StringComparison.CurrentCultureIgnoreCase) == 0)
                    {
                        return new MessageVM
                        {
                            Message = "Loại ghế này đã được tạo!"
                        };
                    }
                }
                _typeChair.Name = dto.Name;
                _context.SaveChanges();

                return new MessageVM
                {
                    Message = "Lấy dữ liệu thành công",
                    Data = new TypeChairVM
                    {
                        Id = _typeChair.Id,
                        Name = _typeChair.Name
                    }
                };
            }
            else
            {
                return new MessageVM
                {
                    Message = "Không tìm thấy thông tin Id này để cập nhật!",
                };
            }
        }
    }
}
