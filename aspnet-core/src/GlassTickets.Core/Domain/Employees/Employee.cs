using GlassTickets.Domain.Shared;
using GlassTickets.Domain.Tickets;
using System.Collections.Generic;

namespace GlassTickets.Domain.Employees
{
    public class Employee : StaffMember
    {
        public virtual ICollection<Ticket> TicketsAssigned { get; set; } = new List<Ticket>();
    }
}
