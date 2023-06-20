using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Views
{
    public class UserPointVM
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string FullName { get; set; }
        public int? RewardPoints { get; set; }
        public int? RewardPointsUsed { get; set; }
    }
}
