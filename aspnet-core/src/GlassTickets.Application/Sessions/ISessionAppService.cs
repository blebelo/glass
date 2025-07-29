using System.Threading.Tasks;
using Abp.Application.Services;
using GlassTickets.Sessions.Dto;

namespace GlassTickets.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
    }
}
