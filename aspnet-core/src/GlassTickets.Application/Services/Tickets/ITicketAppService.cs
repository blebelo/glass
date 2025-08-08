using Abp.Application.Services;
using Abp.Application.Services.Dto;
using GlassTickets.Services.Tickets.Dto;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GlassTickets.Services.Tickets
{
    public interface ITicketAppService : IApplicationService
    {
        Task<TicketDto> CreateAsync(TicketDto input);
        Task<TicketDto> UpdateAsync(TicketDto input);
        Task DeleteAsync(Guid input);
        Task<TicketDto> GetAsync(Guid input);
        Task<PagedResultDto<TicketDto>> GetAllAsync(PagedAndSortedResultRequestDto input);
        Task<TicketDto> AssignEmployeesAsync(Guid input, List<Guid> employeeIds);
        Task<TicketDto> CloseTicketAsync(Guid input, Guid employeeId);
        Task<TicketDto> GetByReferenceNumberAsync(string referenceNumber);
    }
}
