using GlassTickets.Services.Tickets;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace GlassTickets.Services.TicketTracking
{

    public class TicketTrackingService : ITicketTrackingService
    {
        private readonly ITicketAppService _ticketAppService;
        private readonly ILogger<TicketTrackingService> _logger;

        public TicketTrackingService(ITicketAppService ticketAppService, ILogger<TicketTrackingService> logger)
        {
            _ticketAppService = ticketAppService;
            _logger = logger;
        }

        public bool IsTrackingRequest(string message)
        {
            if (string.IsNullOrWhiteSpace(message))
                return false;

            var lowerMessage = message.ToLower();

            var trackingKeywords = new[] { "track", "status", "check", "reference", "ticket", "ref", "update" };

            foreach (var keyword in trackingKeywords)
            {
                if (lowerMessage.Contains(keyword))
                    return true;
            }

            if (System.Text.RegularExpressions.Regex.IsMatch(message, @"^[A-Za-z]{2,}-\d{3,}$"))
                return true;

            return false;
        }

        public string ExtractReferenceNumber(string message)
        {
            if (string.IsNullOrWhiteSpace(message))
                return null;

            var match = System.Text.RegularExpressions.Regex.Match(message, @"([A-Za-z]{2,}-\d{3,})");

            if (match.Success)
                return match.Groups[1].Value.ToUpper();

            var cleanMessage = message.Trim().ToUpper();
            if (System.Text.RegularExpressions.Regex.IsMatch(cleanMessage, @"^[A-Za-z]{2,}-\d{3,}$"))
                return cleanMessage;

            return null;
        }

        public async Task<string> GetTicketStatusAsync(string referenceNumber)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(referenceNumber))
                    return "❌ Please provide a valid reference number to track your ticket.";

                var ticket = await _ticketAppService.GetByReferenceNumberAsync(referenceNumber);

                if (ticket == null)
                {
                    return $"❌ Sorry, I couldn't find a ticket with reference number: {referenceNumber}\n\n" +
                           "Please double-check the reference number and try again.";
                }

                var statusEmoji = GetStatusEmoji(ticket.Status);
                var priorityText = GetPriorityText(ticket.PriorityLevel);

                var response = $"🎫 **Ticket Status Update**\n\n" +
                              $"📋 Reference: {ticket.ReferenceNumber}\n" +
                              $"{statusEmoji} Status: {ticket.Status}\n" +
                              $"⚡ Priority: {priorityText}\n" +
                              $"📍 Location: {ticket.Location}\n" +
                              $"🏷️ Category: {ticket.Category}\n" +
                              $"📝 Description: {ticket.Description}\n" +
                              $"📅 Created: {ticket.DateCreated:dd/MM/yyyy HH:mm}\n" +
                              $"🔄 Last Updated: {ticket.LastUpdated:dd/MM/yyyy HH:mm}";

                if (!string.IsNullOrWhiteSpace(ticket.CustomerNumber))
                {
                    response += $"\n📞 Contact: {ticket.CustomerNumber}";
                }
                response += GetStatusMessage(ticket.Status);

                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving ticket status for reference: {ReferenceNumber}", referenceNumber);
                return "❌ Sorry, I encountered an error while retrieving your ticket information. Please try again later.";
            }
        }

        private string GetStatusEmoji(Domain.Tickets.StatusEnum status)
        {
            return status switch
            {
                Domain.Tickets.StatusEnum.Open => "🔴",
                Domain.Tickets.StatusEnum.InProgress => "🟡",
                Domain.Tickets.StatusEnum.Resolved => "🟢",
                Domain.Tickets.StatusEnum.Closed => "⚫",
                _ => "❓"
            };
        }

        private string GetPriorityText(Domain.Tickets.PriorityLevelEnum priority)
        {
            return priority switch
            {
                Domain.Tickets.PriorityLevelEnum.Low => "Low (1)",
                Domain.Tickets.PriorityLevelEnum.Medium => "Medium (2)",
                Domain.Tickets.PriorityLevelEnum.High => "High (3)",
                Domain.Tickets.PriorityLevelEnum.Critical => "Critical (4)",
                _ => "Unknown"
            };
        }

        private string GetStatusMessage(Domain.Tickets.StatusEnum status)
        {
            return status switch
            {
                Domain.Tickets.StatusEnum.Open => "\n\n💬 Your ticket has been received and is waiting to be assigned to a technician.",
                Domain.Tickets.StatusEnum.InProgress => "\n\n🔧 Great news! A technician is currently working on your issue.",
                Domain.Tickets.StatusEnum.Resolved => "\n\n✅ Your issue has been resolved! If you're still experiencing problems, please let us know.",
                Domain.Tickets.StatusEnum.Closed => "\n\n📁 This ticket has been completed and closed.",
                _ => ""
            };
        }
    }
}