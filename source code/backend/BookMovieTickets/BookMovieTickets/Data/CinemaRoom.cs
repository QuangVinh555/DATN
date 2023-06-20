using System;
using System.Collections.Generic;

#nullable disable

namespace BookMovieTickets.Data
{
    public partial class CinemaRoom
    {
        public CinemaRoom()
        {
            Chairs = new HashSet<Chair>();
            HourTimes = new HashSet<HourTime>();
        }

        public int Id { get; set; }
        public int? CinemaNameId { get; set; }
        public string Name { get; set; }
        public int? NumChair { get; set; }

        public virtual CinemaName CinemaName { get; set; }
        public virtual ICollection<Chair> Chairs { get; set; }
        public virtual ICollection<HourTime> HourTimes { get; set; }
    }
}
