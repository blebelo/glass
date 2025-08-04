using GlassTickets.Authorization.Users;

namespace GlassTickets.Domain.Shared
{
    public abstract class StaffMember : User
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
