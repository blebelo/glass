using Abp.AutoMapper;
using GlassTickets.Domain.Supervisors;
using System.ComponentModel.DataAnnotations;

namespace GlassTickets.Services.Supervisors.Dto
{
    [AutoMap(typeof(Supervisor))]
    public class CreateSupervisorDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Surname { get; set; }
        [Required]
        [EmailAddress]
        public string EmailAddress { get; set; }
        [Required]
        [Phone]
        public string PhoneNumber { get; set; }
        [Required]
        public string Department { get; set; }
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
