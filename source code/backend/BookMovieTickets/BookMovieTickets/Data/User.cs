using System;
using System.Collections.Generic;

#nullable disable

namespace BookMovieTickets.Data
{
    public partial class User
    {
        public User()
        {
            BookTickets = new HashSet<BookTicket>();
            Comments = new HashSet<Comment>();
            Movies = new HashSet<Movie>();
            Raitings = new HashSet<Raiting>();
            UserPoints = new HashSet<UserPoint>();
        }

        public int Id { get; set; }
        public int? RoleId { get; set; }
        public int? LoginTypeId { get; set; }
        public int? UserRankId { get; set; }
        public string Avatar { get; set; }
        public string Fullname { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string Password { get; set; }
        public bool? Deleted { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? Date { get; set; }

        public virtual LoginType LoginType { get; set; }
        public virtual Role Role { get; set; }
        public virtual UserRank UserRank { get; set; }
        public virtual ICollection<BookTicket> BookTickets { get; set; }
        public virtual ICollection<Comment> Comments { get; set; }
        public virtual ICollection<Movie> Movies { get; set; }
        public virtual ICollection<Raiting> Raitings { get; set; }
        public virtual ICollection<UserPoint> UserPoints { get; set; }
    }
}
