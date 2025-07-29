using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace GlassTickets.EntityFrameworkCore
{
    public static class GlassTicketsDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<GlassTicketsDbContext> builder, string connectionString)
        {
            builder.UseNpgsql(connectionString);
        }

        public static void Configure(DbContextOptionsBuilder<GlassTicketsDbContext> builder, DbConnection connection)
        {
            builder.UseNpgsql(connection);
        }
    }
}
