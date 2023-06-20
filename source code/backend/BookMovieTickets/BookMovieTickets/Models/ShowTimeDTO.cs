using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Models
{
    public class ShowTimeDTO
    {
        public int? CinemaNameId { get; set; }
        public int? MovieId { get; set; }
        public DateTime? ShowDate { get; set; }
        public double? TicketPrice { get; set; }
        public int? NumTicket { get; set; }
        public bool? Deleted { get; set; }
        public string Role { get; set; }
        public bool? State { get; set; }
    }
}
