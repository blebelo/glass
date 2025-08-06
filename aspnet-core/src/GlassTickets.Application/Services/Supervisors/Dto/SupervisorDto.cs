using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using GlassTickets.Authorization.Users;
using GlassTickets.Domain.Employees;
using GlassTickets.Domain.Supervisors;
using GlassTickets.Services.Tickets.Dto;
using System;
using System.Collections.Generic;

namespace GlassTickets.Services.Employees.Dto
{
    [AutoMap(typeof(Domain.Supervisors.Supervisor))]
    public class SupervisorDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string EmailAddress { get; set; }
        public string PhoneNumber { get; set; }
        public string Department { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public User UserAccount { get; set; }
    }
}
