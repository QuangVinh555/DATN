using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Models
{
    public class ChairStatusDTO
    {
        public int? HourTimeId { get; set; }
        public int? ChairId { get; set; }
        public int? Status { get; set; }
        public bool? Deleted { get; set; }
    }
}
