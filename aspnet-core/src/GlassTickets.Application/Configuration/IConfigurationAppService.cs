using System.Threading.Tasks;
using GlassTickets.Configuration.Dto;

namespace GlassTickets.Configuration
{
    public interface IConfigurationAppService
    {
        Task ChangeUiTheme(ChangeUiThemeInput input);
    }
}
