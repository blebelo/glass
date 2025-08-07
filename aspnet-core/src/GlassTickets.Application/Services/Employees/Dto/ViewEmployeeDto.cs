using Abp.Application.Services.Dto;
using GlassTickets.Services.Tickets.Dto;
using System;
using System.Collections.Generic;

namespace GlassTickets.Services.Employees.Dto
{
    public class ViewEmployeeDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string EmailAddress { get; set; }
        public string PhoneNumber { get; set; }
        public string Department { get; set; }
    }
}
