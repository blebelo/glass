using Abp.Application.Services;
using System.Threading.Tasks;

namespace GlassTickets.Services.Whatsapp;

public interface IWhatsAppChatAppService : IApplicationService
{
    public Task<string> HandleIncomingMessageAsync(string from, string message);

}
