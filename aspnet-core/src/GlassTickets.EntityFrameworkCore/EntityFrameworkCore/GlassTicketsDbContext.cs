using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using GlassTickets.Authorization.Roles;
using GlassTickets.Authorization.Users;
using GlassTickets.MultiTenancy;
using GlassTickets.Domain.Supervisors;
using GlassTickets.Domain.Tickets;
using GlassTickets.Domain.Employees;

namespace GlassTickets.EntityFrameworkCore
{
    public class GlassTicketsDbContext : AbpZeroDbContext<Tenant, Role, User, GlassTicketsDbContext>
    {
        /* Define a DbSet for each entity of the application */
        public DbSet<Domain.Supervisors.Supervisor> Supervisors { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<Domain.Employees.Employee> Employees { get; set; }

        public GlassTicketsDbContext(DbContextOptions<GlassTicketsDbContext> options)
            : base(options)
        {
        }
    }
}
