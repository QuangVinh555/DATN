using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Views
{
    public class BookTicketDetailVM
    {
        public int Id { get; set; }
        public int? BookTicketId { get; set; }
        public string Chair { get; set; }
        public double? TicketPrice { get; set; }    
        public bool? State { get; set; }
        public bool? Deleted { get; set; }
    }
}
