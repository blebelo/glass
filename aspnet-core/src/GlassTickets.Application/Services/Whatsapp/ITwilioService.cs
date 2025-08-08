using System.Threading.Tasks;

namespace GlassTickets.Services.Whatsapp
{
    public interface ITwilioService
    {
        Task SendWhatsAppMessageAsync(string to, string message);
    }
}