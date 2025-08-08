using GlassTickets.Services.Whatsapp.Dto;
using System.Collections.Concurrent;

namespace GlassTickets.Services.Whatsapp
{

    public class MemoryDraftStore : IMemoryDraftStore
    {
        private readonly ConcurrentDictionary<string, TicketDraftDto> _drafts = new();

        public TicketDraftDto GetDraft(string sessionId)
        {
            _drafts.TryGetValue(sessionId, out var draft);
            return draft;
        }

        public void SaveDraft(string sessionId, TicketDraftDto draft)
        {
            _drafts[sessionId] = draft;
        }

        public void ClearDraft(string sessionId)
        {
            _drafts.TryRemove(sessionId, out _);
        }
    }

}
