using System;
using System.Collections.Generic;

#nullable disable

namespace BookMovieTickets.Data
{
    public partial class HourTime
    {
        public HourTime()
        {
            BookTickets = new HashSet<BookTicket>();
            ChairStatuses = new HashSet<ChairStatus>();
        }

        public int Id { get; set; }
        public int? ShowTimeId { get; set; }
        public string Time { get; set; }
        public string EndTime { get; set; }
        public int? CinemaRoomId { get; set; }

        public virtual CinemaRoom CinemaRoom { get; set; }
        public virtual ShowTime ShowTime { get; set; }
        public virtual ICollection<BookTicket> BookTickets { get; set; }
        public virtual ICollection<ChairStatus> ChairStatuses { get; set; }
    }
}
