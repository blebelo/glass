using GlassTickets.Services.Whatsapp.Dto;
using System.Threading.Tasks;

namespace GlassTickets.Services.Whatsapp
{
    public interface IChatAppService
    {
        Task<(string responseText, TicketDraftDto updatedDraft)> ProcessMessageAsync(string userMessage, TicketDraftDto draft);
    }

}
