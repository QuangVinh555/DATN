using System;
using System.Collections.Generic;

#nullable disable

namespace BookMovieTickets.Data
{
    public partial class Producer
    {
        public Producer()
        {
            MovieProducers = new HashSet<MovieProducer>();
        }

        public int Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<MovieProducer> MovieProducers { get; set; }
    }
}
