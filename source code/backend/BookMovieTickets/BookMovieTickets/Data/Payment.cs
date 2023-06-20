using System;
using System.Collections.Generic;

#nullable disable

namespace BookMovieTickets.Data
{
    public partial class Payment
    {
        public Payment()
        {
            BookTickets = new HashSet<BookTicket>();
        }

        public int Id { get; set; }
        public string PaymentType { get; set; }

        public virtual ICollection<BookTicket> BookTickets { get; set; }
    }
}
