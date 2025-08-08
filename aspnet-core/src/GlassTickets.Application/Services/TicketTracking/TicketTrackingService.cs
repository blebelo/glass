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

        /// <summary>
        /// Initializes a new instance of the <see cref="TicketTrackingService"/> class with the specified ticket application service and logger.
        /// </summary>
        public TicketTrackingService(ITicketAppService ticketAppService, ILogger<TicketTrackingService> logger)
        {
            _ticketAppService = ticketAppService;
            _logger = logger;
        }

        /// <summary>
        /// Determines whether the provided message is a ticket tracking request based on keywords or reference number pattern.
        /// </summary>
        /// <param name="message">The input message to evaluate.</param>
        /// <returns>True if the message is likely a ticket tracking request; otherwise, false.</returns>
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

        /// <summary>
        /// Extracts a ticket reference number from the provided message, normalizing it to uppercase if found.
        /// </summary>
        /// <param name="message">The input string potentially containing a ticket reference number.</param>
        /// <returns>The extracted and uppercased ticket reference number if found; otherwise, null.</returns>
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

        /// <summary>
        /// Asynchronously retrieves and formats the status of a ticket by its reference number.
        /// </summary>
        /// <param name="referenceNumber">The reference number of the ticket to look up.</param>
        /// <returns>
        /// A formatted string containing the ticket's status, priority, location, category, description, creation and update timestamps, and contact information if available.
        /// Returns an error message if the reference number is invalid, the ticket is not found, or an exception occurs.
        /// </returns>
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

        /// <summary>
        /// Returns an emoji representing the specified ticket status.
        /// </summary>
        /// <param name="status">The status of the ticket.</param>
        /// <returns>An emoji corresponding to the ticket status, or a question mark if the status is unrecognized.</returns>
        private string GetStatusEmoji(Domain.Tickets.StatusEnum status)
        {
            return status switch
            {
                Domain.Tickets.StatusEnum.Open => "🔴",
                Domain.Tickets.StatusEnum.Assigned => "🟡",
                Domain.Tickets.StatusEnum.Closed => "⚫",
                _ => "❓"
            };
        }

        /// <summary>
        /// Returns a descriptive text label for the specified ticket priority level, including its numeric value.
        /// </summary>
        /// <param name="priority">The priority level enum value.</param>
        /// <returns>A string representing the priority level and its corresponding number, or "Unknown" if the value is unrecognized.</returns>
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

        /// <summary>
        /// Returns a user-friendly message corresponding to the specified ticket status.
        /// </summary>
        /// <param name="status">The status of the ticket.</param>
        /// <returns>A status-specific message string, or an empty string if the status is unrecognized.</returns>
        private string GetStatusMessage(Domain.Tickets.StatusEnum status)
        {
            return status switch
            {
                Domain.Tickets.StatusEnum.Open => "\n\n💬 Your ticket has been received and is waiting to be assigned to a technician.",
                Domain.Tickets.StatusEnum.Assigned=> "\n\n🔧 Great news! A someone is currently working on your issue.",
                Domain.Tickets.StatusEnum.Closed => "\n\n📁 This ticket has been completed and closed. If you're still experiencing problems, please let us know.",
                _ => ""
            };
        }
    }
}