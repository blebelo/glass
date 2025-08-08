# WhatsApp AI Support Ticketing System

A comprehensive support ticketing system that integrates WhatsApp Business API with AI-powered chatbot capabilities to automatically create and manage customer support requests.

## Tech Stack

- **Backend**: ASP.NET Core Web API (.NET 8)
- **Frontend**: Next.js 14 with TypeScript
- **Database**: SQL Server with Entity Framework Core
- **AI Integration**: OpenAI GPT API
- **WhatsApp Integration**: WhatsApp Business API
- **Authentication**: JWT Bearer tokens
- **ORM**: Entity Framework Core
- **Validation**: FluentValidation

## Features

### Core Functionality
- **WhatsApp Integration**: Receive messages via WhatsApp Business API webhook
- **AI-Powered Processing**: Automatically categorize and prioritize support requests
- **Ticket Management**: Create, update, assign, and resolve support tickets
- **Multi-language Support**: Handle messages in multiple languages
- **Smart Routing**: Automatically assign tickets to appropriate departments
- **Real-time Updates**: WebSocket integration for live ticket updates

### AI Capabilities
- Message intent classification
- Sentiment analysis
- Auto-categorization (Technical, Billing, General, etc.)
- Priority assessment (Low, Medium, High, Critical)
- Automated responses for common queries
- Language detection and translation

### Dashboard Features
- Ticket overview and statistics
- Agent assignment and workload management
- Customer interaction history
- Performance analytics
- Export capabilities

## Project Structure

```
project-root/
├── backend/
│   ├── src/
│   │   ├── WhatsAppSupport.API/
│   │   ├── WhatsAppSupport.Core/
│   │   ├── WhatsAppSupport.Infrastructure/
│   │   └── WhatsAppSupport.Application/
│   └── tests/
└── frontend/
    ├── components/
    ├── pages/
    ├── hooks/
    ├── services/
    └── types/
```

## Prerequisites

### Backend Requirements
- .NET 8 SDK
- SQL Server (LocalDB for development)
- Visual Studio 2022 or VS Code

### Frontend Requirements
- Node.js 18+ and npm/yarn
- TypeScript 5+

### External Services
- WhatsApp Business API account
- OpenAI API key
- Ngrok (for local webhook testing)

## Installation & Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd whatsapp-ai-support
```

### 2. Backend Setup

#### Environment Configuration
Create `appsettings.Development.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=WhatsAppSupportDb;Trusted_Connection=true;MultipleActiveResultSets=true"
  },
  "WhatsApp": {
    "WebhookToken": "your-webhook-verify-token",
    "AccessToken": "your-whatsapp-access-token",
    "PhoneNumberId": "your-phone-number-id",
    "BusinessAccountId": "your-business-account-id"
  },
  "OpenAI": {
    "ApiKey": "your-openai-api-key",
    "Model": "gpt-3.5-turbo"
  },
  "JWT": {
    "SecretKey": "your-jwt-secret-key",
    "Issuer": "WhatsAppSupport",
    "Audience": "WhatsAppSupport-Client",
    "ExpiryMinutes": 60
  }
}
```

#### Database Setup
```bash
cd backend/src/WhatsAppSupport.API
dotnet ef database update
```

#### Run Backend
```bash
dotnet run
```

### 3. Frontend Setup

#### Environment Configuration
Create `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=https://localhost:5001/api
NEXT_PUBLIC_SIGNALR_HUB_URL=https://localhost:5001/ticketHub
```

#### Install Dependencies & Run
```bash
cd frontend
npm install
npm run dev
```

### 4. WhatsApp Webhook Setup

#### Local Development with Ngrok
```bash
ngrok http 5001
```

Configure webhook URL in WhatsApp Business API:
```
https://your-ngrok-url.ngrok.io/api/webhook/whatsapp
```

## API Endpoints

### Authentication
```http
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh
```

### Tickets
```http
GET    /api/tickets
GET    /api/tickets/{id}
POST   /api/tickets
PUT    /api/tickets/{id}
DELETE /api/tickets/{id}
GET    /api/tickets/stats
```

### WhatsApp Webhook
```http
GET    /api/webhook/whatsapp (verification)
POST   /api/webhook/whatsapp (message handling)
```

### Customers
```http
GET    /api/customers
GET    /api/customers/{id}
POST   /api/customers
PUT    /api/customers/{id}
```

## Database Schema

### Key Tables
- **Tickets**: Support ticket information
- **Customers**: Customer details and WhatsApp info
- **Agents**: Support agents and assignments
- **Messages**: WhatsApp message history
- **Categories**: Ticket categorization
- **Attachments**: File attachments support

## AI Processing Flow

1. **Message Received**: WhatsApp webhook receives customer message
2. **Intent Analysis**: AI determines message intent and sentiment
3. **Category Classification**: Automatically categorizes the issue type
4. **Priority Assessment**: Assigns priority based on content analysis
5. **Ticket Creation**: Creates support ticket with AI-generated summary
6. **Agent Assignment**: Routes to appropriate agent/department
7. **Auto-Response**: Sends acknowledgment message to customer

## WhatsApp Message Types Supported

- Text messages
- Images with OCR processing
- Documents (PDF, Word, etc.)
- Voice messages (with transcription)
- Location sharing
- Contact information

## Deployment

### Backend Deployment (Azure App Service)
```bash
dotnet publish -c Release
```

### Frontend Deployment (Vercel)
```bash
npm run build
vercel deploy --prod
```

### Environment Variables for Production
```env
# Backend
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=<production-db-connection>
WhatsApp__AccessToken=<production-whatsapp-token>
OpenAI__ApiKey=<production-openai-key>

# Frontend
NEXT_PUBLIC_API_BASE_URL=<production-api-url>
```

## Monitoring & Logging

### Application Insights Integration
- Request/response logging
- AI processing metrics
- WhatsApp API call tracking
- Error monitoring and alerts

### Key Metrics
- Ticket creation rate
- Average response time
- AI classification accuracy
- Customer satisfaction scores

## Security Considerations

- JWT token authentication
- WhatsApp webhook signature verification
- API rate limiting
- Input validation and sanitization
- SQL injection prevention
- CORS configuration

## Testing

### Backend Tests
```bash
cd backend
dotnet test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## Troubleshooting

### Common Issues

#### WhatsApp Webhook Not Receiving Messages
- Verify webhook URL is accessible
- Check webhook token configuration
- Ensure HTTPS is enabled
- Validate webhook signature verification

#### AI Processing Errors
- Verify OpenAI API key and quota
- Check AI model availability
- Monitor API rate limits

#### Database Connection Issues
- Verify connection string
- Ensure SQL Server is running
- Check database permissions

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Changelog

### v1.0.0
- Initial release with core functionality
- WhatsApp Business API integration
- AI-powered ticket classification
- Real-time dashboard

## Roadmap

- [ ] Mobile app for agents
- [ ] Integration with popular CRM systems
- [ ] Advanced AI features (emotion detection)
- [ ] Multi-channel support (Telegram, Facebook Messenger)
- [ ] Automated workflow triggers