using Abp.Application.Services;
using GlassTickets.Domain.Tickets;
using GlassTickets.Services.ChatApp;
using GlassTickets.Services.MemoryDraft;
using GlassTickets.Services.Tickets;
using GlassTickets.Services.Tickets.Dto;
using GlassTickets.Services.TicketTracking;
using GlassTickets.Services.Whatsapp.Dto;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace GlassTickets.Services.Whatsapp
{
    public class WhatsappChatAppService : ApplicationService, IWhatsAppChatAppService
    {
        private readonly ITicketAppService _ticketAppService;
        private readonly IChatAppService _chatAppService;
        private readonly IMemoryDraftStore _memoryStore;
        private readonly ITicketTrackingService _trackingService;
        private readonly ILogger<WhatsappChatAppService> _logger;

        public WhatsappChatAppService(
            ITicketAppService ticketAppService,
            IChatAppService chatAppService,
            IMemoryDraftStore memoryStore,
            ITicketTrackingService trackingService,
            ILogger<WhatsappChatAppService> logger
        )
        {
            _ticketAppService = ticketAppService;
            _chatAppService = chatAppService;
            _memoryStore = memoryStore;
            _trackingService = trackingService;
            _logger = logger;
        }

        public async Task<string> HandleIncomingMessageAsync(string from, string message)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(from) || string.IsNullOrWhiteSpace(message))
                    return "❌ Invalid message received.";

                _logger.LogInformation("Processing message from {From}: {Message}", from, message);

                if (_trackingService.IsTrackingRequest(message))
                {
                    var referenceNumber = _trackingService.ExtractReferenceNumber(message);

                    if (string.IsNullOrWhiteSpace(referenceNumber))
                    {
                        return "🔍 **Track Your Ticket**\n\n" +
                               "To track your ticket, please provide your reference number.\n" +
                               "Example: JHB-123 or SANDTON-456\n\n" +
                               "You can also say: 'track JHB-123' or 'status JHB-123'";
                    }

                    return await _trackingService.GetTicketStatusAsync(referenceNumber);
                }

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

                    var successMessage = $"✅ **Ticket Created Successfully!**\n\n" +
                                       $"📋 Reference Number: **{finalTicket.ReferenceNumber}**\n" +
                                       $"📍 Location: {finalTicket.Location}\n" +
                                       $"🏷️ Category: {finalTicket.Category}\n" +
                                       $"⚡ Priority: {GetPriorityText(finalTicket.PriorityLevel)}\n\n" +
                                       $"💡 **Save this reference number!** You can use it to track your ticket anytime by sending: 'track {finalTicket.ReferenceNumber}'\n\n" +
                                       $"📧 You will receive updates on this number as requested.";

                    _logger.LogInformation("Ticket created successfully: {ReferenceNumber} for {From}", finalTicket.ReferenceNumber, from);
                    return successMessage;
                }

                _memoryStore.SaveDraft(from, updatedDraft);

                if (string.IsNullOrWhiteSpace(responseText))
                {
                    responseText = "👋 Hi there! I'm here to help you create support tickets or track existing ones.\n\n" +
                                 "• To create a new ticket: Just tell me about your issue\n" +
                                 "• To track a ticket: Send me your reference number (e.g., 'JHB-123')";
                }

                return responseText;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing message from {From}", from);
                return "❌ I'm sorry, I encountered an error while processing your request. Please try again in a moment.";
            }
        }

        private string GenerateReference(string location)
        {
            var timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");
            var random = new Random().Next(100, 999);
            var locationCode = location?.ToUpper()?.Replace(" ", "").Substring(0, Math.Min(location.Length, 6)) ?? "LOC";
            return $"{locationCode}-{timestamp}-{random}";
        }

        private string GetPriorityText(PriorityLevelEnum priority)
        {
            return priority switch
            {
                PriorityLevelEnum.Low => "Low (1)",
                PriorityLevelEnum.Medium => "Medium (2)",
                PriorityLevelEnum.High => "High (3)",
                PriorityLevelEnum.Critical => "Critical (4)",
                _ => "Unknown"
            };
        }
    }
}