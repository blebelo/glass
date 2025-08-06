using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using GlassTickets.Authorization.Users;
using GlassTickets.Domain.Supervisors;
using System;

namespace GlassTickets.Services.Supervisors.Dto
{
    [AutoMap(typeof(Supervisor))]
    public class SupervisorDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string EmailAddress { get; set; }
        public string PhoneNumber { get; set; }
        public string Department { get; set; }
        public string UserName { get; set; }
        public User UserAccount { get; set; }
    }
}
