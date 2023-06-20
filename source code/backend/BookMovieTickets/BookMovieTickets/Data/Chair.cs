using System;
using System.Collections.Generic;

#nullable disable

namespace BookMovieTickets.Data
{
    public partial class Chair
    {
        public Chair()
        {
            BookTicketDetails = new HashSet<BookTicketDetail>();
            ChairStatuses = new HashSet<ChairStatus>();
        }

        public int Id { get; set; }
        public int? CinemaRoomId { get; set; }
        public int? ChairTypeId { get; set; }
        public string Name { get; set; }
        public int? Status { get; set; }
        public bool? Deleted { get; set; }

        public virtual ChairType ChairType { get; set; }
        public virtual CinemaRoom CinemaRoom { get; set; }
        public virtual ICollection<BookTicketDetail> BookTicketDetails { get; set; }
        public virtual ICollection<ChairStatus> ChairStatuses { get; set; }
    }
}
