using BookMovieTickets.Data;
using BookMovieTickets.Models;
using BookMovieTickets.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public class BookTicketDetailRepository : IBookTicketDetailRepository
    {
        private readonly BookMovieTicketsContext _context;

        public BookTicketDetailRepository(BookMovieTicketsContext context)
        {
            _context = context;
        }
        public MessageVM CreateBookTicketDetail(BookTicketDetailDTO dto)
        {
            try
            {
                if (dto.ChairId.HasValue)
                {
                    var _bookTicketDetail = new BookTicketDetail();                
                    var _bookTicket = _context.BookTickets.Where(x => x.Id == dto.BookTicketId).SingleOrDefault();

                    if (_bookTicket == null)
                    {
                        return new MessageVM
                        {
                            Message = "Thông tin của BookTicket Id này chưa chính xác"
                        };
                    }
                    var _chair = _context.Chairs.Where(x => x.Id == dto.ChairId).SingleOrDefault();
                    if (_chair == null)
                    {
                        return new MessageVM
                        {
                            Message = "Thông tin của Chair Id này chưa chính xác"
                        };
                    }

                    var _chairStatus = _context.ChairStatuses.Where(x => x.ChairId == _chair.Id && x.HourTimeId == dto.HourTimeId).SingleOrDefault();
                    if (_chairStatus.Status == 2)
                    {
                        return new MessageVM
                        {
                            Message = "Ghế này đã được đặt"
                        };
                    }
                    if (_chairStatus.Status == 1)
                    {
                        return new MessageVM
                        {
                            Message = "Ghế này đang được người khác giữ"
                        };
                    }

                    _bookTicketDetail.BookTicketId = _bookTicket.Id;
                    _bookTicketDetail.ChairId = _chair.Id;
                    _bookTicketDetail.TicketPrice = dto.TicketPrice;
                    _bookTicket.State = false;
                    _context.SaveChanges();
                    _context.Add(_bookTicketDetail);

                    if(_chairStatus != null)
                    {
                        _chairStatus.Status = 2;
                        _context.SaveChanges();
                    }

                    return new MessageVM
                    {
                        Message = "Tạo thành công",
                        Data = new BookTicketDetailVM
                        {
                            Id = _bookTicketDetail.Id,
                            BookTicketId = _bookTicketDetail.BookTicketId,
                            Chair = _context.Chairs.Where(x=>x.Id == _bookTicketDetail.ChairId).SingleOrDefault().Name,                         
                            TicketPrice = _bookTicketDetail.TicketPrice,
                        }
                    };
                }
                else
                {
                    return new MessageVM
                    {
                        Message = "Bạn chưa chọn ghế"
                    };
                }
            }catch(Exception e)
            {
                Console.WriteLine(e.InnerException.Message);
                return new MessageVM
                {
                    Message = e.Message
                };
            }
        }

        public MessageVM DeleteBookTicketDetail(int chairStatusId, int bookTicketId)
        {
            var _chairStatus = _context.ChairStatuses.Where(x => x.Id == chairStatusId).SingleOrDefault();
            if(_chairStatus != null)
            {
                _chairStatus.Status = 0;
                _context.SaveChanges();

                var _bookTicketDetail = _context.BookTicketDetails.Where(x => x.ChairId == _chairStatus.ChairId && x.State == false && x.BookTicketId == bookTicketId).SingleOrDefault();
                _context.BookTicketDetails.Remove(_bookTicketDetail);
                _context.SaveChanges();
                return new MessageVM
                {
                    Message = "Đã xóa thành công"
                };
            }
            else
            {
                return new MessageVM
                {
                    Message = "Không tìm thấy thông tin ghế!"
                };
            }
        }

        public MessageVM DeleteBookTicketDetailByState(int bookTicketId, int hourTimeId)
        {
            var _listBookTicketDetail = _context.BookTicketDetails.Where(x => x.State == false && x.BookTicketId == bookTicketId).ToList();
            foreach (var item in _listBookTicketDetail)
            {
                var _chairStatus = _context.ChairStatuses.Where(x => x.ChairId == item.ChairId && x.HourTimeId == hourTimeId).SingleOrDefault();
                if(_chairStatus != null)
                {
                    _chairStatus.Status = 0;
                    _context.SaveChanges();
                }
            }
            _context.RemoveRange(_listBookTicketDetail);
            _context.SaveChanges();

            return new MessageVM
            {
                Message = "Đã xóa thành công!"
            };
        }

        public List<MessageVM> GetAll()
        {
            throw new NotImplementedException();
        }

        public MessageVM GetById(int id)
        {
            throw new NotImplementedException();
        }

        public List<MessageVM> GetByTicketId(int bookTicketId)
        {
            var _listBookTicketDetail = _context.BookTicketDetails.Where(x => x.BookTicketId == bookTicketId).ToList();
            List<MessageVM> list = new List<MessageVM>();
            if (_listBookTicketDetail.Count > 0)
            {
                foreach (var item in _listBookTicketDetail)
                {
                    var _listChair = _context.Chairs.Where(x => x.Id == item.ChairId).ToList();
                    foreach (var chair in _listChair)
                    {
                        var _bookTicketDetail = new MessageVM
                        {
                            Message = "Lấy dữ liệu thành công",
                            Data = new BookTicketDetailVM
                            {
                                Id = item.Id,
                                BookTicketId = item.BookTicketId,
                                Chair = chair.Name
                            }
                        };
                        list.Add(_bookTicketDetail);
                    }
                }
                return list;
            }
            else
            {
                var error =  new MessageVM
                {
                    Message = "Không tìm thấy thông tin ghế của vé này"
                };
                list.Add(error);
                return list;
            }
        }

        public MessageVM UpdateBookTicketDetail(BookTicketDetailDTO dto, int id)
        {
            throw new NotImplementedException();
        }
    }
}
