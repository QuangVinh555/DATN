using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Models
{
    public class BookTicketDetailDTO
    {
        public int? BookTicketId { get; set; }
        public int? ChairId { get; set; }
        public int? HourTimeId { get; set; }
        public double? TicketPrice { get; set; }
        public bool? Deleted { get; set; }
        public bool? State { get; set; }
    }
}
