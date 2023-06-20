using System;
using System.Collections.Generic;

#nullable disable

namespace BookMovieTickets.Data
{
    public partial class Location
    {
        public Location()
        {
            CinemaNames = new HashSet<CinemaName>();
        }

        public int Id { get; set; }
        public string Province { get; set; }

        public virtual ICollection<CinemaName> CinemaNames { get; set; }
    }
}
