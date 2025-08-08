using System.Threading.Tasks;

namespace GlassTickets.Services.TicketTracking
{
    public interface ITicketTrackingService
    {
        /// <summary>
/// Asynchronously retrieves the status of a ticket given its reference number.
/// </summary>
/// <param name="referenceNumber">The unique identifier of the ticket.</param>
/// <returns>A task representing the asynchronous operation, with the ticket status as a string.</returns>
Task<string> GetTicketStatusAsync(string referenceNumber);
        /// <summary>
/// Determines whether the provided message is a ticket tracking request.
/// </summary>
/// <param name="message">The message to evaluate.</param>
/// <returns>True if the message is a tracking request; otherwise, false.</returns>
bool IsTrackingRequest(string message);
        /// <summary>
/// Extracts the ticket reference number from the provided message.
/// </summary>
/// <param name="message">The message containing the ticket reference number.</param>
/// <returns>The extracted ticket reference number, or null if none is found.</returns>
string ExtractReferenceNumber(string message);
    }
}
