using System;
using System.Collections.Generic;

#nullable disable

namespace BookMovieTickets.Data
{
    public partial class ChairStatus
    {
        public int Id { get; set; }
        public int? HourTimeId { get; set; }
        public int? ChairId { get; set; }
        public int? Status { get; set; }
        public bool? Deleted { get; set; }

        public virtual Chair Chair { get; set; }
        public virtual HourTime HourTime { get; set; }
    }
}
