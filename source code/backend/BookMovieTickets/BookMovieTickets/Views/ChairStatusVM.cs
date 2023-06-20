using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Views
{
    public class ChairStatusVM
    {
        public int Id { get; set; }
        public int? ChairId { get; set; }
        public string Chair { get; set; }
        public int? ChairTypeId { get; set; }
        public int? Status { get; set; }

    }
}
