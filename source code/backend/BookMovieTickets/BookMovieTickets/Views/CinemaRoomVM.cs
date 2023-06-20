using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Views
{
    public class CinemaRoomVM
    {
        public int Id { get; set; }
        public int? CinemaNameId { get; set; }
        public string Name { get; set; }
        public int? NumChair { get; set; }

    }
}
