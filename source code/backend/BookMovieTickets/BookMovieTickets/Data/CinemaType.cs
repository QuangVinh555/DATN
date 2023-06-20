using System;
using System.Collections.Generic;

#nullable disable

namespace BookMovieTickets.Data
{
    public partial class CinemaType
    {
        public CinemaType()
        {
            CinemaNames = new HashSet<CinemaName>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Logo { get; set; }

        public virtual ICollection<CinemaName> CinemaNames { get; set; }
    }
}
