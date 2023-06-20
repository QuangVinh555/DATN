using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Views
{
    public class ChairVM
    {
        public int Id { get; set; }
        public int? CinemaRoomId { get; set; }
        public int? ChairTypeId { get; set; }
        public string Name { get; set; }
        public int? Status { get; set; }
    }
}
