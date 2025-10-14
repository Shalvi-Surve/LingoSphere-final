// Simple chatbot service without AWS Lex
export interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  intent?: string;
  confidence?: number;
}

export interface ChatResponse {
  messages: ChatMessage[];
  sessionId: string;
  isComplete: boolean;
}

class SimpleChatbotService {
  private sessionId: string;

  constructor() {
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async sendMessage(userMessage: string, userId?: string): Promise<ChatResponse> {
    try {
      const messages: ChatMessage[] = [];

      // Add user message
      messages.push({
        id: `user_${Date.now()}`,
        text: userMessage,
        isBot: false,
        timestamp: new Date(),
      });

      // Generate bot response based on user input
      const botResponse = this.generateResponse(userMessage);
      
      messages.push({
        id: `bot_${Date.now()}`,
        text: botResponse,
        isBot: true,
        timestamp: new Date(),
        intent: 'general',
        confidence: 0.9,
      });

      return {
        messages,
        sessionId: this.sessionId,
        isComplete: false,
      };
    } catch (error) {
      console.error('Chatbot service error:', error);
      
      const messages: ChatMessage[] = [
        {
          id: `user_${Date.now()}`,
          text: userMessage,
          isBot: false,
          timestamp: new Date(),
        },
        {
          id: `bot_error_${Date.now()}`,
          text: "I'm having trouble connecting right now. Please try again in a moment!",
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

  async sendWelcomeMessage(userId?: string): Promise<ChatMessage> {
    const welcomeMessages = [
      "¡Hola! I'm LingoBot, your multilingual learning assistant. How can I help you today?",
      "Hello! I'm here to help you with your language learning journey. What would you like to know?",
      "Hi there! I'm LingoBot, ready to assist you with any language learning questions. How can I help?",
    ];

    const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];

    return {
      id: `bot_welcome_${Date.now()}`,
      text: randomMessage,
      isBot: true,
      timestamp: new Date(),
      intent: 'greeting',
      confidence: 1.0,
    };
  }

  private generateResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();

    // Language learning responses
    if (message.includes('spanish') || message.includes('español')) {
      return "¡Excelente! Spanish is a beautiful language. I can help you with vocabulary, grammar, or pronunciation. What specific aspect would you like to work on?";
    }

    if (message.includes('french') || message.includes('français')) {
      return "Parfait! French is a wonderful language to learn. I can assist you with French vocabulary, grammar, or conversation practice. What would you like to focus on?";
    }

    if (message.includes('german') || message.includes('deutsch')) {
      return "Ausgezeichnet! German is a fascinating language. I can help you with German grammar, vocabulary, or pronunciation. What specific area interests you?";
    }

    if (message.includes('help') || message.includes('assist')) {
      return "I'm here to help! I can assist you with language learning questions, provide vocabulary explanations, help with grammar, or just chat about your learning progress. What do you need help with?";
    }

    if (message.includes('vocabulary') || message.includes('words')) {
      return "Great! Vocabulary building is essential for language learning. I can help you learn new words, explain meanings, or provide example sentences. What topic or theme would you like to explore?";
    }

    if (message.includes('grammar')) {
      return "Grammar is the foundation of any language! I can explain grammar rules, help with sentence structure, or clarify confusing concepts. What grammar topic would you like to work on?";
    }

    if (message.includes('pronunciation')) {
      return "Pronunciation is key to being understood! I can help you with pronunciation tips, phonetic explanations, or practice exercises. Which language or specific sounds would you like to work on?";
    }

    if (message.includes('practice') || message.includes('exercise')) {
      return "Practice makes perfect! I can help you with conversation practice, provide exercises, or create learning activities. What type of practice would be most helpful for you?";
    }

    if (message.includes('progress') || message.includes('level')) {
      return "Tracking your progress is important for motivation! I can help you set learning goals, track your achievements, or suggest next steps in your language learning journey. What would you like to know about your progress?";
    }

    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! Welcome to LingoSphere! I'm excited to help you on your language learning journey. What language are you interested in learning today?";
    }

    if (message.includes('thank') || message.includes('thanks')) {
      return "You're very welcome! I'm here whenever you need help with your language learning. Feel free to ask me anything!";
    }

    if (message.includes('goodbye') || message.includes('bye')) {
      return "Goodbye! Keep up the great work with your language learning. I'll be here whenever you need assistance. ¡Hasta luego!";
    }

    // Default responses
    const defaultResponses = [
      "That's interesting! I'd love to help you with that. Can you tell me more about what you'd like to learn?",
      "I understand! Language learning can be challenging but also very rewarding. What specific aspect would you like to work on?",
      "Great question! I'm here to support your language learning journey. What language are you currently studying?",
      "I'm here to help! Whether it's vocabulary, grammar, pronunciation, or conversation practice, I can assist you. What would you like to focus on?",
      "That sounds exciting! Learning a new language opens up so many opportunities. What specific help do you need with your studies?",
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  resetSession(): void {
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getSessionId(): string {
    return this.sessionId;
  }
}

// Export singleton instance
export const chatbotService = new SimpleChatbotService();
