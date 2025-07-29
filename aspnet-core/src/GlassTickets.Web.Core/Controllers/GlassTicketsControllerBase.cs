using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace GlassTickets.Controllers
{
    public abstract class GlassTicketsControllerBase: AbpController
    {
        protected GlassTicketsControllerBase()
        {
            LocalizationSourceName = GlassTicketsConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
