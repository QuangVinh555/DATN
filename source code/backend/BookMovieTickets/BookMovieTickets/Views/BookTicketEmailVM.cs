using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Views
{
    public class BookTicketEmailVM
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Movie { get; set; }
        public string Stamp { get; set; }
        public DateTime? ShowTime { get; set; }
        public string HourTimeStart { get; set; }
        public string HourTimeEnd { get; set; }
        public string Payment { get; set; }
        public string CinemaName { get; set; }
        public string Location { get; set; }
        public string CinemaRoom { get; set; }
        public string RoleMovie { get; set; }
        public double? TotalTicket { get; set; }
        public string NameCombo { get; set; }
        public double? CountCombo { get; set; }
        public double? TotalCombo { get; set; }
        public double? Total { get; set; }
        public double? TotalAll { get; set; }
        public double? RewardPoints_Used { get; set; }
        public int? RewardPoints { get; set; }
        public bool? State { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
