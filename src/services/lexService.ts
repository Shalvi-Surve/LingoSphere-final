import { LexRuntimeV2Client, RecognizeTextCommand } from '@aws-sdk/client-lex-runtime-v2';

// AWS Lex Configuration
const lexClient = new LexRuntimeV2Client({
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
});

const BOT_ID = import.meta.env.VITE_LEX_BOT_ID;
const BOT_ALIAS_ID = import.meta.env.VITE_LEX_BOT_ALIAS || 'TSTALIASID';
const LOCALE_ID = 'en_US';

// Types
export interface LexMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  intent?: string;
  confidence?: number;
  slots?: Record<string, any>;
}

export interface LexResponse {
  messages: LexMessage[];
  sessionId: string;
  isComplete: boolean;
}

class LexService {
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async sendMessage(userMessage: string, userId?: string): Promise<LexResponse> {
    try {
      const command = new RecognizeTextCommand({
        botId: BOT_ID,
        botAliasId: BOT_ALIAS_ID,
        localeId: LOCALE_ID,
        sessionId: this.sessionId,
        text: userMessage,
        sessionState: {
          sessionAttributes: {
            userId: userId || 'anonymous',
            platform: 'web',
            timestamp: new Date().toISOString(),
          },
        },
      });

      const response = await lexClient.send(command);

      const messages: LexMessage[] = [];

      // Add user message
      messages.push({
        id: `user_${Date.now()}`,
        text: userMessage,
        isBot: false,
        timestamp: new Date(),
      });

      // Add bot response
      if (response.messages && response.messages.length > 0) {
        response.messages.forEach((message, index) => {
          if (message.content) {
            messages.push({
              id: `bot_${Date.now()}_${index}`,
              text: message.content,
              isBot: true,
              timestamp: new Date(),
              intent: response.interpretations?.[0]?.intent?.name,
              confidence: response.interpretations?.[0]?.nluConfidence?.score,
              slots: response.interpretations?.[0]?.intent?.slots,
            });
          }
        });
      } else {
        // Fallback response if no messages from Lex
        messages.push({
          id: `bot_${Date.now()}`,
          text: "I'm here to help you with your language learning journey! How can I assist you today?",
          isBot: true,
          timestamp: new Date(),
        });
      }

      return {
        messages,
        sessionId: this.sessionId,
        isComplete: response.sessionState?.dialogAction?.type === 'Close',
      };
    } catch (error) {
      console.error('Lex service error:', error);
      
      // Return error response
      const messages: LexMessage[] = [
        {
          id: `user_${Date.now()}`,
          text: userMessage,
          isBot: false,
          timestamp: new Date(),
        },
        {
          id: `bot_error_${Date.now()}`,
          text: "I'm having trouble connecting right now. Please try again in a moment, or contact support if the issue persists.",
          isBot: true,
          timestamp: new Date(),
        },
      ];

      return {
        messages,
        sessionId: this.sessionId,
        isComplete: false,
      };
    }
  }

  async sendWelcomeMessage(userId?: string): Promise<LexMessage> {
    try {
      const command = new RecognizeTextCommand({
        botId: BOT_ID,
        botAliasId: BOT_ALIAS_ID,
        localeId: LOCALE_ID,
        sessionId: this.sessionId,
        text: "Hello",
        sessionState: {
          sessionAttributes: {
            userId: userId || 'anonymous',
            platform: 'web',
            timestamp: new Date().toISOString(),
          },
        },
      });

      const response = await lexClient.send(command);

      if (response.messages && response.messages.length > 0) {
        const message = response.messages[0];
        return {
          id: `bot_welcome_${Date.now()}`,
          text: message.content || "¡Hola! I'm LingoBot, your multilingual learning assistant. How can I help you today?",
          isBot: true,
          timestamp: new Date(),
          intent: response.interpretations?.[0]?.intent?.name,
          confidence: response.interpretations?.[0]?.nluConfidence?.score,
        };
      }

      // Fallback welcome message
      return {
        id: `bot_welcome_${Date.now()}`,
        text: "¡Hola! I'm LingoBot, your multilingual learning assistant. How can I help you today?",
        isBot: true,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Welcome message error:', error);
      
      return {
        id: `bot_welcome_${Date.now()}`,
        text: "¡Hola! I'm LingoBot, your multilingual learning assistant. How can I help you today?",
        isBot: true,
        timestamp: new Date(),
      };
    }
  }

  resetSession(): void {
    this.sessionId = this.generateSessionId();
  }

  getSessionId(): string {
    return this.sessionId;
  }
}

// Export singleton instance
export const lexService = new LexService();
