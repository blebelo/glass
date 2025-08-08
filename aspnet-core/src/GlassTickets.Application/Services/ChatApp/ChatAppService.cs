using GlassTickets.Services.Whatsapp.Dto;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace GlassTickets.Services.ChatApp;
public class ChatAppService : IChatAppService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public ChatAppService(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        _apiKey = config["OpenAI:ApiKey"] ?? throw new ArgumentNullException("API key missing");
    }

    public async Task<(string responseText, TicketDraftDto updatedDraft)> ProcessMessageAsync(string userMessage, TicketDraftDto draft)
    {
        var prompt = BuildPrompt(userMessage, draft);

        var requestBody = new
        {
            model = "gpt-3.5-turbo",
            messages = new[]
            {
                new { role = "system", content = "You are a helpful support assistant gathering ticket info." },
                new { role = "user", content = prompt }
            }
        };

        var request = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions");
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _apiKey);
        request.Content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        var openAiResponse = JsonConvert.DeserializeObject<OpenAiResponse>(json);

        var aiReply = openAiResponse?.Choices?[0]?.Message?.Content ?? "";

        var updatedDraft = ParseDraftFromAiReply(aiReply, draft);

        updatedDraft.IsComplete = updatedDraft.IsReadyForSubmission;

        return (aiReply, updatedDraft);
    }

    private string BuildPrompt(string userMessage, TicketDraftDto draft)
    {
        var sb = new StringBuilder();

        sb.AppendLine("You are a helpful municipality AI Support agent for Gauteng province. You have a sweet, friendly, and professional tone.");
        sb.AppendLine("IMPORTANT: You only service Gauteng province. If a user mentions a location outside Gauteng, politely explain you can only help with Gauteng locations.");
        sb.AppendLine();

        sb.AppendLine("Current ticket information collected:");
        sb.AppendLine($"Location: {draft.Location ?? "NOT PROVIDED"}");
        sb.AppendLine($"Category: {draft.Category ?? "NOT PROVIDED"}");
        sb.AppendLine($"Description: {draft.Description ?? "NOT PROVIDED"}");
        sb.AppendLine($"Customer Number: {draft.CustomerNumber ?? "NOT PROVIDED"}");
        sb.AppendLine($"Priority Level: {draft.PriorityLevel?.ToString() ?? "NOT DETERMINED"} (1=Low, 2=Medium, 3=High, 4=Critical)");
        sb.AppendLine($"Send Updates: {(draft.SendUpdates.HasValue ? draft.SendUpdates.Value.ToString() : "NOT ASKED")}");
        sb.AppendLine();

        var missingFields = GetMissingFields(draft);
        if (missingFields.Count > 0)
        {
            sb.AppendLine("MISSING INFORMATION NEEDED:");
            foreach (var field in missingFields)
            {
                sb.AppendLine($"- {field}");
            }
            sb.AppendLine("Conversationally ask for the most important missing information first.");
            sb.AppendLine();
        }

        sb.AppendLine("User says:");
        sb.AppendLine($"\"{userMessage}\"");
        sb.AppendLine();

        sb.AppendLine("INSTRUCTIONS:");
        sb.AppendLine("1. Respond with a warm, friendly message");
        sb.AppendLine("2. If location is outside Gauteng, politely decline and explain your service area");
        sb.AppendLine("3. Extract any new information from the user's message");
        sb.AppendLine("4. If information is still missing, ask for it conversationally (don't overwhelm - ask for 1-2 things at a time)");
        sb.AppendLine("5. Determine priority based on urgency/impact: 1=Low (cosmetic), 2=Medium (affecting work), 3=High (major disruption), 4=Critical (emergency/safety)");
        sb.AppendLine("6. Always end with updated JSON containing ALL information you now have");
        sb.AppendLine();

        sb.AppendLine("JSON FORMAT (include ALL fields, use actual values or leave empty strings for unknowns):");
        sb.AppendLine("{ \"Location\": \"...\", \"Category\": \"...\", \"Description\": \"...\", \"CustomerNumber\": \"...\", \"PriorityLevel\": 1, \"SendUpdates\": true }");

        return sb.ToString();
    }

    private List<string> GetMissingFields(TicketDraftDto draft)
    {
        var missing = new List<string>();

        if (string.IsNullOrWhiteSpace(draft.Location))
            missing.Add("Location (which area/building in Gauteng?)");

        if (string.IsNullOrWhiteSpace(draft.Category))
            missing.Add("Category (IT, Maintenance, Utilities, etc.)");

        if (string.IsNullOrWhiteSpace(draft.Description))
            missing.Add("Detailed description of the issue");

        if (string.IsNullOrWhiteSpace(draft.CustomerNumber))
            missing.Add("Customer/Contact number");

        if (!draft.PriorityLevel.HasValue)
            missing.Add("Priority level assessment needed");

        if (!draft.SendUpdates.HasValue)
            missing.Add("Permission to send SMS/WhatsApp updates");

        return missing;
    }

    private TicketDraftDto ParseDraftFromAiReply(string aiReply, TicketDraftDto oldDraft)
    {
        try
        {
            var json = ExtractJson(aiReply);
            if (string.IsNullOrEmpty(json))
                return oldDraft;

            var updated = JsonConvert.DeserializeObject<TicketDraftDto>(json);

            return MergeDrafts(oldDraft, updated);
        }
        catch
        {
            return oldDraft;
        }
    }

    private TicketDraftDto MergeDrafts(TicketDraftDto oldDraft, TicketDraftDto updated)
    {
        return new TicketDraftDto
        {
            SessionId = oldDraft.SessionId,
            ReferenceNumber = oldDraft.ReferenceNumber,
            Location = string.IsNullOrWhiteSpace(updated.Location) ? oldDraft.Location : updated.Location,
            Category = string.IsNullOrWhiteSpace(updated.Category) ? oldDraft.Category : updated.Category,
            Description = string.IsNullOrWhiteSpace(updated.Description) ? oldDraft.Description : updated.Description,
            CustomerNumber = string.IsNullOrWhiteSpace(updated.CustomerNumber) ? oldDraft.CustomerNumber : updated.CustomerNumber,
            PriorityLevel = updated.PriorityLevel ?? oldDraft.PriorityLevel,
            SendUpdates = updated.SendUpdates ?? oldDraft.SendUpdates,
            IsComplete = false
        };
    }

    private string ExtractJson(string aiReply)
    {
        var jsonMatch = Regex.Match(aiReply, @"```json\s*(\{.*?\})\s*```", RegexOptions.Singleline);
        if (jsonMatch.Success)
            return jsonMatch.Groups[1].Value;

        var braceMatch = Regex.Match(aiReply, @"\{.*\}", RegexOptions.Singleline);
        if (braceMatch.Success)
            return braceMatch.Value;

        return null;
    }

    private class OpenAiResponse
    {
        [JsonProperty("choices")]
        public Choice[] Choices { get; set; }

        public class Choice
        {
            [JsonProperty("message")]
            public Message Message { get; set; }
        }

        public class Message
        {
            [JsonProperty("content")]
            public string Content { get; set; }
        }
    }
}
