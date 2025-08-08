using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using GlassTickets.Configuration;
using GlassTickets.Web;

namespace GlassTickets.EntityFrameworkCore
{
    /* This class is needed to run "dotnet ef ..." commands from command line on development. Not used anywhere else */
    public class GlassTicketsDbContextFactory : IDesignTimeDbContextFactory<GlassTicketsDbContext>
    {
        public GlassTicketsDbContext CreateDbContext(string[] args)
        {
            var builder = new DbContextOptionsBuilder<GlassTicketsDbContext>();
            
            /*
             You can provide an environmentName parameter to the AppConfigurations.Get method. 
             In this case, AppConfigurations will try to read appsettings.{environmentName}.json.
             Use Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") method or from string[] args to get environment if necessary.
             https://docs.microsoft.com/en-us/ef/core/cli/dbcontext-creation?tabs=dotnet-core-cli#args
             */
            var configuration = AppConfigurations.Get(WebContentDirectoryFinder.CalculateContentRootFolder());
            //var connectionString = "Host=turntable.proxy.rlwy.net;Port=53335;Database=railway;Username=postgres;Password=oPvVfUbTBSGVHLAQeWHSOkVeuApVQWAa";
            GlassTicketsDbContextConfigurer.Configure(builder, configuration.GetConnectionString(GlassTicketsConsts.ConnectionStringName));

            return new GlassTicketsDbContext(builder.Options);
        }
    }
}
