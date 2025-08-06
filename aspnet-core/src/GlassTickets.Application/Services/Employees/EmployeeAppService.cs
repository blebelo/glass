using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.UI;
using AutoMapper.Internal.Mappers;
using GlassTickets.Authorization.Users;
using GlassTickets.Domain.Employees;
using GlassTickets.Services.Employees.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace GlassTickets.Services.Employees
{
    public class EmployeeAppService : AsyncCrudAppService<Employee, EmployeeDto, Guid, PagedAndSortedResultRequestDto, CreateEmployeeDto, UpdateEmployeeDto>
    {
        private readonly IRepository<Employee, Guid> _employeeRepository;
        private readonly EmployeeManager _employeeManager;

        public EmployeeAppService(IRepository<Employee, Guid> employeeRepository, EmployeeManager employeeManager) : base(employeeRepository)
        {
            _employeeRepository = employeeRepository;
            _employeeManager = employeeManager;
        }

        public override async Task<EmployeeDto> CreateAsync(CreateEmployeeDto input)
        {
            var employee = await _employeeManager.CreateEmployeeAsync(
                input.Name,
                input.Surname,
                input.UserName,
                input.EmailAddress,
                input.Password,
                input.PhoneNumber,
                input.Department
            );
            return ObjectMapper.Map<EmployeeDto>(employee);
        }

        public async Task<EmployeeDto> GetEmployeeProfileAsync()
        {
            var employee = await _employeeRepository
                .GetAll()
                .Include(e => e.UserAccount)
                .FirstOrDefaultAsync(e => e.UserAccount != null && e.UserAccount.Id == AbpSession.UserId.Value);

            if (employee == null)
            {
                throw new UserFriendlyException("Profile not found.");
            }

            return ObjectMapper.Map<EmployeeDto>(employee);
        }

        public async Task<EmployeeDto> UpdateEmployeeAsync(UpdateEmployeeDto input)
        {
            var employee = await _employeeRepository
                .GetAll()
                .Include(e => e.UserAccount)
                .FirstOrDefaultAsync(e => e.UserAccount != null && e.UserAccount.Id == AbpSession.UserId.Value);

            if (employee == null)
            {
                throw new UserFriendlyException("Developer profile not found.");
            }

            ObjectMapper.Map(input, employee);

            await _employeeRepository.UpdateAsync(employee);
            return ObjectMapper.Map<EmployeeDto>(employee);
        }
    }
}