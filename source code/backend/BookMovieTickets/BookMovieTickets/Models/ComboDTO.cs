using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Models
{
    public class ComboDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int? Count { get; set; }
        public int? Price { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
    }
}
