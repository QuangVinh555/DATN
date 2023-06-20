using System;
using System.Collections.Generic;

#nullable disable

namespace BookMovieTickets.Data
{
    public partial class MovieProducer
    {
        public int Id { get; set; }
        public int? MovieId { get; set; }
        public int? ProducerId { get; set; }

        public virtual Movie Movie { get; set; }
        public virtual Producer Producer { get; set; }
    }
}
