using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using GlassTickets.Configuration;

namespace GlassTickets.Web.Host.Startup
{
    [DependsOn(
       typeof(GlassTicketsWebCoreModule))]
    public class GlassTicketsWebHostModule: AbpModule
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public GlassTicketsWebHostModule(IWebHostEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(GlassTicketsWebHostModule).GetAssembly());
        }
    }
}
