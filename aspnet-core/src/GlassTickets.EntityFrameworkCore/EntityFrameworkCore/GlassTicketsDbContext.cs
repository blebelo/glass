using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using GlassTickets.Authorization.Roles;
using GlassTickets.Authorization.Users;
using GlassTickets.MultiTenancy;

namespace GlassTickets.EntityFrameworkCore
{
    public class GlassTicketsDbContext : AbpZeroDbContext<Tenant, Role, User, GlassTicketsDbContext>
    {
        /* Define a DbSet for each entity of the application */
        
        public GlassTicketsDbContext(DbContextOptions<GlassTicketsDbContext> options)
            : base(options)
        {
        }
    }
}
