using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using GlassTickets.Authorization.Users;
using GlassTickets.Domain.Employees;
using GlassTickets.Domain.Tickets;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GlassTickets.Domain.Employees
{
    public class EmployeeManager : DomainService
    {
        private readonly UserManager _userManager;
        private readonly IRepository<Employee, Guid> _employeeRepository;


        public EmployeeManager(UserManager userManager, IRepository<Employee, Guid> employeeRepository)
        {
            _userManager = userManager;
            _employeeRepository = employeeRepository;
        }

        public async Task<Employee> CreateEmployeeAsync
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

                await _userManager.AddToRoleAsync(user, "Employee");

                Employee employee = new Employee
                {
                    Name = name,
                    Surname = surname,
                    UserName = username,
                    EmailAddress = email,
                    PhoneNumber = phoneNumber,
                    Department = department,
                    UserAccount = user,
                    TicketsAssigned = new List<Ticket>(),
                };

                await _employeeRepository.InsertAsync(employee);

                return employee;
            }
            catch (Exception e)
            {
                throw new UserFriendlyException(e.Message);
            }
        }

    }



}