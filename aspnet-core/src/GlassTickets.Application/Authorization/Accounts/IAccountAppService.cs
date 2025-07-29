using System.Threading.Tasks;
using Abp.Application.Services;
using GlassTickets.Authorization.Accounts.Dto;

namespace GlassTickets.Authorization.Accounts
{
    public interface IAccountAppService : IApplicationService
    {
        Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

        Task<RegisterOutput> Register(RegisterInput input);
    }
}
