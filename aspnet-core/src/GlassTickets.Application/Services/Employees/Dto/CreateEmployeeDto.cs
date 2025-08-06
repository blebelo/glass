using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using GlassTickets.Domain.Employees;
using System;

namespace GlassTickets.Services.Employees.Dto
{
    [AutoMap(typeof(Employee))]
    public class CreateEmployeeDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string EmailAddress { get; set; }
        public string PhoneNumber { get; set; }
        public string Department { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}
