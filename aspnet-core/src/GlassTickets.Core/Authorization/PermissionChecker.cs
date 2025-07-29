using Abp.Authorization;
using GlassTickets.Authorization.Roles;
using GlassTickets.Authorization.Users;

namespace GlassTickets.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {
        }
    }
}
