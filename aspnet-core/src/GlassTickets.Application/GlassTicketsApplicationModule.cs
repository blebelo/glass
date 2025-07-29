using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using GlassTickets.Authorization;

namespace GlassTickets
{
    [DependsOn(
        typeof(GlassTicketsCoreModule), 
        typeof(AbpAutoMapperModule))]
    public class GlassTicketsApplicationModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Authorization.Providers.Add<GlassTicketsAuthorizationProvider>();
        }

        public override void Initialize()
        {
            var thisAssembly = typeof(GlassTicketsApplicationModule).GetAssembly();

            IocManager.RegisterAssemblyByConvention(thisAssembly);

            Configuration.Modules.AbpAutoMapper().Configurators.Add(
                // Scan the assembly for classes which inherit from AutoMapper.Profile
                cfg => cfg.AddMaps(thisAssembly)
            );
        }
    }
}
