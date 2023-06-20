using BookMovieTickets.Data;
using BookMovieTickets.Models;
using BookMovieTickets.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public class RoleRepository : IRoleRepository
    {
        private readonly BookMovieTicketsContext _context;

        public RoleRepository(BookMovieTicketsContext context)
        {
            _context = context;
        }

        public MessageVM CreateRole(RoleDTO dto)
        {
            Role _role = new Role();
            var roles = _context.Roles.ToList();
            if(roles.Count != 0)
            {
                foreach(var role in roles)
                {
                    if (string.Compare(role.Name, dto.Name, StringComparison.CurrentCultureIgnoreCase) == 0)
                    {
                        return new MessageVM
                        {
                            Message = "Tên quyền đã tồn tại"
                        };
                    }                         
                }
                _role.Name = dto.Name;
                _context.Add(_role);
                _context.SaveChanges();
                return new MessageVM
                {
                    Message = "Thêm quyền mới thành công",
                    Data = new RoleVM
                    {
                        Id = _role.Id,
                        Name = _role.Name
                    }
                };
            }
            else
            {
                _role.Name = dto.Name;
                _context.Add(_role);
                _context.SaveChanges();
                return new MessageVM
                {
                    Message = "Thêm quyền mới thành công",
                    Data = new RoleVM
                    {
                        Id = _role.Id,
                        Name = _role.Name
                    }
                };
            }    
        }

        public MessageVM DeleteRole(int id)
        {
            var _role = _context.Roles.Where(x => x.Id == id).SingleOrDefault();
            if(_role != null)
            {
                _context.Remove(_role);
                _context.SaveChanges();
                return new MessageVM
                {
                    Message = "Đã xóa thành công",                  
                };
            }
            else
            {
                return new MessageVM
                {
                    Message = "Lỗi không tìm thấy Id cần xóa"
                };
            }
        }

        public List<MessageVM> GetAll()
        {
            var _roles = _context.Roles.Select(x => new MessageVM
            {
                Message = "Lấy thông tin thành công",
                Data = new RoleVM
                {
                    Id = x.Id,
                    Name = x.Name
                }
            }).ToList();
            return _roles;
        }

        public MessageVM GetById(int id)
        {
            var _role = _context.Roles.Where(x => x.Id == id).SingleOrDefault();
            if(_role != null)
            {
                return new MessageVM
                {
                    Message = "Lấy dữ liệu thành công",
                    Data = new RoleVM
                    {
                        Id = _role.Id,
                        Name = _role.Name
                    }
                };
            }
            else
            {
                return new MessageVM
                {
                    Message = "Không tìm thấy thông tin của Id này",                  
                };
            }
        }

        public MessageVM UpdateRole(RoleDTO dto, int id)
        {
            var _role = _context.Roles.Where(x => x.Id == id).SingleOrDefault();
            if(_role != null)
            {
                _role.Name = dto.Name;
                _context.SaveChanges();
                return new MessageVM
                {
                    Message = "Cập nhật thông tin thành công",
                    Data = new RoleVM
                    {
                        Id = _role.Id,
                        Name = _role.Name
                    }
                };
            }
            else
            {
                return new MessageVM
                {
                    Message = "Không tìm thấy thông tin của Id này",
                };
            }
        }
    }
}
