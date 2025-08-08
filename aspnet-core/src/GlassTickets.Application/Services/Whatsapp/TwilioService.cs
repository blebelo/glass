using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace GlassTickets.Services.Whatsapp
{

    public class TwilioService : ITwilioService
    {
        private readonly IConfiguration _config;

        public TwilioService(IConfiguration config)
        {
            _config = config;

            var accountSid = _config["Twilio:AccountSid"];
            var authToken = _config["Twilio:AuthToken"];
            TwilioClient.Init(accountSid, authToken);
        }

        public async Task SendWhatsAppMessageAsync(string to, string message)
        {
            try
            {
                var twilioWhatsAppNumber = _config["Twilio:WhatsAppNumber"];

                var messageResource = await MessageResource.CreateAsync(
                    body: message,
                    from: new PhoneNumber(twilioWhatsAppNumber),
                    to: new PhoneNumber(to)
                );

            }
            catch (System.Exception ex)
            {
                throw new SystemException();
            }
        }
    }
}