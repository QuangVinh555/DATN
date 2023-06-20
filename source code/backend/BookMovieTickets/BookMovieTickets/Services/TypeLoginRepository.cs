using BookMovieTickets.Data;
using BookMovieTickets.Models;
using BookMovieTickets.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public class TypeLoginRepository : ITypeLoginRepository
    {
        private readonly BookMovieTicketsContext _context;

        public TypeLoginRepository(BookMovieTicketsContext context)
        {
            _context = context;
        }
        public MessageVM CreateTypeLogin(TypeLoginDTO dto)
        {
            var _typeLogin = new LoginType();
            var _typeLogins = _context.LoginTypes.ToList();
            if(_typeLogins.Count > 0)
            {
                foreach(var typeLogin in _typeLogins)
                {
                    if (string.Compare(typeLogin.Name, dto.Name, StringComparison.CurrentCultureIgnoreCase) == 0)
                    {
                        return new MessageVM
                        {
                            Message = "Tên đã tồn tại"
                        };
                    }
                }
                _typeLogin.Name = dto.Name;
                _context.Add(_typeLogin);
                _context.SaveChanges();
                return new MessageVM
                {
                    Message = "Đã thêm thành công",
                    Data = new TypeLoginVM
                    {
                        Id = _typeLogin.Id,
                        Name = _typeLogin.Name
                    }
                };
            }
            else
            {
                _typeLogin.Name = dto.Name;
                _context.Add(_typeLogin);
                _context.SaveChanges();
                return new MessageVM
                {
                    Message = "Đã thêm thành công",
                    Data = new TypeLoginVM
                    {
                        Id = _typeLogin.Id,
                        Name = _typeLogin.Name
                    }
                };
            }
        }
    }
}
