using System;
using System.Collections.Generic;

#nullable disable

namespace BookMovieTickets.Data
{
    public partial class UserRank
    {
        public UserRank()
        {
            Users = new HashSet<User>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public int? Benchmark { get; set; }

        public virtual ICollection<User> Users { get; set; }
    }
}
