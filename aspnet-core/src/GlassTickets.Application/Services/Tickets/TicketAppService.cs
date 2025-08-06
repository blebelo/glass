using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using GlassTickets.Domain.Employees;
using GlassTickets.Domain.Tickets;
using GlassTickets.Services.Tickets.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;

namespace GlassTickets.Services.Tickets
{
    public class TicketAppService : ApplicationService, ITicketAppService
    {
        private readonly IRepository<Ticket, Guid> _ticketRepository;
        private readonly IRepository<Employee, Guid> _employeeRepository;

        public TicketAppService(IRepository<Ticket, Guid> ticketRepository, IRepository<Employee, Guid> employeeRepository)
        {
            _ticketRepository = ticketRepository;
            _employeeRepository = employeeRepository;
        }

        public Task<TicketDto> CreateAsync(TicketDto input)
        {
            var ticket = ObjectMapper.Map<Ticket>(input);
            ticket = _ticketRepository.Insert(ticket);
            return Task.FromResult(ObjectMapper.Map<TicketDto>(ticket));
        }

        public Task<TicketDto> UpdateAsync(TicketDto input)
        {
            var ticket = ObjectMapper.Map<Ticket>(input);
            ticket = _ticketRepository.Update(ticket);
            return Task.FromResult(ObjectMapper.Map<TicketDto>(ticket));

        }

        public Task DeleteAsync(Guid input)
        {
            return _ticketRepository.DeleteAsync(input);
        }

        public async Task<TicketDto> GetAsync(Guid input)
        {
            var ticket = await _ticketRepository.GetAsync(input);
            return ObjectMapper.Map<TicketDto>(ticket);
        }

        public Task<PagedResultDto<TicketDto>> GetAllAsync(PagedAndSortedResultRequestDto input)
        {
            var query = _ticketRepository.GetAll();
            var totalCount = query.Count();
            var tickets = query.PageBy(input).ToList();
            var ticketDtos = ObjectMapper.Map<List<TicketDto>>(tickets);
            return Task.FromResult(new PagedResultDto<TicketDto>(totalCount, ticketDtos));
        }

        public async Task<TicketDto> AssignEmployeeAsync(Guid ticketId, List<Guid> employeeIds)
        {
            var ticket = await _ticketRepository.GetAsync(ticketId);
            var employees = await _employeeRepository.GetAllListAsync(e => employeeIds.Contains(e.Id));

            if (ticket == null)
            {
                throw new EntityNotFoundException(typeof(Ticket), ticketId);
            }

            if (employees == null || !employees.Any())
            {
                throw new EntityNotFoundException(typeof(Employee), employeeIds);
            }
            ticket.AssignedEmployees = employees;
            ticket.LastUpdated = DateTime.Now;
            ticket.Status = StatusEnum.Assigned;
            ticket = await _ticketRepository.UpdateAsync(ticket);
            return ObjectMapper.Map<TicketDto>(ticket);
        }

        public async Task<TicketDto> CloseTicketAsync(Guid input, Guid employeeId)
        {
            var ticket = await _ticketRepository.GetAsync(input);
            var employee = await _employeeRepository.GetAsync(employeeId);

            if (ticket == null)
            {
                throw new EntityNotFoundException(typeof(Ticket), input);
            }
            if (employee == null)
            {
                throw new EntityNotFoundException(typeof(Employee), employeeId);
            }
            if (ticket.Status == StatusEnum.Closed)
            {
                throw new InvalidOperationException("Ticket is already closed.");
            }
            if (ticket.AssignedEmployees == null || !ticket.AssignedEmployees.Any(e => e.Id == employeeId))
            {
                throw new InvalidOperationException("Employee is not assigned to this ticket.");
            }

            ticket.Status = StatusEnum.Closed;
            ticket.DateClosed = DateTime.Now;
            ticket.ReasonClosed = "Ticket has been resolved.";

            _ticketRepository.UpdateAsync(ticket);
            return ObjectMapper.Map<TicketDto>(ticket);
        }
    }
}
