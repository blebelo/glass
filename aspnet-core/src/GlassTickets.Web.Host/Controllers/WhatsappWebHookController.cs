using GlassTickets.Services.Whatsapp;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace GlassTickets.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TwilioWebhookController : ControllerBase
    {
        private readonly IWhatsAppChatAppService _whatsAppChatService;
        private readonly ITwilioService _twilioService;

        public TwilioWebhookController(
            IWhatsAppChatAppService whatsAppChatService,
            ITwilioService twilioService)
        {
            _whatsAppChatService = whatsAppChatService;
            _twilioService = twilioService;
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

                var responseText = await _whatsAppChatService.HandleIncomingMessageAsync(from, body);
                await _twilioService.SendWhatsAppMessageAsync(from, responseText);
                var twimlResponse = GenerateTwiMLResponse();

                return Content(twimlResponse, "application/xml");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error {ex.Message}");
            }
        }

        [HttpPost("status")]
        public async Task<IActionResult> HandleStatusCallback()
        {
            var form = await Request.ReadFormAsync();
            var messageId = form["MessageSid"].ToString();
            var status = form["MessageStatus"].ToString(); // sent, delivered, read, failed

            return Ok();
        }

        private string GenerateTwiMLResponse()
        {
            return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response></Response>";
        }
    }
}