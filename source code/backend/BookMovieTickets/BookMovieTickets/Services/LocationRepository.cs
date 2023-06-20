using BookMovieTickets.Data;
using BookMovieTickets.Models;
using BookMovieTickets.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public class LocationRepository : ILocationRepository
    {
        private readonly BookMovieTicketsContext _context;
        public int PAGE_SIZE { get; set; } = 10;

        public LocationRepository(BookMovieTicketsContext context)
        {
            _context = context;
        }
        public MessageVM CreateLocation(LocationDTO dto)
        {
            var _location = new Location();
            var _listLocations = _context.Locations.ToList();
            if(_listLocations.Count > 0)
            {
                foreach (var location in _listLocations)
                {
                    if (string.Compare(location.Province, dto.Province, StringComparison.CurrentCultureIgnoreCase) == 0)
                    {
                        return new MessageVM
                        {
                            Message = "Tên đã tồn tại"
                        };
                    }
                }
                _location.Province = dto.Province;
                _context.Add(_location);
                _context.SaveChanges();
                return new MessageVM
                {
                    Message = "Thêm thành công",
                    Data = new LocationVM
                    {
                        Id = _location.Id,
                        Province = _location.Province
                    }
                };
            }
            else
            {
                _location.Province = dto.Province;
                _context.Add(_location);
                _context.SaveChanges();
                return new MessageVM
                {
                    Message = "Thêm thành công",
                    Data = new LocationVM
                    {
                        Id = _location.Id,
                        Province = _location.Province
                    }
                };
            }
        }

        public List<MessageVM> GetAll()
        {
            var _listLocations = _context.Locations.Select(x => new MessageVM
            {
                Message = "Lấy dữ liệu thành công",
                Data = new LocationVM
                {
                    Id = x.Id,
                    Province = x.Province
                }
            }).ToList();
            return _listLocations; 
        }

        public List<MessageVM> GetAllByPage(int page)
        {
            var _list = _context.Locations.ToList();
            int total = 0;
            foreach (var item in _list)
            {
                total++;
            }
            var _listLocations = _context.Locations.Skip((int)((page - 1) * PAGE_SIZE)).Take(PAGE_SIZE);
            List<MessageVM> list = new List<MessageVM>();
            foreach (var item in _listLocations)
            {
                var location = new MessageVM
                {
                    Message = "Lấy dữ liệu thành công",
                    TotalPage = total,
                    Data = new LocationVM
                    {
                        Id = item.Id,
                        Province = item.Province
                    }
                };
                list.Add(location);
            }
            return list;

        }
    }
}
