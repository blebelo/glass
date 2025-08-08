using System;
using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using GlassTickets.Services.Whatsapp.Dto;

namespace GlassTickets.Services.Whatsapp;
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
            model = "gpt-4o-mini",
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
        sb.AppendLine("You are collecting information to create a support ticket.");
        sb.AppendLine("Here is the current ticket info:");
        sb.AppendLine($"Location: {draft.Location ?? "unknown"}");
        sb.AppendLine($"Category: {draft.Category ?? "unknown"}");
        sb.AppendLine($"Description: {draft.Description ?? "unknown"}");
        sb.AppendLine($"CustomerNumber: {draft.CustomerNumber ?? "unknown"}");
        sb.AppendLine($"PriorityLevel: {(draft.PriorityLevel?.ToString() ?? "unknown")}");
        sb.AppendLine($"SendUpdates: {(draft.SendUpdates.HasValue ? draft.SendUpdates.Value.ToString() : "unknown")}");
        sb.AppendLine();
        sb.AppendLine("User says:");
        sb.AppendLine(userMessage);
        sb.AppendLine();
        sb.AppendLine("Please respond with a friendly message to the user and provide the updated ticket information in JSON format like this:");
        sb.AppendLine("{ \"Location\": \"...\", \"Category\": \"...\", \"Description\": \"...\", \"CustomerNumber\": \"...\", \"PriorityLevel\": 1, \"SendUpdates\": true }");
        sb.AppendLine("If you don't have new info, leave fields empty or omit them.");
        return sb.ToString();
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
            IsComplete = false // Will be set later
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
