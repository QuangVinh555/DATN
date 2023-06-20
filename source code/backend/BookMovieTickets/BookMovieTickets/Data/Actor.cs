using System;
using System.Collections.Generic;

#nullable disable

namespace BookMovieTickets.Data
{
    public partial class Actor
    {
        public Actor()
        {
            MovieActors = new HashSet<MovieActor>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public bool? Gender { get; set; }

        public virtual ICollection<MovieActor> MovieActors { get; set; }
    }
}
