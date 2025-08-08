using Abp.UI;
using GlassTickets.Domain.Tickets;
using GlassTickets.Services.Tickets;
using GlassTickets.Services.Tickets.Dto;
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
    private readonly ITicketAppService _ticketAppService;

    private readonly HashSet<PriorityLevelEnum> validPriorities = new HashSet<PriorityLevelEnum>
    {
        PriorityLevelEnum.Critical,
        PriorityLevelEnum.High,
        PriorityLevelEnum.Medium,
        PriorityLevelEnum.Low
    };

    public ChatAppService(HttpClient httpClient, IConfiguration configuration, ITicketAppService ticketAppService)
    {
        _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        _apiKey = configuration["Gemini:ApiKey"] ?? throw new ArgumentNullException("Gemini API key not configured");
        _ticketAppService = ticketAppService ?? throw new ArgumentNullException(nameof(ticketAppService));
    }

    public async Task<(string responseText, TicketDraftDto updatedDraft)> ProcessMessageAsync(string userMessage, TicketDraftDto draft)
    {
        var prompt = BuildPrompt(userMessage, draft);

        var requestBody = new
        {
            contents = new[]
            {
                new
                {
                    parts = new[]
                    {
                        new { text = prompt }
                    }
                }
            },
            generationConfig = new
            {
                temperature = 0.7,
                topK = 40,
                topP = 0.95,
                maxOutputTokens = 1024
            },
            safetySettings = new[]
            {
                new
                {
                    category = "HARM_CATEGORY_HARASSMENT",
                    threshold = "BLOCK_MEDIUM_AND_ABOVE"
                },
                new
                {
                    category = "HARM_CATEGORY_HATE_SPEECH",
                    threshold = "BLOCK_MEDIUM_AND_ABOVE"
                },
                new
                {
                    category = "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold = "BLOCK_MEDIUM_AND_ABOVE"
                },
                new
                {
                    category = "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold = "BLOCK_MEDIUM_AND_ABOVE"
                }
            }
        };

        var request = new HttpRequestMessage(HttpMethod.Post, $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={_apiKey}");
        request.Content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");

        try
        {
            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();

            var geminiResponse = JsonConvert.DeserializeObject<GeminiResponse>(json);

            var aiReply = geminiResponse?.Candidates?[0]?.Content?.Parts?[0]?.Text ?? "";

            var cleanResponseText = CleanResponseForUser(aiReply);

            var updatedDraft = ParseDraftFromAiReply(aiReply, draft);

            updatedDraft.IsComplete = updatedDraft.IsReadyForSubmission;

            // Generate Reference Number if missing or empty
            if (string.IsNullOrWhiteSpace(updatedDraft.ReferenceNumber))
            {
                updatedDraft.ReferenceNumber = GenerateReference(updatedDraft.Location);
            }

            if (updatedDraft.IsComplete)
            {
                await _ticketAppService.CreateAsync(new TicketDto
                {
                    ReferenceNumber = updatedDraft.ReferenceNumber,
                    Location = updatedDraft.Location,
                    Category = updatedDraft.Category,
                    Description = updatedDraft.Description,
                    CustomerNumber = updatedDraft.CustomerNumber, // Fixed: Use CustomerNumber (not SessionId)
                    PriorityLevel = validPriorities.Contains(updatedDraft.PriorityLevel) ? updatedDraft.PriorityLevel : draft.PriorityLevel,
                    SendUpdates = updatedDraft.SendUpdates ?? draft.SendUpdates ?? false,
                    Status = StatusEnum.Open
                });
            }

            return (cleanResponseText, updatedDraft);
        }
        catch (Exception ex)
        {
            throw new UserFriendlyException("Error calling Gemini API", ex);
        }
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

        string priorityDisplay = validPriorities.Contains(draft.PriorityLevel)
            ? draft.PriorityLevel.ToString()
            : "NOT DETERMINED";
        sb.AppendLine($"Priority Level: {priorityDisplay} (1=Low, 2=Medium, 3=High, 4=Critical)");

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

        if (!validPriorities.Contains(draft.PriorityLevel))
            missing.Add("Priority level assessment needed");

        if (!draft.SendUpdates.HasValue)
            missing.Add("Permission to send SMS/WhatsApp updates");

        return missing;
    }

    private string GetCategoryDescription(string category)
    {
        if (string.IsNullOrWhiteSpace(category)) return "unknown";
        return category.ToLower() switch
        {
            "water" => "water/plumbing issue",
            "electricity" or "power" => "electricity/power issue",
            "roads" => "road/infrastructure issue",
            "waste" => "waste/garbage issue",
            "housing" => "housing issue",
            "maintenance" => "general maintenance",
            _ => category
        };
    }

    private string GetPriorityDescription(PriorityLevelEnum priority)
    {
        return priority switch
        {
            PriorityLevelEnum.Critical => "Critical (emergency)",
            PriorityLevelEnum.High => "High (urgent)",
            PriorityLevelEnum.Medium => "Medium (soon)",
            PriorityLevelEnum.Low => "Low (when possible)",
            _ => "unknown"
        };
    }

    private bool IsNewConversation(TicketDraftDto draft)
    {
        return string.IsNullOrWhiteSpace(draft.Location) &&
               string.IsNullOrWhiteSpace(draft.Description) &&
               string.IsNullOrWhiteSpace(draft.Category);
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
            ReferenceNumber = string.IsNullOrWhiteSpace(updated.ReferenceNumber) ? oldDraft.ReferenceNumber : updated.ReferenceNumber,
            Location = string.IsNullOrWhiteSpace(updated.Location) ? oldDraft.Location : updated.Location,
            Category = string.IsNullOrWhiteSpace(updated.Category) ? oldDraft.Category : updated.Category,
            Description = string.IsNullOrWhiteSpace(updated.Description) ? oldDraft.Description : updated.Description,
            CustomerNumber = string.IsNullOrWhiteSpace(updated.CustomerNumber) ? oldDraft.CustomerNumber : updated.CustomerNumber,
            PriorityLevel = validPriorities.Contains(updated.PriorityLevel) ? updated.PriorityLevel : oldDraft.PriorityLevel,
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

    private string GenerateReference(string location)
    {
        var timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");
        var random = new Random().Next(100, 999);
        var locationCode = "LOC";

        if (!string.IsNullOrWhiteSpace(location))
        {
            var cleanLocation = Regex.Replace(location.ToUpper(), @"\s+", "");
            locationCode = cleanLocation.Length >= 6 ? cleanLocation.Substring(0, 6) : cleanLocation;
        }

        return $"{locationCode}-{timestamp}-{random}";
    }

    private string CleanResponseForUser(string aiReply)
    {
        var jsonPattern = @"```json.*?```";
        var cleanResponse = Regex.Replace(aiReply, jsonPattern, "", RegexOptions.Singleline | RegexOptions.IgnoreCase);

        var bracePattern = @"\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}";
        cleanResponse = Regex.Replace(cleanResponse, bracePattern, "");

        return cleanResponse.Trim();
    }

    private class GeminiResponse
    {
        [JsonProperty("candidates")]
        public Candidate[] Candidates { get; set; }

        public class Candidate
        {
            [JsonProperty("content")]
            public Content Content { get; set; }

            [JsonProperty("finishReason")]
            public string FinishReason { get; set; }

            [JsonProperty("index")]
            public int Index { get; set; }
        }

        public class Content
        {
            [JsonProperty("parts")]
            public Part[] Parts { get; set; }

            [JsonProperty("role")]
            public string Role { get; set; }
        }

        public class Part
        {
            [JsonProperty("text")]
            public string Text { get; set; }
        }
    }
}
