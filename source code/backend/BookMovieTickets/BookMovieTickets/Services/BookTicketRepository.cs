using BookMovieTickets.Data;
using BookMovieTickets.Models;
using BookMovieTickets.Views;
using Newtonsoft.Json;
using QRCoder;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Net.Mime;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public class BookTicketRepository : IBookTicketRepository
    {
        private readonly BookMovieTicketsContext _context;
        public int PAGE_SIZE { get; set; } = 10;

        public BookTicketRepository(BookMovieTicketsContext context)
        {
            _context = context;
        }
        public List<MessageVM> GetAll()
        {
            return null;
        }

        public MessageVM GetById(int id)
        {
            var _bookTicket = _context.BookTickets.Where(x => x.Id == id).SingleOrDefault();
            if(_bookTicket != null)
            {
                var _movie = _context.Movies.Where(x => x.Id == _bookTicket.MovieId).SingleOrDefault();
                var _hourTime = _context.HourTimes.Where(x => x.Id == _bookTicket.HourTimeId).SingleOrDefault();
                var _showTime = _context.ShowTimes.Where(x => x.Id == _bookTicket.ShowTimeId).SingleOrDefault();
                var _cinemaName = _context.CinemaNames.Where(x => x.Id == _showTime.CinemaNameId).SingleOrDefault();
                var _cinemaRoom = _context.CinemaRooms.Where(x => x.Id == _hourTime.CinemaRoomId).SingleOrDefault();
                return new MessageVM
                {
                    Message = "Lấy dữ liệu thành công",
                    Data = new BookTicketVM
                    {
                        Id = _bookTicket.Id,
                        Movie = _movie.Name,
                        Stamp = _movie.Stamp,
                        HourTimeStart = _hourTime.Time,
                        HourTimeEnd = _hourTime.EndTime,
                        CinemaName = _cinemaName.Name,
                        Location = _cinemaName.LocationDetail,
                        CinemaRoom = _cinemaRoom.Name,
                        RewardPoints_Used = _bookTicket.MoneyPoints,
                        Total = _bookTicket.TotalPrice,

                    }
                };
            }
            else
            {
                return new MessageVM
                {
                    Message = "Không tìm thấy dữ liệu cần lấy"
                };
            }
        }

        public MessageVM CreateBookTicket(BookTicketDTO dto)
        {
            try
            {
                var _bookTicket = new BookTicket();

                var _user = _context.Users.Where(x => x.Id == dto.UserId).SingleOrDefault();

                var _listBookTickets = _context.BookTickets.ToList();
                foreach (var item in _listBookTickets)
                {
                    if (item.State == false && item.UserId == _user.Id)
                    {
                        _bookTicket.UserId = _user.Id;
                        _bookTicket.MovieId = null;
                        _bookTicket.ShowTimeId = null;
                        _bookTicket.HourTimeId = null;
                        _bookTicket.ComboId = null;
                        _bookTicket.PaymentId = null;
                        _bookTicket.RewardPoints = null;
                        _bookTicket.MoneyPoints = null;
                        _bookTicket.CountCombo = null;
                        _bookTicket.TotalCombo = null;
                        _bookTicket.TotalTickets = null;
                        _bookTicket.TotalPrice = null;
                        _bookTicket.State = false;
                        _context.SaveChanges();
                        return new MessageVM
                        {
                            Message = "Tạo vé có sẵn thành công",
                            Data = new BookTicketVM
                            {
                                Id = item.Id
                            }
                        };
                    }
                }


                if (_user == null)
                {
                    return new MessageVM
                    {
                        Message = "Không tìm được thông tin người dùng này!"
                    };
                }

                _bookTicket.UserId = _user.Id;
                _bookTicket.MovieId = null;
                _bookTicket.ShowTimeId = null;
                _bookTicket.HourTimeId = null;
                _bookTicket.ComboId = null;
                _bookTicket.PaymentId = null;
                _bookTicket.RewardPoints = null;
                _bookTicket.MoneyPoints = null;
                _bookTicket.CountCombo = null;
                _bookTicket.TotalCombo = null;
                _bookTicket.TotalTickets = null;
                _bookTicket.TotalPrice = null;
                _bookTicket.State = false;
                _context.Add(_bookTicket);
                _context.SaveChanges();
                return new MessageVM
                {
                    Message = "Tạo vé thành công",
                    Data = new BookTicketVM
                    {
                        Id = _bookTicket.Id
                    }
                };
            }
            catch (Exception e)
            {
                Console.WriteLine(e.InnerException.Message);
                return new MessageVM
                {
                    Message = e.Message
                };
            }
        }

        public MessageVM UpdateBookTicket(BookTicketDTO dto, int id)
        {
            try
            {
                var _bookTicket = _context.BookTickets.Where(x => x.State == false && x.Id == id).SingleOrDefault();
                if (_bookTicket != null)
                {
                    decimal TICKET_MEMBER = 5 / 100M;
                    decimal COMBO_MEMBER = 3 / 100M;
                    decimal TICKET_VIP = 7 / 100M;
                    decimal COMBO_VIP = 3 / 100M;
                    decimal TICKET_VVIP = 10 / 100M;
                    decimal COMBO_VVIP = 5 / 100M;

                    // giá vé
                    decimal priceTicket = 0;

                    // giá combo
                    decimal priceCombo = 0;

                    // điểm tích lũy vé
                    decimal accumulated_points_Ticket = 0;

                    // điểm tích lũy combo
                    decimal accumulated_points_Combo = 0;

                    // tổng điểm tích lũy
                    decimal total_accumulated_points = 0;

                    var _user = _context.Users.Where(x => x.Id == _bookTicket.UserId).SingleOrDefault();
                    if (_user == null)
                    {
                        return new MessageVM
                        {
                            Message = "Không tìm thấy thông tin user"
                        };
                    }
                    else
                    {
                        // Hạng member
                        if (_user.UserRankId == 1)
                        {
                            var _listBookTicketDetails = _context.BookTicketDetails.Where(x => x.State == false && x.BookTicketId == _bookTicket.Id).ToList();
                            if (_listBookTicketDetails.Count == 0)
                            {
                                return new MessageVM
                                {
                                    Message = "Bạn chưa chọn ghế!"
                                };
                            }
                            foreach (var item in _listBookTicketDetails)
                            {
                                if (item.ChairId != null)
                                {
                                    var _listChairStatus = _context.ChairStatuses.Where(x => x.ChairId == item.ChairId && x.HourTimeId == dto.HourTimeId).ToList();
                                    foreach (var _chair in _listChairStatus)
                                    {
                                                       
                                        _chair.Status = 2;
                                        //_context.SaveChanges();
                                    }
                                    priceTicket = priceTicket + (decimal)(item.TicketPrice);
                                    accumulated_points_Ticket = Math.Round((TICKET_MEMBER * (decimal)(priceTicket) / 1000));
                                }
                            }
                            var _combo = _context.Combos.Where(x => x.Id == dto.ComboId).SingleOrDefault();
                            if (_combo != null)
                            {
                                priceCombo = (decimal)_combo.Price * (decimal)dto.CountCombo;
                                accumulated_points_Combo = Math.Round((COMBO_MEMBER * priceCombo) / 1000);
                            }

                            total_accumulated_points = accumulated_points_Ticket + accumulated_points_Combo;
                        }
                        // Hạng VIP
                        if (_user.UserRankId == 2)
                        {
                            var _listBookTicketDetails = _context.BookTicketDetails.Where(x => x.State == false && x.BookTicketId == _bookTicket.Id).ToList();
                            if (_listBookTicketDetails.Count == 0)
                            {
                                return new MessageVM
                                {
                                    Message = "Bạn chưa chọn ghế!"
                                };
                            }
                            foreach (var item in _listBookTicketDetails)
                            {
                                if (item.ChairId != null)
                                {
                                    var _listChairStatus = _context.ChairStatuses.Where(x => x.ChairId == item.ChairId && x.HourTimeId == dto.HourTimeId).ToList();
                                    foreach (var _chair in _listChairStatus)
                                    {
                                     
                                        _chair.Status = 2;
                                        //_context.SaveChanges();
                                    }
                                    priceTicket = priceTicket + (decimal)(item.TicketPrice);
                                    accumulated_points_Ticket = Math.Round((TICKET_VIP * (decimal)(priceTicket) / 1000));
                                }
                            }
                            var _combo = _context.Combos.Where(x => x.Id == dto.ComboId).SingleOrDefault();
                            if (_combo != null)
                            {
                                priceCombo = (decimal)_combo.Price * (decimal)dto.CountCombo;
                                accumulated_points_Combo = Math.Round((COMBO_VIP * priceCombo) / 1000);
                            }

                            total_accumulated_points = accumulated_points_Ticket + accumulated_points_Combo;
                        }
                        // Hạng VVIP
                        if (_user.UserRankId == 3)
                        {
                            var _listBookTicketDetails = _context.BookTicketDetails.Where(x => x.State == false && x.BookTicketId == _bookTicket.Id).ToList();
                            if (_listBookTicketDetails.Count == 0)
                            {
                                return new MessageVM
                                {
                                    Message = "Bạn chưa chọn ghế!"
                                };
                            }
                            foreach (var item in _listBookTicketDetails)
                            {
                                if (item.ChairId != null)
                                {
                                    var _listChairStatus = _context.ChairStatuses.Where(x => x.ChairId == item.ChairId && x.HourTimeId == dto.HourTimeId).ToList();
                                    foreach (var _chair in _listChairStatus)
                                    {
                        
                                        _chair.Status = 2;
                                        //_context.SaveChanges();
                                    }
                                    priceTicket = priceTicket + (decimal)(item.TicketPrice);
                                    accumulated_points_Ticket = Math.Round((TICKET_VVIP * (decimal)(priceTicket) / 1000));
                                }
                            }
                            var _combo = _context.Combos.Where(x => x.Id == dto.ComboId).SingleOrDefault();
                            if (_combo != null)
                            {
                                priceCombo = (decimal)_combo.Price * (decimal)dto.CountCombo;
                                accumulated_points_Combo = Math.Round((COMBO_VVIP * priceCombo) / 1000);
                            }

                            total_accumulated_points = accumulated_points_Ticket + accumulated_points_Combo;
                        }

                        var _listCombos = _context.Combos.ToList();
                        foreach (var combo in _listCombos)
                        {
                            if (combo.Id == dto.ComboId)
                            {
                                if (combo.Count - dto.CountCombo < 0)
                                {
                                    return new MessageVM
                                    {
                                        Message = "Combo đã hết số lượng!"
                                    };
                                }
                                else
                                {
                                    combo.Count = combo.Count - dto.CountCombo;
                                }
                                //_context.SaveChanges();
                            }
                        }

                        var _userPoint = _context.UserPoints.Where(x => x.UserId == _user.Id).SingleOrDefault();
                        if (_userPoint != null)
                        {
                            if (dto.MoneyPoints.HasValue)
                            {
                                if (_userPoint.RewardPoints - dto.MoneyPoints < 0)
                                {
                                    return new MessageVM
                                    {
                                        Message = "Số điểm tích lũy của bạn không đủ!"
                                    };
                                }
                                else
                                {
                                    _userPoint.RewardPoints = (_userPoint.RewardPoints - dto.MoneyPoints) + (int)total_accumulated_points;
                                    _userPoint.RewardPointsUsed = _userPoint.RewardPointsUsed + dto.MoneyPoints;
                                    //_context.SaveChanges();
                                }
                            }
                            else
                            {
                                _userPoint.RewardPoints = _userPoint.RewardPoints + (int)total_accumulated_points;
                                //_context.SaveChanges();
                            }
                        }

                        var _showTime = _context.ShowTimes.Where(x => x.Id == dto.ShowTimeId).SingleOrDefault();
                        var _hourTime = _context.HourTimes.Where(x => x.Id == dto.HourTimeId).SingleOrDefault();
                        var _payment = _context.Payments.Where(x => x.Id == dto.PaymentId).SingleOrDefault();
                        if (_payment == null)
                        {
                            return new MessageVM
                            {
                                Message = "Không tìm thấy thông tin payment"
                            };
                        }

                        _bookTicket.UserId = _user.Id;
                        _bookTicket.MovieId = _showTime.MovieId;
                        _bookTicket.ShowTimeId = _showTime.Id;
                        _bookTicket.HourTimeId = _hourTime.Id;
                        _bookTicket.ComboId = dto.ComboId == null ? null : dto.ComboId;
                        _bookTicket.PaymentId = _payment.Id;
                        _bookTicket.RewardPoints = (int)total_accumulated_points;
                        _bookTicket.MoneyPoints = dto.MoneyPoints == null ? 0 : dto.MoneyPoints * 1000;
                        _bookTicket.CountCombo = dto.CountCombo == null ? 0 : dto.CountCombo;
                        _bookTicket.TotalCombo = (int)priceCombo;
                        _bookTicket.TotalTickets = (int)priceTicket;
                        _bookTicket.TotalPrice = dto.MoneyPoints == null ? (double)(priceCombo + priceTicket) : (double)((priceCombo + priceTicket) - dto.MoneyPoints * 1000);
                        _bookTicket.State = true;
                        _bookTicket.UpdatedAt = DateTime.Now;
                        _context.SaveChanges();


                        var _listDetails = _context.BookTicketDetails.Where(x => x.BookTicketId == _bookTicket.Id && x.State == false).ToList();
                        foreach (var item in _listDetails)
                        {
                            item.State = true;
                            _context.SaveChanges();
                        }

                        var FullName = _context.Users.Where(y => y.Id == _bookTicket.UserId).FirstOrDefault().Fullname;
                        var CinemaName = _context.CinemaNames.Where(x => x.Id == _showTime.CinemaNameId).SingleOrDefault();
                        var HourTime = _context.HourTimes.Where(y => y.Id == _bookTicket.HourTimeId).SingleOrDefault();
                        var ShowTime = _context.ShowTimes.Where(y => y.Id == _bookTicket.ShowTimeId).SingleOrDefault();
                        var CinemaRoom = _context.CinemaRooms.Where(x => x.Id == _hourTime.CinemaRoomId).SingleOrDefault();
                        var _listTicketDetails = _context.BookTicketDetails.Where(x => x.BookTicketId == _bookTicket.Id).ToList();
                        var NameCombo = dto.ComboId == null ? "" : _context.Combos.Where(x => x.Id == dto.ComboId).SingleOrDefault().Name;
                        var Movie = _context.Movies.Where(y => y.Id == _showTime.MovieId).SingleOrDefault();

                        int dem = 0;
                        foreach (var item in _listTicketDetails)
                        {
                            dem++;
                        }
                        // Gửi mail
                        MailSender mailSender = new MailSender();

                        //var bookTicketQR = new BookTicketEmailVM
                        //{
                        //    Id = _bookTicket.Id,
                        //    UserName = _context.Users.Where(x => x.Id == _bookTicket.UserId).SingleOrDefault().Fullname,
                        //    Movie = _context.Movies.Where(x => x.Id == _bookTicket.MovieId).SingleOrDefault().Name,
                        //    ShowTime = _context.ShowTimes.Where(x => x.Id == _bookTicket.ShowTimeId).SingleOrDefault().ShowDate,
                        //    CreatedAt = _bookTicket.CreatedAt,

                        //};

                        //// Tạo mã QR từ dữ liệu cần nhúng
                        //string qrCodeDataString = JsonConvert.SerializeObject(bookTicketQR); // Thay thế bằng dữ liệu thích hợp
                        //QRCodeGenerator qrGenerator = new QRCodeGenerator();
                        //QRCodeData qrCodeData = qrGenerator.CreateQrCode(qrCodeDataString, QRCodeGenerator.ECCLevel.Q);
                        //QRCode qrCode = new QRCode(qrCodeData);
                        //Bitmap qrCodeImage = qrCode.GetGraphic(20); // Kích thước 20x20 pixel

                        //string qrCodeImageFileName = Guid.NewGuid().ToString() + ".png";
                        //string qrCodeImagePath = Path.Combine(@"D:\GTVT PH TPHCM\Đồ án tốt nghiệp\source code\frontend\book-movie-tickets\public\image", qrCodeImageFileName);
                        //qrCodeImage.Save(qrCodeImagePath, ImageFormat.Png);
                        //string qrCodeImageUrl = "http"+"://localhost:3000/image/"+qrCodeImageFileName;
                   

                        string htmlBody = "<html><body>"
                         + "<h1 style=\"color: blue;\"> Đặt vé thành công </h1>"
                         + "<p style=\"font-weight: 700;\">Xin chào " + FullName + "</p>"
                         + "<p>Cảm ơn bạn đã sử dụng dịch vụ của MoVeek!</p>"
                         + "<p>MoVeek xác nhận bạn đã đặt vé xem phim của " + CinemaName.Name + " thành công lúc " + _bookTicket.UpdatedAt + ".</p>"
                         + "<p>Chi tiết vé của bạn như sau:</p>"
                         + "<div style=\"padding-bottom: 50px;\"></div>"
                         //+ "<img src=\"" + qrCodeImageUrl + "\" alt='QR Code' />" // Bao quanh qrCodeImageUrl bằng dấu nháy kép
                         + "<p>Mã đặt vé: " + _bookTicket.Id + "</p>"
                         + "<p style=\"color: #727272;\">Thời gian chiếu:</p>"
                         + "<p>" + HourTime.Time + " " + ShowTime.ShowDate + "</p>"
                         + "<h2>Phim: " + Movie.Name + "</h2>"
                         + "<div>"
                         + "<p style=\"color: #727272;\">Phòng chiếu: </p>"
                         + "<p>" + CinemaRoom.Name + "</p>"
                         + "<p style=\"color: #727272;\">Số vé: </p>"
                         + "<p>" + dem + "</p>"
                         + "<p style=\"color: #727272;\">Số ghế: </p>";

                            foreach (var item in _listTicketDetails)
                            {
                                var Chair = _context.Chairs.SingleOrDefault(x => x.Id == item.ChairId)?.Name;
                                htmlBody += "<p>" + Chair + "</p>";
                            }

                            htmlBody += "</div>"
                                        + "<div style=\"padding-bottom: 1px solid #ccc;\"></div>"
                                        + "<p style=\"color: #727272;\">Combo Bắp-Nước</p>"
                                        + (NameCombo != "" ? "<p> " + NameCombo + "</p>" : "<p>Không</p>")
                                        + "<div style=\"padding-bottom: 1px solid #ccc;\"></div>"
                                        + "<p style=\"color: #727272;\">Rạp chiếu</p>"
                                        + "<p style=\"font-weight: 700;\">" + CinemaName.Name + "</p>"
                                        + "<p>" + CinemaName.LocationDetail + "</p>"
                                        + "<div style=\"padding-bottom: 1px solid #ccc;\"></div>"
                                        + "<div style=\"display: flex; padding: 22px; align-items: center; background-color: #f0f0f0;\">"
                                        + "<p style=\"color: #727272;\">Tổng tiền </p>"
                                        + "<p style=\"margin-left: 20px;\">" + _bookTicket.TotalPrice + "</p>"
                                        + "</div>"
                                        + "</body></html>";

                            mailSender.MailSenders(_user.Email, htmlBody, "Vé xem phim");

                        //var _nameCinema = _context.CinemaNames.Where(x => x.Id == _showTime.CinemaNameId).SingleOrDefault();
                        return new MessageVM
                        {
                            Message = "Đặt vé thành công",
                            Data = new BookTicketVM
                            {
                                Id = _bookTicket.Id,
                                UserName = FullName,
                                Movie = Movie.Name,
                                Stamp = Movie.Stamp,
                                RoleMovie = ShowTime.Role,
                                ShowTime = ShowTime.ShowDate,
                                HourTimeStart = HourTime.Time,
                                Payment = _context.Payments.Where(y => y.Id == dto.PaymentId).SingleOrDefault().PaymentType,
                                CinemaName = CinemaName.Name,
                                CinemaRoom = CinemaRoom.Name,
                                Location = CinemaName.LocationDetail,
                                TotalTicket = _bookTicket.TotalTickets,
                                NameCombo = dto.ComboId == null ? "" : _context.Combos.Where(x => x.Id == dto.ComboId).SingleOrDefault().Name,
                                CountCombo = dto.CountCombo == null ? 0 : dto.CountCombo,
                                TotalCombo = _bookTicket.TotalCombo,
                                Total = _bookTicket.TotalPrice,
                                RewardPoints_Used = _bookTicket.MoneyPoints,
                                RewardPoints = _bookTicket.RewardPoints,
                                CreatedAt = _bookTicket.UpdatedAt
                            }
                        };
                    }
                }
                else
                {
                    return new MessageVM
                    {
                        Message = "Không tìm thấy vé đã được tạo"
                    };
                }
            }

            catch (Exception e)
            {
                return new MessageVM
                {
                    Message = e.Message
                };
            }
        }

        public MessageVM DeleteBookTicket(int id)
        {
            throw new NotImplementedException();
        }

        public List<MessageVM> GetBookTicketByUserId(int page, int userId)
        {
                var tickets = _context.BookTickets.Where(x => x.UserId == userId && x.State == true).ToList();
                int dem = 0;
                double? totalAll = 0;
                foreach (var item in tickets)
                {
                    dem++;
                    totalAll = totalAll + item.TotalPrice;
                }
                var _listTickets = _context.BookTickets.Where(x => x.UserId == userId && x.State == true).Skip((int)((page - 1) * PAGE_SIZE)).Take(PAGE_SIZE).ToList();
                List<MessageVM> list = new List<MessageVM>();
                foreach (var item in _listTickets)
                {
                    var _movie = _context.Movies.Where(x => x.Id == item.MovieId).SingleOrDefault();
                    var _showTime = _context.ShowTimes.Where(x => x.Id == item.ShowTimeId).SingleOrDefault();
                    var _cinemaName = _context.CinemaNames.Where(x => x.Id == _showTime.CinemaNameId).SingleOrDefault();
                    var _hourTime = _context.HourTimes.Where(x => x.Id == item.HourTimeId).SingleOrDefault();
                    var _cinemaRoom = _context.CinemaRooms.Where(x => x.Id == _hourTime.CinemaRoomId).SingleOrDefault();

                    var ticket = new MessageVM
                    {
                        TotalPage = dem,
                        Data = new BookTicketVM
                        {
                            Id = item.Id,
                            CreatedAt = item.CreatedAt,
                            Movie = _movie.Name,
                            CinemaName = _cinemaName.Name,
                            CinemaRoom = _cinemaRoom.Name,
                            HourTimeStart = _hourTime.Time,
                            Total = item.TotalPrice,
                            TotalAll = totalAll,
                        }
                    };
                    list.Add(ticket);
                }
                return list;
       
        }
    }
}
