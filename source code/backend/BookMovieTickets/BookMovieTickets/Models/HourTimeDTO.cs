using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Models
{
    public class HourTimeDTO
    {
        public int? ShowTimeId { get; set; }
        public int? CinemaRoomId { get; set; }
        public string Time { get; set; }
        public string EndTime { get; set; }
    }
}
