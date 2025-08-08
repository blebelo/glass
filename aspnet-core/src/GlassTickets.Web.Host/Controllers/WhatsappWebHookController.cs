using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using GlassTickets.Services.Whatsapp;
using System.Text;
using Microsoft.Extensions.Logging;
using System;

namespace GlassTickets.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TwilioWebhookController : ControllerBase
    {
        private readonly IWhatsAppChatAppService _whatsAppChatService;
        private readonly ITwilioService _twilioService;
        private readonly ILogger<TwilioWebhookController> _logger;

        public TwilioWebhookController(
            IWhatsAppChatAppService whatsAppChatService,
            ITwilioService twilioService,
            ILogger<TwilioWebhookController> logger)
        {
            _whatsAppChatService = whatsAppChatService;
            _twilioService = twilioService;
            _logger = logger;
        }

        [HttpPost("whatsapp")]
        public async Task<IActionResult> HandleWhatsAppMessage()
        {
            try
            {
                var form = await Request.ReadFormAsync();

                var from = form["From"].ToString();
                var body = form["Body"].ToString();
                var messageId = form["MessageSid"].ToString();

                _logger.LogInformation($"Received WhatsApp message from {from}: {body}");

                var responseText = await _whatsAppChatService.HandleIncomingMessageAsync(from, body);
                await _twilioService.SendWhatsAppMessageAsync(from, responseText);
                var twimlResponse = GenerateTwiMLResponse();

                return Content(twimlResponse, "application/xml");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing WhatsApp webhook");
                return StatusCode(500, "Internal server error");
            }
        }

        private string GenerateTwiMLResponse()
        {
            // Return empty TwiML response - we're handling replies programmatically
            return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response></Response>";
        }
    }
}