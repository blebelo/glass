using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using GlassTickets.Domain.Supervisors;
using System;

namespace GlassTickets.Services.Supervisors.Dto
{
    [AutoMap(typeof(Supervisor))]
    public class SupervisorMinimalDto : EntityDto<Guid>
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string EmailAddress { get; set; }
        public string PhoneNumber { get; set; }
        public string Department { get; set; }
    }
}
