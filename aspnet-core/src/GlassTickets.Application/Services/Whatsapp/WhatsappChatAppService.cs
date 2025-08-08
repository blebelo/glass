using Abp.Application.Services;
using GlassTickets.Domain.Tickets;
using GlassTickets.Services.Tickets;
using GlassTickets.Services.Tickets.Dto;
using GlassTickets.Services.Whatsapp.Dto;
using System;
using System.Threading.Tasks;

namespace GlassTickets.Services.Whatsapp
{
    public class WhatsappChatAppService : ApplicationService, IWhatsAppChatAppService
    {
        private readonly ITicketAppService _ticketAppService;
        private readonly IChatAppService _chatAppService;
        private readonly IMemoryDraftStore _memoryStore;

        public WhatsappChatAppService(
            ITicketAppService ticketAppService,
            IChatAppService chatAppService,
            IMemoryDraftStore memoryStore
        )
        {
            _ticketAppService = ticketAppService;
            _chatAppService = chatAppService;
            _memoryStore = memoryStore;
        }

        public async Task<string> HandleIncomingMessageAsync(string from, string message)
        {
            var draft = _memoryStore.GetDraft(from) ?? new TicketDraftDto { SessionId = from };

            var (responseText, updatedDraft) = await _chatAppService.ProcessMessageAsync(message, draft);

            if (updatedDraft.IsComplete)
            {
                var finalTicket = new TicketDto
                {
                    ReferenceNumber = updatedDraft.ReferenceNumber ?? GenerateReference(updatedDraft.Location),
                    PriorityLevel = updatedDraft.PriorityLevel.Value,
                    Location = updatedDraft.Location,
                    Category = updatedDraft.Category,
                    Description = updatedDraft.Description,
                    SendUpdates = updatedDraft.SendUpdates.Value,
                    CustomerNumber = updatedDraft.CustomerNumber,
                    DateCreated = DateTime.Now,
                    LastUpdated = DateTime.Now,
                    Status = StatusEnum.Open
                };

                await _ticketAppService.CreateAsync(finalTicket);
                _memoryStore.ClearDraft(from);

                return $"✅ Ticket created successfully! Reference: {finalTicket.ReferenceNumber}";
            }

            _memoryStore.SaveDraft(from, updatedDraft);
            return responseText;
        }

        private string GenerateReference(string location)
        {
            var random = new Random().Next(0, 999).ToString("D3");
            return $"{location?.ToUpper()?.Replace(" ", "")}-{random}";
        }
    }
}
