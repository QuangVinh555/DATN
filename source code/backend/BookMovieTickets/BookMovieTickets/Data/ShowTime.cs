using System;
using System.Collections.Generic;

#nullable disable

namespace BookMovieTickets.Data
{
    public partial class ShowTime
    {
        public ShowTime()
        {
            BookTickets = new HashSet<BookTicket>();
            HourTimes = new HashSet<HourTime>();
        }

        public int Id { get; set; }
        public int? MovieId { get; set; }
        public DateTime? ShowDate { get; set; }
        public double? TicketPrice { get; set; }
        public int? NumTicket { get; set; }
        public bool? Deleted { get; set; }
        public string Role { get; set; }
        public bool? State { get; set; }
        public int? CinemaNameId { get; set; }

        public virtual CinemaName CinemaName { get; set; }
        public virtual Movie Movie { get; set; }
        public virtual ICollection<BookTicket> BookTickets { get; set; }
        public virtual ICollection<HourTime> HourTimes { get; set; }
    }
}
