using System.Threading.Tasks;

namespace GlassTickets.Services.Twilio
{
    public interface ITwilioService
    {
        Task SendWhatsAppMessageAsync(string to, string message);
    }
}