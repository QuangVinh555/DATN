using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Models
{
    public class ChairDTO
    {
        public int? CinemaRoomId { get; set; }
        public int? ChairTypeId { get; set; }
        public string Name { get; set; }
        public int? Status { get; set; }
        public int? Flag { get; set; }
    }
}
