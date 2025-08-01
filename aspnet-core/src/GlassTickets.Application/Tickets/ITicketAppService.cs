using Abp.Application.Services;
using Abp.Application.Services.Dto;
using GlassTickets.Tickets.Dto;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GlassTickets.Tickets
{
    public interface ITicketAppService : IApplicationService
    {
        Task<TicketDto> CreateAsync(TicketDto input);
        Task<TicketDto> UpdateAsync(TicketDto input);
        Task DeleteAsync(EntityDto<Guid> input);
        Task<TicketDto> GetAsync(EntityDto<Guid> input);
        Task<PagedResultDto<TicketDto>> GetAllAsync(PagedAndSortedResultRequestDto input);
        Task<TicketDto> AssignEmployeeAsync(EntityDto<Guid> input, List<Guid> employeeIds);
        Task<TicketDto> CloseTicketAsync(EntityDto<Guid> input, Guid employeeId);

    }
}
