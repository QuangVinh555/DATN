using BookMovieTickets.Data;
using BookMovieTickets.Models;
using BookMovieTickets.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public class ComboRepository : IComboRepository
    {
        private readonly BookMovieTicketsContext _context;

        public ComboRepository(BookMovieTicketsContext context)
        {
            _context = context;
        }
        public MessageVM CreateCombo(ComboDTO dto)
        {
            var _combo = new Combo();
            var _listCombos = _context.Combos.ToList();
            foreach (var combo in _listCombos)
            {
                if (string.Compare(combo.Name, dto.Name, StringComparison.CurrentCultureIgnoreCase) == 0)
                {
                    return new MessageVM
                    {
                        Message = "Tên combo đã được tạo"
                    };
                }
            }
            _combo.Name = dto.Name;
            _combo.Description = dto.Description;
            _combo.Count = dto.Count;
            _combo.Price = dto.Price;
            _combo.StartTime = dto.StartTime;
            _combo.EndTime = dto.EndTime;
            _context.Add(_combo);
            _context.SaveChanges();

            return new MessageVM
            {
                Message = "Tạo Combo thành công",
                Data = new ComboVM
                {
                    Id = _combo.Id,
                    Name = _combo.Name,
                    Description = _combo.Description,
                    Count = _combo.Count,
                    Price = _combo.Price,
                    StartTime = _combo.StartTime,
                    EndTime = _combo.EndTime
                }
            };
        }

        public MessageVM DeleteCombo(int id)
        {
            var _combo = _context.Combos.Where(x => x.Id == id).SingleOrDefault();
 
            if (_combo != null)
            {
                _combo.Deleted = true;
                _context.SaveChanges();
                return new MessageVM
                {
                    Message = "Đã xóa combo này thành công",               
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

        public List<MessageVM> GetAll()
        {
            var _listCombos = _context.Combos.Where(x => x.Deleted == false).ToList();
            List<MessageVM> _list = new List<MessageVM>();
            foreach (var item in _listCombos)
            {
                var combo = new MessageVM
                {
                   Message = "Lấy dữ liệu thành công",
                   Data = new ComboVM
                   {
                       Id = item.Id,
                       Name = item.Name,
                       Description = item.Description,
                       Count = item.Count,
                       Price = item.Price,
                       StartTime = item.StartTime,
                       EndTime = item.EndTime
                   }
                };
                _list.Add(combo);
            }
            return _list;
        }

        public MessageVM GetById(int id)
        {
            var _combo = _context.Combos.Where(x => x.Id == id).SingleOrDefault();
            if(_combo != null)
            {
                return new MessageVM
                {
                    Message = "Lấy dữ liệu thành công",
                    Data = new ComboVM
                    {
                        Id = _combo.Id,
                        Name = _combo.Name,
                        Description = _combo.Description,
                        Count = _combo.Count,
                        Price = _combo.Price,
                        StartTime = _combo.StartTime,
                        EndTime = _combo.EndTime
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

        public List<MessageVM> GetComboByDateNow()
        {
            List<MessageVM> _list = new List<MessageVM>();

            var currentDate = DateTime.Now.Date;

            var _combos = _context.Combos.Where(x => x.StartTime <= currentDate && currentDate <= x.EndTime).ToList();
            foreach (var item in _combos)
            {
                var combo = new MessageVM
                {
                    Message = "Lấy dữ liệu thành công",
                    Data = new ComboVM
                    {
                        Id = item.Id,
                        Name = item.Name,
                        Description = item.Description,
                        Count = item.Count,
                        Price = item.Price,
                        StartTime = item.StartTime,
                        EndTime = item.EndTime
                    }
                };
                _list.Add(combo);
            }
            return _list;
        }

        public MessageVM UpdateCombo(ComboDTO dto, int id)
        {
            var _combo = _context.Combos.Where(x => x.Id == id).SingleOrDefault();
            if(_combo != null)
            {
             
                _combo.Name = dto.Name;
                _combo.Description = dto.Description;
                _combo.Count = dto.Count;
                _combo.Price = dto.Price;
                _combo.StartTime = dto.StartTime;
                _combo.EndTime = dto.EndTime;
                _context.SaveChanges();

                return new MessageVM
                {
                    Message = "Cập nhật Combo thành công",
                    Data = new ComboVM
                    {
                        Id = _combo.Id,
                        Name = _combo.Name,
                        Description = _combo.Description,
                        Count = _combo.Count,
                        Price = _combo.Price,
                        StartTime = _combo.StartTime,
                        EndTime = _combo.EndTime
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
