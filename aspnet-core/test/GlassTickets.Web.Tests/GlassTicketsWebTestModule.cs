using Abp.AspNetCore;
using Abp.AspNetCore.TestBase;
using Abp.Modules;
using Abp.Reflection.Extensions;
using GlassTickets.EntityFrameworkCore;
using GlassTickets.Web.Startup;
using Microsoft.AspNetCore.Mvc.ApplicationParts;

namespace GlassTickets.Web.Tests
{
    [DependsOn(
        typeof(GlassTicketsWebMvcModule),
        typeof(AbpAspNetCoreTestBaseModule)
    )]
    public class GlassTicketsWebTestModule : AbpModule
    {
        public GlassTicketsWebTestModule(GlassTicketsEntityFrameworkModule abpProjectNameEntityFrameworkModule)
        {
            abpProjectNameEntityFrameworkModule.SkipDbContextRegistration = true;
        } 
        
        public override void PreInitialize()
        {
            Configuration.UnitOfWork.IsTransactional = false; //EF Core InMemory DB does not support transactions.
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(GlassTicketsWebTestModule).GetAssembly());
        }
        
        public override void PostInitialize()
        {
            IocManager.Resolve<ApplicationPartManager>()
                .AddApplicationPartsIfNotAddedBefore(typeof(GlassTicketsWebMvcModule).Assembly);
        }
    }
}