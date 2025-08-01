using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Linq.Extensions;
using GlassTickets.Domain.Employees;
using GlassTickets.Domain.Supervisors;
using GlassTickets.Domain.Tickets;
using GlassTickets.Tickets.Dto;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;

namespace GlassTickets.Tickets
{
    public class TicketAppService : ApplicationService, ITicketAppService
    {
        private readonly IRepository<Ticket, Guid> _ticketRepository;
        private readonly IRepository<Supervisor, Guid> _supervisorRepository;
        private readonly IRepository<Employee, Guid> _employeeRepository;

        public TicketAppService(IRepository<Ticket, Guid> ticketRepository, IRepository<Supervisor, Guid> supervisorRepository, IRepository<Employee, Guid> employeeRepository)
        {
            _ticketRepository = ticketRepository;
            _supervisorRepository = supervisorRepository;
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

        public Task DeleteAsync(EntityDto<Guid> input)
        {
            return _ticketRepository.DeleteAsync(input.Id);
        }

        public Task<TicketDto> GetAsync(EntityDto<Guid> input)
        {
            var ticket = _ticketRepository.GetAsync(input.Id);
            return ticket.ContinueWith(t => ObjectMapper.Map<TicketDto>(t.Result));
        }

        public Task<PagedResultDto<TicketDto>> GetAllAsync(PagedAndSortedResultRequestDto input)
        {
            var query = _ticketRepository.GetAll();
            var totalCount = query.Count();
            var tickets = query.PageBy(input).ToList();
            var ticketDtos = ObjectMapper.Map<List<TicketDto>>(tickets);
            return Task.FromResult(new PagedResultDto<TicketDto>(totalCount, ticketDtos));
        }

        public async Task<TicketDto> AssignEmployeesAsync(EntityDto<Guid> input, List<Guid> employeeIds)
        {
            if (employeeIds == null || !employeeIds.Any())
                throw new ArgumentException("Employee IDs cannot be null or empty", nameof(employeeIds));

            var ticket = await _ticketRepository.GetAsync(input.Id);
            if (ticket == null)
                throw new EntityNotFoundException($"Ticket with ID {input.Id} not found");

            var employees = await _employeeRepository.GetAllListAsync(e => employeeIds.Contains(e.Id));
            var foundEmployeeIds = employees.Select(e => e.Id).ToHashSet();
            var missingEmployeeIds = employeeIds.Except(foundEmployeeIds).ToList();

            if (missingEmployeeIds.Any())
                throw new EntityNotFoundException($"Employees not found: {string.Join(", ", missingEmployeeIds)}");

            ticket.AssignedEmployees ??= new List<Employee>();
            var currentlyAssignedIds = ticket.AssignedEmployees.Select(e => e.Id).ToHashSet();

            foreach (var employee in employees)
            {
                if (!currentlyAssignedIds.Contains(employee.Id))
                {
                    ticket.AssignedEmployees.Add(employee);
                }
            }

            await _ticketRepository.UpdateAsync(ticket);
            return ObjectMapper.Map<TicketDto>(ticket);
        }

        public async Task<TicketDto> AssignEmployeeAsync(EntityDto<Guid> input, Guid employeeId)
        {
            return await AssignEmployeesAsync(input, new List<Guid> { employeeId });
        }

        public Task<TicketDto> CloseTicketAsync(EntityDto<Guid> input, Guid employeeId)
        {
            throw new NotImplementedException();
        }
    }
}
