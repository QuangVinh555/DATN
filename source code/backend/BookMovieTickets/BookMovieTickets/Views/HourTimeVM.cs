using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Views
{
    public class HourTimeVM
    {
        public int Id { get; set; }
        public int? ShowTimeId { get; set; }
        public int? CinemaRoomId { get; set; }
        public string CinemaRoom { get; set; }
        public string Time { get; set; }
        public string EndTime { get; set; }
    }
}
