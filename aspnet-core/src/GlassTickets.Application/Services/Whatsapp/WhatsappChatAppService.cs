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

            _logger.LogInformation("WhatsappChatAppService created with dependencies injected");
        }

        public async Task<string> HandleIncomingMessageAsync(string from, string message)
        {
            _logger.LogInformation("HandleIncomingMessageAsync called with from='{From}', message='{Message}'", from, message);

            try
            {
                if (string.IsNullOrWhiteSpace(from) || string.IsNullOrWhiteSpace(message))
                {
                    _logger.LogWarning("Invalid message received: 'from' or 'message' is null/empty");
                    return "❌ Invalid message received.";
                }

                if (_trackingService.IsTrackingRequest(message))
                {
                    _logger.LogInformation("Message identified as tracking request: {Message}", message);

                    var referenceNumber = _trackingService.ExtractReferenceNumber(message);
                    _logger.LogInformation("Extracted reference number: {ReferenceNumber}", referenceNumber);

                    if (string.IsNullOrWhiteSpace(referenceNumber))
                    {
                        _logger.LogWarning("Reference number missing in tracking request");
                        return "🔍 **Track Your Ticket**\n\n" +
                               "To track your ticket, please provide your reference number.\n" +
                               "Example: JHB-123 or SANDTON-456\n\n" +
                               "You can also say: 'track JHB-123' or 'status JHB-123'";
                    }

                    var status = await _trackingService.GetTicketStatusAsync(referenceNumber);
                    _logger.LogInformation("Returning ticket status for reference: {ReferenceNumber}", referenceNumber);
                    return status;
                }

                var draft = _memoryStore.GetDraft(from);
                _logger.LogInformation("Loaded draft from memory store for {From}: {@Draft}", from, draft);

                if (draft == null)
                {
                    draft = new TicketDraftDto { SessionId = from };
                    _logger.LogInformation("Created new draft for {From}", from);
                }

                var (responseText, updatedDraft) = await _chatAppService.ProcessMessageAsync(message, draft);
                _logger.LogInformation("Chat service processed message. ResponseText: {ResponseText}, UpdatedDraft: {@UpdatedDraft}", responseText, updatedDraft);

                if (updatedDraft.IsComplete)
                {
                    _logger.LogInformation("Draft is complete, creating ticket");

                    var finalTicket = new TicketDto
                    {
                        ReferenceNumber = updatedDraft.ReferenceNumber ?? GenerateReference(updatedDraft.Location),
                        PriorityLevel = updatedDraft.PriorityLevel,
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
                    _logger.LogInformation("Ticket created: {@FinalTicket}", finalTicket);

                    _memoryStore.ClearDraft(from);
                    _logger.LogInformation("Cleared draft for {From}", from);

                    var successMessage = $"✅ **Ticket Created Successfully!**\n\n" +
                                       $"📋 Reference Number: **{finalTicket.ReferenceNumber}**\n" +
                                       $"📍 Location: {finalTicket.Location}\n" +
                                       $"🏷️ Category: {finalTicket.Category}\n" +
                                       $"⚡ Priority: {GetPriorityText(finalTicket.PriorityLevel)}\n\n" +
                                       $"💡 **Save this reference number!** You can use it to track your ticket anytime by sending: 'track {finalTicket.ReferenceNumber}'\n\n" +
                                       $"📧 You will receive updates on this number as requested.";

                    _logger.LogInformation("Returning success message to user {From}", from);
                    return successMessage;
                }

                _logger.LogInformation("Draft not complete, saving updated draft for {From}", from);
                _memoryStore.SaveDraft(from, updatedDraft);

                if (string.IsNullOrWhiteSpace(responseText))
                {
                    responseText = "👋 Hi there! I'm here to help you create support tickets or track existing ones.\n\n" +
                                 "• To create a new ticket: Just tell me about your issue\n" +
                                 "• To track a ticket: Send me your reference number (e.g., 'JHB-123')";
                }

                _logger.LogInformation("Returning responseText to user {From}: {ResponseText}", from, responseText);
                return responseText;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing message from {From}", from);
                return $"❌ I'm sorry, I encountered an error while processing your request. Please try again in a moment.{ex}";
            }
        }

        private string GenerateReference(string location)
        {
            var timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");
            var random = new Random().Next(100, 999);
            var locationCode = location?.ToUpper()?.Replace(" ", "").Substring(0, Math.Min(location.Length, 6)) ?? "LOC";

            var reference = $"{locationCode}-{timestamp}-{random}";
            _logger.LogInformation("Generated ticket reference: {Reference}", reference);

            return reference;
        }

        private string GetPriorityText(PriorityLevelEnum priority)
        {
            var priorityText = priority switch
            {
                PriorityLevelEnum.Low => "Low (1)",
                PriorityLevelEnum.Medium => "Medium (2)",
                PriorityLevelEnum.High => "High (3)",
                PriorityLevelEnum.Critical => "Critical (4)",
                _ => "Unknown"
            };

            _logger.LogInformation("Converted priority enum {Priority} to text '{PriorityText}'", priority, priorityText);

            return priorityText;
        }
    }
}
