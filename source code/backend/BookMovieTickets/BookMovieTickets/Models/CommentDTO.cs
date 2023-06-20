using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Models
{
    public class CommentDTO
    {
        public int? UserId { get; set; }
        public int? MovieId { get; set; }
        public string Content { get; set; }
        public int? CountStars { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
