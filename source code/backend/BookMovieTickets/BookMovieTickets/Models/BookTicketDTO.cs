using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Models
{
    public class BookTicketDTO
    {
        public int? UserId { get; set; }
        public int? MovieId { get; set; }
        public int? PaymentId { get; set; }
        public int? RewardPoints { get; set; }
        public double? TotalPrice { get; set; }
        public bool? State { get; set; }
        public int? TotalCombo { get; set; }
        public int? MoneyPoints { get; set; }
        public int? TotalTickets { get; set; }
        public int? ShowTimeId { get; set; }
        public int? HourTimeId { get; set; }
        public int? ComboId { get; set; }
        public int? CountCombo { get; set; }

        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
