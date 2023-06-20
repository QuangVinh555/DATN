using BookMovieTickets.Data;
using BookMovieTickets.Models;
using BookMovieTickets.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public class RankUserRepository : IRankUserRepository
    {
        private readonly BookMovieTicketsContext _context;

        public RankUserRepository(BookMovieTicketsContext context)
        {
            _context = context;
        }
        public MessageVM CreateRankUser(RankUserDTO dto)
        {
            var _rankUser = new UserRank();
            var _rankUsers = _context.UserRanks.ToList();
            if (_rankUsers.Count > 0)
            {
                foreach (var rankUser in _rankUsers)
                {
                    if (string.Compare(rankUser.Name, dto.Name, StringComparison.CurrentCultureIgnoreCase) == 0)
                    {
                        return new MessageVM
                        {
                            Message = "Tên rank User đã tồn tại"
                        };
                    }
                }
                _rankUser.Name = dto.Name;
                _rankUser.Benchmark = dto.Benchmark;
                _context.Add(_rankUser);
                _context.SaveChanges();
                return new MessageVM
                {
                    Message = "Đã thêm thành công",
                    Data = new RankUserVM
                    {
                        Id = _rankUser.Id,
                        Name = _rankUser.Name,
                        Benchmark = _rankUser.Benchmark
                    }
                };
            }
            else
            {
                _rankUser.Name = dto.Name;
                _rankUser.Benchmark = dto.Benchmark;
                _context.Add(_rankUser);
                _context.SaveChanges();
                return new MessageVM
                {
                    Message = "Đã thêm thành công",
                    Data = new RankUserVM
                    {
                        Id = _rankUser.Id,
                        Name = _rankUser.Name,
                        Benchmark = _rankUser.Benchmark
                    }
                };
            }
        }

        public MessageVM DeleteRankUser(int id)
        {
            var _rankUser = _context.UserRanks.Where(x => x.Id == id).SingleOrDefault();
            if(_rankUser != null)
            {
                try
                {
                    List<User> _user = _context.Users.Where(x => x.UserRankId == _rankUser.Id).ToList();
                    _context.Users.RemoveRange(_user);
                    _context.Remove(_rankUser);
                    _context.SaveChanges();
                    return new MessageVM
                    {
                        Message = "Xóa Rank User thành công",
                    };
                }catch(Exception e)
                {
                    Console.WriteLine(e.InnerException.Message);
                    return new MessageVM
                    {
                        Message = e.Message
                    };
                }
            }
            else
            {
                return new MessageVM
                {
                    Message = "Không tìm thấy thông tin id này"
                };
            }
        }

        public List<MessageVM> GetAll()
        {
            var _listRankUser = _context.UserRanks.Select(x => new MessageVM
            {
                Message = "Lấy dữ liệu thành công",
                Data = new RankUserVM
                {
                    Id = x.Id,
                    Name = x.Name,
                    Benchmark = x.Benchmark
                }
            }).ToList();
            return _listRankUser;
        }

        public MessageVM UpdateRankUser(RankUserDTO dto, int id)
        {
            var _rankUser = _context.UserRanks.Where(x => x.Id == id).SingleOrDefault();
            if (_rankUser != null)
            {            
                _rankUser.Name = dto.Name;
                _rankUser.Benchmark = dto.Benchmark;
                _context.SaveChanges();
                return new MessageVM
                {
                    Message = "Cập nhật rankUser thành công",
                    Data = new RankUserVM
                    {
                        Id = _rankUser.Id,
                        Name = _rankUser.Name,
                        Benchmark = _rankUser.Benchmark
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
    }
}
