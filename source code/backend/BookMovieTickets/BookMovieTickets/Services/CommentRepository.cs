using BookMovieTickets.Data;
using BookMovieTickets.Models;
using BookMovieTickets.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public class CommentRepository : ICommentRepository
    {
        private readonly BookMovieTicketsContext _context;

        public CommentRepository(BookMovieTicketsContext context)
        {
            _context = context;
        }
        public MessageVM CreateComment(CommentDTO dto)
        {
            var _comment = new Comment();
            var _movie = _context.Movies.Where(x => x.Id == dto.MovieId).SingleOrDefault();
            var _user = _context.Users.Where(x => x.Id == dto.UserId).SingleOrDefault();
            if(_movie == null)
            {
                return new MessageVM
                {
                    Message = "Không tìm thấy thông tin phim"
                };
            }
            if (_user == null)
            {
                return new MessageVM
                {
                    Message = "Không tìm thấy thông tin user"
                };
            }
            var _listComments = _context.Comments.ToList();
            foreach (var item in _listComments)
            {
                if(item.MovieId == _movie.Id)
                {
                    if(item.UserId == _user.Id)
                    {
                        return new MessageVM
                        {
                            Message = "Bạn đã đánh giá phim này rồi!"
                        };
                    }
                }
            }
            _comment.UserId = _user.Id;
            _comment.MovieId = _movie.Id;
            _comment.Content = dto.Content;
            _comment.CountStars = dto.CountStars;
            _context.Add(_comment);
            _context.SaveChanges();

            var _listCountStars = _context.Comments.Where(x => x.MovieId == _movie.Id).ToList();
            decimal count = 0;
            decimal total = 0;
            decimal total_star = 5;
            foreach (var item in _listCountStars)
            {
                count++;
                total = Math.Round((decimal)(total + (item.CountStars / total_star) * 100));
            }
            _movie.TotalPercent = (double)(total / count);
            _context.SaveChanges();

            return new MessageVM
            {
                Message = "Đánh giá thành công",
                Data = new CommentVM
                {
                    Id = _comment.Id,
                    FullName = _user.Fullname,
                    Avatar = _user.Avatar,
                    Movie = _movie.Name,
                    Content = _comment.Content,
                    CountStars = _comment.CountStars,
                    CreatedAt = _comment.CreatedAt
                }
            };
        }

        public MessageVM DeleteComment(int id, int UserId)
        {
            var _comment = _context.Comments.Where(x => x.Id == id && x.UserId == UserId).SingleOrDefault();
            if(_comment != null)
            {
                _context.Remove(_comment);
                _context.SaveChanges();
                return new MessageVM
                {
                    Message = "Xóa comment thành công"
                };
            }
            else
            {
                return new MessageVM
                {
                    Message = "Bạn không thể xóa bình luận của người khác!"
                };
            }
        }

        public List<MessageVM> GetAllCommentsByMovieId(int MovieId)
        {
            var _listComments = _context.Comments.Where(x => x.MovieId == MovieId).ToList();
            List<MessageVM> list = new List<MessageVM>();
            foreach (var item in _listComments)
            {
                var _comment = new MessageVM
                {
                    Message = "Lấy dữ liệu thành công",
                    Data = new CommentVM
                    {
                        Id = item.Id,
                        FullName = _context.Users.Where(x=>x.Id == item.UserId).SingleOrDefault().Fullname,
                        Avatar = _context.Users.Where(x => x.Id == item.UserId).SingleOrDefault().Avatar,
                        Movie = _context.Movies.Where(x => x.Id == item.MovieId).SingleOrDefault().Name,
                        Content = item.Content,
                        CountStars = item.CountStars,
                        CreatedAt = item.CreatedAt
                    }
                };
                list.Add(_comment);
            }
            return list;
        }
    }
}
