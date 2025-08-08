using System.Threading.Tasks;

namespace GlassTickets.Services.TicketTracking
{
    public interface ITicketTrackingService
    {
        Task<string> GetTicketStatusAsync(string referenceNumber);
        bool IsTrackingRequest(string message);
        string ExtractReferenceNumber(string message);
    }
}
