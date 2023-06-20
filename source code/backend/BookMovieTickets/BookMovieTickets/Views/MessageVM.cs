using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Views
{
    public class MessageVM
    {
        public int TotalPage { get; set; }
        public string Message { get; set; }
        public string Status { get; set; }
        public Object Data { get; set; }

    }
}
