using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Models
{
    public class CinemaNameDTO
    {
        public int? CinemaTypeId { get; set; }
        public int? LocationId { get; set; }
        public string Name { get; set; }
        public string LocationDetail { get; set; }
        public bool? Deleted { get; set; }
    }
}
