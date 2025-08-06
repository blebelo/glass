using Abp.Application.Services;
using Abp.Application.Services.Dto;
using GlassTickets.Services.Employees.Dto;
using System;
using System.Threading.Tasks;

namespace GlassTickets.Services.Employees
{
    public interface IEmployeeAppService: IAsyncCrudAppService<EmployeeDto, Guid, PagedAndSortedResultRequestDto, CreateEmployeeDto, UpdateEmployeeDto>
    {
        Task<EmployeeMinimalDto> GetEmployeeProfileAsync();
        Task<EmployeeDto> UpdatEmployeeAsync(UpdateEmployeeDto dto);
    }
}
