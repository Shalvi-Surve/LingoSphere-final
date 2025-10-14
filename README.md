<<<<<<< HEAD
# LingoSphere - Language Learning Platform

A modern, gamified language learning platform built with React, TypeScript, and AWS services.

## Features

- **Multi-language Support**: Learn Spanish, French, Mandarin, German and more
- **Gamified Learning**: Earn XP, maintain streaks, and unlock badges
- **Progress Tracking**: Monitor your learning with detailed analytics
- **AI Assistant**: Get help from our multilingual AI chatbot
- **User Authentication**: Secure login with AWS Cognito
- **Admin Dashboard**: Manage users and lessons (admin only)
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS, Vite
- **UI Components**: Radix UI, shadcn/ui
- **Authentication**: AWS Cognito
- **Database**: AWS DynamoDB
- **AI Chatbot**: AWS Lex
- **Backend**: AWS Lambda, API Gateway
- **State Management**: React Context

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- AWS Account with appropriate permissions

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lingo-sphere
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure AWS services (Cognito, DynamoDB, Lex) and update environment variables.

5. Start the development server:
```bash
npm run dev
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
VITE_AWS_REGION=your-aws-region
VITE_COGNITO_USER_POOL_ID=your-cognito-user-pool-id
VITE_COGNITO_CLIENT_ID=your-cognito-client-id
VITE_API_GATEWAY_URL=your-api-gateway-url
VITE_LEX_BOT_ID=your-lex-bot-id
VITE_LEX_BOT_ALIAS=your-lex-bot-alias
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Navigation.tsx  # Main navigation
│   └── ChatbotWidget.tsx # AI chatbot widget
├── pages/              # Page components
│   ├── LandingPage.tsx
│   ├── CoursesPage.tsx
│   ├── LessonPage.tsx
│   ├── ProfilePage.tsx
│   └── AdminPage.tsx
├── contexts/           # React contexts
│   ├── AuthContext.tsx
│   └── ProgressContext.tsx
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── services/           # AWS service integrations
└── types/              # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
=======
# LingoSphere
>>>>>>> 16f30ccaf5055a6ea0ef865ebd71886070d157af
