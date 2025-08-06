using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using GlassTickets.Authorization.Users;
using System;
using System.Threading.Tasks;

namespace GlassTickets.Domain.Supervisors
{
    public class SupervisorManager : DomainService
    {
        private readonly UserManager _userManager;
        private readonly IRepository<Supervisors.Supervisor, Guid> _supervisorRepository;


        public SupervisorManager(UserManager userManager, IRepository<Supervisors.Supervisor, Guid> supervisorRepository)
        {
            _userManager = userManager;
            _supervisorRepository = supervisorRepository;
        }

        public async Task<Supervisors.Supervisor> CreateEmployeeAsync
            (
                string name,
                string surname,
                string username,
                string email,
                string password,
                string phoneNumber,
                string department
            )
        {
            try
            {
                var user = new User
                {
                    Name = name,
                    Surname = surname,
                    UserName = username,
                    EmailAddress = email,
                    Password = password
                };

                var userCreationResult = await _userManager.CreateAsync(user, password);

                if (!userCreationResult.Succeeded)
                {
                    throw new UserFriendlyException($"User creation failed");
                }

                await _userManager.AddToRoleAsync(user, "Admin");

                Supervisors.Supervisor supervisor = new Supervisors.Supervisor
                {
                    Name = name,
                    Surname = surname,
                    UserName = username,
                    EmailAddress = email,
                    PhoneNumber = phoneNumber,
                    Department = department,
                    UserAccount = user,
                };

                await _supervisorRepository.InsertAsync(supervisor);

                return supervisor;
            }
            catch (Exception e)
            {
                throw new UserFriendlyException(e.ToString());
            }
        }

    }



}