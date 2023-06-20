using BookMovieTickets.Data;
using BookMovieTickets.Models;
using BookMovieTickets.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public class MovieRepository : IMovieRepository
    {
        private readonly BookMovieTicketsContext _context;

        public MovieRepository(BookMovieTicketsContext context)
        {
            _context = context;
        }
        public MessageVM CreateMovie(MovieDTO dto)
        {
            var _movie = new Movie();
            var _listMovies = _context.Movies.ToList();
            var _user = _context.Users.Where(x => x.Id == dto.UserId).SingleOrDefault();
            if(_user.RoleId != 2)
            {
                return new MessageVM
                {
                    Message = "Không có quyền ở chức năng này!"
                };
            }
            foreach(var movie in _listMovies)
            {
                if (string.Compare(movie.Name, dto.Name, StringComparison.CurrentCultureIgnoreCase) == 0)
                {
                    return new MessageVM
                    {
                        Message = "Tên đã tồn tại"
                    };
                }
            }
            _movie.UserId = _user.Id;
            _movie.Name = dto.Name;
            _movie.Description = dto.Description;
            _movie.Content = dto.Content;
            _movie.Stamp = dto.Stamp;
            _movie.Nation = dto.Nation;
            _movie.MovieDuration = dto.MovieDuration;
            _movie.PremiereDate = dto.PremiereDate;
            _movie.PremiereYear = dto.PremiereYear;
            _movie.Author = dto.Author;
            _movie.Actor = dto.Actor;
            _movie.Producer = dto.Producer;
            _movie.Category = dto.Category;
            _movie.LinkTrailer = dto.LinkTrailer;
            _context.Add(_movie);
            _context.SaveChanges();
            var _movieNew = _context.Movies.Where(x => x.Id == _movie.Id).SingleOrDefault();
            var _banner = new Banner();
            _banner.MovieId = _movieNew.Id;
            _banner.MainSlide = dto.MainSlide;
            _banner.ContainerSlide = dto.ContainerSlide;
            _context.Banners.Add(_banner);
            _context.SaveChanges();
            return new MessageVM { 
                Message = "Thêm thành công",
                Data = new MovieVM
                {
                    Id = _movie.Id,
                    UserId =  _movie.UserId,
                    Name = _movie.Name ,
                    Description = _movie.Description,
                    Content = _movie.Content ,
                    Stamp = _movie.Stamp,
                    Nation = _movie.Nation ,
                    MovieDuration = _movie.MovieDuration,
                    PremiereDate = _movie.PremiereDate,
                    PremiereYear = _movie.PremiereYear,
                    Author = _movie.Author,
                    Actor = _movie.Actor,
                    Producer = _movie.Producer,
                    Category = _movie.Category,
                    TotalPercent = _movie.TotalPercent
                }
            };
        }

        public MessageVM DeleteMovie(int id)
        {
            var _movie = _context.Movies.Where(x => x.Id == id && x.Deleted == false).SingleOrDefault();
            if(_movie != null)
            {
                _movie.Deleted = true;
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
                    Message = "Không tìm thấy dữ liệu của thông tin này!"
                };
            }
        }

        public List<MessageVM> GetAll()
        {
            try
            {
                var _listMovies = _context.Movies.Where(x => x.Deleted == false).ToList();
                List<MessageVM> list = new List<MessageVM>();
                foreach (var x in _listMovies)
                {
                    var _banner = _context.Banners.Where(y => y.MovieId == x.Id).SingleOrDefault();
                    var _movie = new MessageVM
                    {
                        Message = "Lấy dữ liệu thành công",
                        Data = new MovieVM
                        {
                            Id = x.Id,
                            UserId = x.UserId,
                            Name = x.Name,
                            Description = x.Description,
                            Content = x.Content,
                            Stamp = x.Stamp,
                            Nation = x.Nation,
                            MovieDuration = x.MovieDuration,
                            PremiereDate = x.PremiereDate,
                            PremiereYear = x.PremiereYear,
                            Author = x.Author,
                            Actor = x.Actor,
                            Producer = x.Producer,
                            Category = x.Category,
                            TotalPercent = x.TotalPercent,
                            LinkTrailer = x.LinkTrailer,
                            MainSlide = _banner != null ? _banner.MainSlide : "",
                            ContainerSlide = _banner != null ?_banner.ContainerSlide : ""
                        }
                    };
                    list.Add(_movie);
                }

                return list;
            }catch(Exception e)
            {
                Console.WriteLine(e.InnerException.Message);
                return null;
            }
        }

        public MessageVM GetById(int id)
        {
            var _movie = _context.Movies.Where(x => x.Id == id && x.Deleted == false).SingleOrDefault();
            if(_movie != null)
            {
                var _banner = _context.Banners.Where(x => x.MovieId == _movie.Id).SingleOrDefault();
                return new MessageVM
                {
                    Message = "Lấy dữ liệu thành công",
                    Data = new MovieVM
                    {
                        Id = _movie.Id,
                        UserId = _movie.UserId,
                        Name = _movie.Name,
                        Description = _movie.Description,
                        Content = _movie.Content,
                        Stamp = _movie.Stamp,
                        Nation = _movie.Nation,
                        MovieDuration = _movie.MovieDuration,
                        PremiereDate = _movie.PremiereDate,
                        PremiereYear = _movie.PremiereYear,
                        Author = _movie.Author,
                        Actor = _movie.Actor,
                        Producer = _movie.Producer,
                        Category = _movie.Category,
                        TotalPercent = _movie.TotalPercent,
                        LinkTrailer = _movie.LinkTrailer,
                        MainSlide = _banner != null ? _banner.MainSlide : "",
                        ContainerSlide = _banner != null ? _banner.ContainerSlide : ""

                    }
                };
            }
            else
            {
                return new MessageVM
                {
                    Message = "Không lấy được thông tin của Id này"
                };
            }
        }

        public List<MessageVM> GetMovieByDateBigger(DateTime id)
        {
            var _listMovies = _context.Movies.ToList();
            List<MessageVM> list = new List<MessageVM>();
            foreach (var x in _listMovies)
            {
                if(x.PremiereDate > id && x.Deleted == false)
                {
                    var _banner = _context.Banners.Where(y => y.MovieId == x.Id).SingleOrDefault();
                    var _movie = new MessageVM
                    {
                        Message = "Phim sắp chiếu",
                        Data = new MovieVM
                        {
                            Id = x.Id,
                            UserId = x.UserId,
                            Name = x.Name,
                            Description = x.Description,
                            Content = x.Content,
                            Stamp = x.Stamp,
                            Nation = x.Nation,
                            MovieDuration = x.MovieDuration,
                            PremiereDate = x.PremiereDate,
                            PremiereYear = x.PremiereYear,
                            Author = x.Author,
                            Actor = x.Actor,
                            Producer = x.Producer,
                            Category = x.Category,
                            TotalPercent = x.TotalPercent,
                            LinkTrailer = x.LinkTrailer,
                            MainSlide = _banner != null ? _banner.MainSlide : "",
                            ContainerSlide = _banner != null ? _banner.ContainerSlide : ""
                        }
                    };
                    list.Add(_movie);
                }
            }
            return list;
        }

        public List<MessageVM> GetMovieByDateSmaller(DateTime id)
        {
            var _listMovies = _context.Movies.ToList();
            List<MessageVM> list = new List<MessageVM>();
            foreach (var x in _listMovies)
            {
                if (x.PremiereDate <= id && x.Deleted == false)
                {
                    var _banner = _context.Banners.Where(y => y.MovieId == x.Id).SingleOrDefault();
                    var _movie = new MessageVM
                    {
                        Message = "Phim đang chiếu",
                        Data = new MovieVM
                        {
                            Id = x.Id,
                            UserId = x.UserId,
                            Name = x.Name,
                            Description = x.Description,
                            Content = x.Content,
                            Stamp = x.Stamp,
                            Nation = x.Nation,
                            MovieDuration = x.MovieDuration,
                            PremiereDate = x.PremiereDate,
                            PremiereYear = x.PremiereYear,
                            Author = x.Author,
                            Actor = x.Actor,
                            Producer = x.Producer,
                            Category = x.Category,
                            TotalPercent = x.TotalPercent,
                            LinkTrailer = x.LinkTrailer,
                            MainSlide = _banner != null ? _banner.MainSlide : "",
                            ContainerSlide = _banner != null ? _banner.ContainerSlide : ""
                        }
                    };
                    list.Add(_movie);
                }
            }
            return list;
        }

        public MessageVM UpdateMovie(MovieDTO dto, int id)
        {
            var _movie = _context.Movies.Where(x => x.Id == id && x.Deleted == false).SingleOrDefault();
            var _user = _context.Users.Where(x => x.Id == dto.UserId).SingleOrDefault();
            if (_user.RoleId != 2)
            {
                return new MessageVM
                {
                    Message = "Không có quyền ở chức năng này!"
                };
            }        
            if(_movie != null)
            {
                _movie.UserId = _user.Id;
                _movie.Name = dto.Name;
                _movie.Description = dto.Description;
                _movie.Content = dto.Content;
                _movie.Stamp = dto.Stamp;
                _movie.Nation = dto.Nation;
                _movie.MovieDuration = dto.MovieDuration;
                _movie.PremiereDate = dto.PremiereDate;
                _movie.PremiereYear = dto.PremiereYear;
                _movie.Author = dto.Author;
                _movie.Actor = dto.Actor;
                _movie.Producer = dto.Producer;
                _movie.Category = dto.Category;
                _movie.LinkTrailer = dto.LinkTrailer;
                _context.SaveChanges();
                var _banner = _context.Banners.Where(x => x.MovieId == _movie.Id).SingleOrDefault();
                _banner.MainSlide = dto.MainSlide;
                _banner.ContainerSlide = dto.ContainerSlide;
                _context.SaveChanges();
                return new MessageVM
                {
                    Message = "Cập nhật thành công",
                    Data = new MovieVM
                    {
                        Id = _movie.Id,
                        UserId = _movie.UserId,
                        Name = _movie.Name,
                        Description = _movie.Description,
                        Content = _movie.Content,
                        Stamp = _movie.Stamp,
                        Nation = _movie.Nation,
                        MovieDuration = _movie.MovieDuration,
                        PremiereDate = _movie.PremiereDate,
                        PremiereYear = _movie.PremiereYear,
                        Author = _movie.Author,
                        Actor = _movie.Actor,
                        Producer = _movie.Producer,
                        Category = _movie.Category,
                        TotalPercent = _movie.TotalPercent,
                        MainSlide = _banner.MainSlide,
                        ContainerSlide = _banner.ContainerSlide
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
