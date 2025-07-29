using Abp.Application.Services;
using GlassTickets.MultiTenancy.Dto;

namespace GlassTickets.MultiTenancy
{
    public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
    {
    }
}

