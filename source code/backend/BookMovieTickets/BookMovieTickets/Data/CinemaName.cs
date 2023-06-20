using System;
using System.Collections.Generic;

#nullable disable

namespace BookMovieTickets.Data
{
    public partial class CinemaName
    {
        public CinemaName()
        {
            CinemaRooms = new HashSet<CinemaRoom>();
            ShowTimes = new HashSet<ShowTime>();
        }

        public int Id { get; set; }
        public int? CinemaTypeId { get; set; }
        public int? LocationId { get; set; }
        public string Name { get; set; }
        public string LocationDetail { get; set; }
        public bool? Deleted { get; set; }

        public virtual CinemaType CinemaType { get; set; }
        public virtual Location Location { get; set; }
        public virtual ICollection<CinemaRoom> CinemaRooms { get; set; }
        public virtual ICollection<ShowTime> ShowTimes { get; set; }
    }
}
