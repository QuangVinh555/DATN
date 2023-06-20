using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Views
{
    public class CommentVM
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Avatar { get; set; }
        public string Movie { get; set; }
        public string Content { get; set; }
        public int? CountStars { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}
