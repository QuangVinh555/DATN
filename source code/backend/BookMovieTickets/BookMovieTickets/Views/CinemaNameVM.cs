using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Views
{
    public class CinemaNameVM
    {
        public int Id { get; set; }
        public int? CinemaTypeId { get; set; }
        public int? LocationId { get; set; }
        public string CinemaType { get; set; }
        public string Logo { get; set; }
        public string Location { get; set; }
        public string Name { get; set; }
        public string LocationDetail { get; set; }
        public bool? Deleted { get; set; }
    }
}
