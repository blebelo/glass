using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using GlassTickets.Domain.Employees;
using GlassTickets.Domain.Tickets;
using System;
using System.Collections.Generic;

namespace GlassTickets.Tickets.Dto
{
    [AutoMap(typeof(Ticket))]
    public class TicketDto: EntityDto<Guid>
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
        public string CustomerNumber { get; set; }
        public virtual List<Employee> AssignedEmployees { get; set; }
    }
}
