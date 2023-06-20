using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Models
{
    public class MovieDTO
    {
        public int? UserId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Content { get; set; }
        public string Stamp { get; set; }
        public string Nation { get; set; }
        public int? PremiereYear { get; set; }
        public int? MovieDuration { get; set; }
        public DateTime? PremiereDate { get; set; }
        public string Author { get; set; }
        public string Producer { get; set; }
        public string Actor { get; set; }
        public string Category { get; set; }
        public double? TotalPercent { get; set; }
        public string LinkTrailer { get; set; }
        public string MainSlide { get; set; }
        public string ContainerSlide { get; set; }

    }
}
