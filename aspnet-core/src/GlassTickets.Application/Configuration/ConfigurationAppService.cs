using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Runtime.Session;
using GlassTickets.Configuration.Dto;

namespace GlassTickets.Configuration
{
    [AbpAuthorize]
    public class ConfigurationAppService : GlassTicketsAppServiceBase, IConfigurationAppService
    {
        public async Task ChangeUiTheme(ChangeUiThemeInput input)
        {
            await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
        }
    }
}
