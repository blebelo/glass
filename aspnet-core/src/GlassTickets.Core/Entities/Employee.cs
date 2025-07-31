using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;

namespace GlassTickets.Entities
{
    public class Employee : FullAuditedEntity<Guid>
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string EmailAddress { get; set; }
        public string PhoneNumber { get; set; }

        public virtual ICollection<Ticket> TicketsAssigned { get; set; } = new List<Ticket>();
    }
}