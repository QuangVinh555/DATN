using System;
using System.Collections.Generic;

#nullable disable

namespace BookMovieTickets.Data
{
    public partial class UserPoint
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public int? RewardPoints { get; set; }
        public int? RewardPointsUsed { get; set; }

        public virtual User User { get; set; }
    }
}
