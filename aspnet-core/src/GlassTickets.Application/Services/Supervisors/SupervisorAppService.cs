using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.UI;
using GlassTickets.Domain.Supervisors;
using GlassTickets.Services.Employees.Dto;
using GlassTickets.Services.Supervisors.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace GlassTickets.Services.Supervisors
{
    public class SupervisorAppService : AsyncCrudAppService<Supervisor, SupervisorDto, Guid, PagedAndSortedResultRequestDto, CreateSupervisorDto, UpdateSupervisorDto>
    {
        private readonly IRepository<Supervisor, Guid> _supervisorRepository;
        private readonly SupervisorManager _supervisorManager;

        public SupervisorAppService(IRepository<Supervisor, Guid> supervisorRepository, SupervisorManager supervisorManager) 
            : base(supervisorRepository)
        {
            _supervisorRepository = supervisorRepository;
            _supervisorManager = supervisorManager;
        }

        public override async Task<SupervisorDto> CreateAsync(CreateSupervisorDto input)
        {

            var employee = await _supervisorManager.CreateEmployeeAsync(
                input.Name,
                input.Surname,
                input.UserName,
                input.EmailAddress,
                input.Password,
                input.PhoneNumber,
                input.Department
            );
            return ObjectMapper.Map<SupervisorDto>(employee);
        }
        public async Task<SupervisorDto> GetEmployeeProfileAsync()
        {
            var supervisor = await _supervisorRepository
                .GetAll()
                .Include(e => e.UserAccount)
                .FirstOrDefaultAsync(e => e.UserAccount != null && e.UserAccount.Id == AbpSession.UserId.Value);

            if (supervisor == null)
            {
                throw new UserFriendlyException("Profile not found.");
            }

            return ObjectMapper.Map<SupervisorDto>(supervisor);
        }
        public async Task<SupervisorDto> UpdateSupervisorAsync(UpdateSupervisorDto input)
        {
            var supervisor = await _supervisorRepository
                .GetAll()
                .Include(e => e.UserAccount)
                .FirstOrDefaultAsync(e => e.UserAccount != null && e.UserAccount.Id == AbpSession.UserId.Value);

            if (supervisor == null)
            {
                throw new UserFriendlyException("Profile not found.");
            }

            ObjectMapper.Map(input, supervisor);

            await _supervisorRepository.UpdateAsync(supervisor);
            return ObjectMapper.Map<SupervisorDto>(supervisor);
        }
    }
}