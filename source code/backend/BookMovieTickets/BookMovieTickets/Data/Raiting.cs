using System;
using System.Collections.Generic;

#nullable disable

namespace BookMovieTickets.Data
{
    public partial class Raiting
    {
        public int Id { get; set; }
        public int? MovieId { get; set; }
        public int? UserId { get; set; }
        public int? CountStarsMovie { get; set; }
        public int? CountLikeMovie { get; set; }
        public int? CountDislikeMovie { get; set; }

        public virtual Movie Movie { get; set; }
        public virtual User User { get; set; }
    }
}
