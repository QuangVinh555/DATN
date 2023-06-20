using System;
using System.Collections.Generic;

#nullable disable

namespace BookMovieTickets.Data
{
    public partial class Banner
    {
        public int Id { get; set; }
        public int? MovieId { get; set; }
        public string MainSlide { get; set; }
        public string ContainerSlide { get; set; }

        public virtual Movie Movie { get; set; }
    }
}
