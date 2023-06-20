using BookMovieTickets.Data;
using BookMovieTickets.Models;
using BookMovieTickets.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly BookMovieTicketsContext _context;

        public PaymentRepository(BookMovieTicketsContext context)
        {
            _context = context;
        }
        public MessageVM CreatePayment(PaymentDTO dto)
        {
            var _payment = new Payment();
            var _listPayments = _context.Payments.ToList();
            foreach (var item in _listPayments)
            {
                if (string.Compare(item.PaymentType, dto.PaymentType, StringComparison.CurrentCultureIgnoreCase) == 0)
                {
                    return new MessageVM
                    {
                        Message = "Tên thanh toán đã tồn tại"
                    };
                }
            }
            _payment.PaymentType = dto.PaymentType;
            _context.Add(_payment);
            _context.SaveChanges();
            return new MessageVM
            {
                Message = "Thêm phương thức thanh toán thành công",
                Data = new PaymentVM
                {
                    Id = _payment.Id,
                    PaymentType = dto.PaymentType
                }
            };
        }

        public List<MessageVM> GetAll()
        {
            var _listPayments = _context.Payments.Select(x=>new MessageVM
            {
                Message = "Lấy dữ liệu thành công",
                Data = new PaymentVM
                {
                    Id = x.Id,
                    PaymentType = x.PaymentType
                }
            }).ToList();
            return _listPayments;
           
        }
    }
}
