using GlassTickets.Domain.Tickets;

namespace GlassTickets.Services.Whatsapp.Dto
{
    public class TicketDraftDto
    {
        public string SessionId { get; set; }
        public string ReferenceNumber { get; set; }
        public PriorityLevelEnum PriorityLevel { get; set; }
        public string Location { get; set; }
        public string Category { get; set; }
        public string Description { get; set; }
        public bool? SendUpdates { get; set; }
        public string CustomerNumber { get; set; }
        public bool IsComplete { get; set; } = false;

        public bool IsReadyForSubmission =>
            !string.IsNullOrWhiteSpace(ReferenceNumber) &&
            !string.IsNullOrWhiteSpace(Location) &&
            !string.IsNullOrWhiteSpace(Category) &&
            !string.IsNullOrWhiteSpace(Description) &&
            SendUpdates.HasValue &&
            !string.IsNullOrWhiteSpace(CustomerNumber);
    }
}