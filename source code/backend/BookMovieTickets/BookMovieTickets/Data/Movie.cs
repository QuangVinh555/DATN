using System;
using System.Collections.Generic;

#nullable disable

namespace BookMovieTickets.Data
{
    public partial class Movie
    {
        public Movie()
        {
            Banners = new HashSet<Banner>();
            BookTickets = new HashSet<BookTicket>();
            Comments = new HashSet<Comment>();
            Raitings = new HashSet<Raiting>();
            ShowTimes = new HashSet<ShowTime>();
        }

        public int Id { get; set; }
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
        public bool? Deleted { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string Producer { get; set; }
        public string Actor { get; set; }
        public string Category { get; set; }
        public double? TotalPercent { get; set; }
        public string LinkTrailer { get; set; }

        public virtual User User { get; set; }
        public virtual ICollection<Banner> Banners { get; set; }
        public virtual ICollection<BookTicket> BookTickets { get; set; }
        public virtual ICollection<Comment> Comments { get; set; }
        public virtual ICollection<Raiting> Raitings { get; set; }
        public virtual ICollection<ShowTime> ShowTimes { get; set; }
    }
}
