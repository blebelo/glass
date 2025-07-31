using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;

namespace GlassTickets.Entities
{
    public class Ticket : FullAuditedEntity<Guid>
    {
        public string ReferenceNumber { get; set; }
        public PriorityLevelEnum PriorityLevel { get; set; }
        public string Location { get; set; }
        public StatusEnum Status { get; set; }
        public string Category { get; set; }
        public string Description { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime LastUpdated { get; set; }
        public DateTime? DateClosed { get; set; }
        public string ReasonClosed { get; set; }
        public bool SendUpdates { get; set; }
        public string CustomerContactNumber { get; set; }
        public virtual ICollection<Employee> AssignedEmployees { get; set; } = new List<Employee>();

    }
}
