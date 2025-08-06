using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using GlassTickets.Domain.Employees;
using GlassTickets.Services.Tickets.Dto;
using System;
using System.Collections.Generic;

namespace GlassTickets.Services.Employees.Dto
{
    [AutoMap(typeof(Employee))]
    public class EmployeeMinimalDto : EntityDto<Guid>
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string EmailAddress { get; set; }
        public string PhoneNumber { get; set; }
        public string Department { get; set; }
        public List<TicketMinimalDto> TicketsAssigned { get; set; }
    }
}
