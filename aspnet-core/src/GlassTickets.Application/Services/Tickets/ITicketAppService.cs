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
        /// <summary>
/// Retrieves a paged and sorted list of tickets based on the specified criteria.
/// </summary>
/// <param name="input">The paging and sorting criteria for retrieving tickets.</param>
/// <returns>A paged result containing ticket data transfer objects.</returns>
Task<PagedResultDto<TicketDto>> GetAllAsync(PagedAndSortedResultRequestDto input);
        /// <summary>
/// Assigns the specified employees to the ticket identified by the given GUID.
/// </summary>
/// <param name="input">The unique identifier of the ticket.</param>
/// <param name="employeeIds">A list of unique identifiers for the employees to assign.</param>
/// <returns>The updated ticket data transfer object.</returns>
Task<TicketDto> AssignEmployeesAsync(Guid input, List<Guid> employeeIds);
        /// <summary>
/// Closes the specified ticket and associates the action with the given employee.
/// </summary>
/// <param name="input">The unique identifier of the ticket to close.</param>
/// <param name="employeeId">The unique identifier of the employee performing the close action.</param>
/// <returns>The updated ticket data transfer object.</returns>
Task<TicketDto> CloseTicketAsync(Guid input, Guid employeeId);
        /// <summary>
/// Retrieves a ticket by its reference number.
/// </summary>
/// <param name="referenceNumber">The reference number of the ticket to retrieve.</param>
/// <returns>The ticket matching the specified reference number.</returns>
Task<TicketDto> GetByReferenceNumberAsync(string referenceNumber);
    }
}
