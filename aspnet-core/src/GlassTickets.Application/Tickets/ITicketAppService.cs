using Abp.Application.Services;
using Abp.Application.Services.Dto;
using GlassTickets.Tickets.Dto;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GlassTickets.Tickets
{
    public interface ITicketAppService : IApplicationService
    {
        Task<TicketDto> CreateAsync(TicketDto input);
        Task<TicketDto> UpdateAsync(TicketDto input);
        Task DeleteAsync(Guid input);
        Task<TicketDto> GetAsync(Guid input);
        Task<PagedResultDto<TicketDto>> GetAllAsync(PagedAndSortedResultRequestDto input);
        Task<TicketDto> AssignEmployeeAsync(Guid input, List<long> employeeIds);
        Task<TicketDto> CloseTicketAsync(Guid input, long employeeId);
    }
}
