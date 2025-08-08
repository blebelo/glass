using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using GlassTickets.Authorization;
using GlassTickets.Services.ChatApp;
using GlassTickets.Services.MemoryDraft;
using System.Net.Http;

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
                cfg => cfg.AddMaps(thisAssembly)
            );

            IocManager.IocContainer.Register(
                Castle.MicroKernel.Registration.Component
                .For<IMemoryDraftStore>()
                .ImplementedBy<MemoryDraftStore>()
                .LifestyleSingleton()
            );

            IocManager.IocContainer.Register(
                Castle.MicroKernel.Registration.Component
                .For<IChatAppService>()
                .ImplementedBy<ChatAppService>()
                .LifestyleSingleton()
            );

            IocManager.IocContainer.Register(
                Castle.MicroKernel.Registration.Component
                .For<HttpClient>()
                .LifestyleSingleton()
            );
        }
    }
}