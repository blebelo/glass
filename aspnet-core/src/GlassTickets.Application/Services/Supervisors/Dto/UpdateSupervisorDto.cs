using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using GlassTickets.Domain.Supervisors;
using System;

namespace GlassTickets.Services.Supervisors.Dto
{
    [AutoMap(typeof(Supervisor))]
    public class UpdateSupervisorDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string UserName { get; set; }
        public string EmailAddress { get; set; }
        public string PhoneNumber { get; set; }
        public string Department { get; set; }
    }
}
