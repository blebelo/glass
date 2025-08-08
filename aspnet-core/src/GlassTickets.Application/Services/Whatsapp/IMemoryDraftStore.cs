using GlassTickets.Services.Whatsapp.Dto;

namespace GlassTickets.Services.Whatsapp
{
    public interface IMemoryDraftStore
    {
        TicketDraftDto GetDraft(string sessionId);
        void SaveDraft(string sessionId, TicketDraftDto draft);
        void ClearDraft(string sessionId);
    }

}
