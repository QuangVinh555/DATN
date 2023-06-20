using System;
using System.Collections.Generic;

#nullable disable

namespace BookMovieTickets.Data
{
    public partial class ChairType
    {
        public ChairType()
        {
            Chairs = new HashSet<Chair>();
        }

        public int Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<Chair> Chairs { get; set; }
    }
}
