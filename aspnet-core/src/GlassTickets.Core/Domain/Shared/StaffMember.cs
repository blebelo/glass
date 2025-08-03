using Abp.Domain.Entities.Auditing;
using GlassTickets.Authorization.Users;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace GlassTickets.Domain.Shared
{
    public abstract class StaffMember : FullAuditedEntity<Guid>
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string EmailAddress { get; set; }
        public string PhoneNumber { get; set; }
        public string Department { get; set; }
        public User UserAccount { get; set; }
        [NotMapped]
        public string UserName { get; set; }
        [NotMapped]
        public string Password { get; set; }
    }
}
