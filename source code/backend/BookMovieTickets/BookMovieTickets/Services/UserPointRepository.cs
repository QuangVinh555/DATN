using BookMovieTickets.Data;
using BookMovieTickets.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public class UserPointRepository : IUserPointRepository
    {
        private readonly BookMovieTicketsContext _context;

        public UserPointRepository(BookMovieTicketsContext context)
        {
            _context = context;
        }
        public MessageVM GetUserPointByUserId(int userId)
        {
            var _userPoint = _context.UserPoints.Where(x => x.UserId == userId).SingleOrDefault();
            if(_userPoint != null)
            {
                return new MessageVM
                {
                    Message = "Lấy dữ liệu thành công",
                    Data = new UserPointVM
                    {
                        Id = _userPoint.Id,
                        UserId = _userPoint.UserId,
                        FullName = _context.Users.Where(x => x.Id == _userPoint.UserId).SingleOrDefault().Fullname,
                        RewardPoints = _userPoint.RewardPoints,
                        RewardPointsUsed = _userPoint.RewardPointsUsed
                    }
                };
            }
            else
            {
                return new MessageVM
                {
                    Message = "Không tìm thấy thông tin dữ liệu này!"
                };
            }
        }

    }
}
