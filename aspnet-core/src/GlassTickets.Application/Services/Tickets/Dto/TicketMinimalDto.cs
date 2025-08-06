using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using GlassTickets.Domain.Tickets;
using GlassTickets.Services.Employees.Dto;
using System.Collections.Generic;

namespace GlassTickets.Services.Tickets.Dto
{
    [AutoMap(typeof(Ticket))]
    public class TicketMinimalDto : EntityDto<long>
    {
        public string ReferenceNumber { get; set; }
        public PriorityLevelEnum PriorityLevel { get; set; }
        public string Location { get; set; }
        public StatusEnum Status { get; set; }
        public string Category { get; set; }
        public string Description { get; set; }
        public string ReasonClosed { get; set; }
        public bool SendUpdates { get; set; }
        public string CustomerNumber { get; set; }
        public List<EmployeeMinimalDto> AssignedEmployees { get; set; }
    }
}
