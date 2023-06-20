using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Views
{
    public class UserVM
    {
        public int Id { get; set; }
        public int? RoleId { get; set; }
        public int? LoginTypeId { get; set; }
        public int? UserRankId { get; set; }
        public string UserRank { get; set; }
        public string Avatar { get; set; }
        public string Fullname { get; set; }
        public string Email { get; set; }
        public DateTime? Date { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string Password { get; set; }
        public bool? Deleted { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
