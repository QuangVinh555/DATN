using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Views
{
    public class ShowTimeVM
    {
        public int Id { get; set; }
        public string MainSlide { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public string Author { get; set; }
        public string CinemaRoom { get; set; }
        public string CinemaName { get; set; }
        public string CinemaType { get; set; }
        public string Location { get; set; }
        public string LocationDetail { get; set; }
        public string Movie { get; set; }
        public string Stamp { get; set; }
        public string Logo { get; set; }
        public DateTime? ShowDate { get; set; }
        public double? TicketPrice { get; set; }
        public int? NumTicket { get; set; }
        public bool? Deleted { get; set; }
        public string Role { get; set; }
        public bool? State { get; set; }
    }
}
