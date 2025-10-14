import { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// import { chatbotService, ChatMessage } from '@/services/chatbotService.simple';
import { chatbotService, ChatMessage } from '@/services/chatbotService.local';
import { useAuth } from '@/contexts/AuthContext.simple';
import { toast } from 'sonner';

const ChatbotWidget = () => {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize chatbot with welcome message when opened
  useEffect(() => {
    if (isOpen && !isInitialized) {
      initializeChatbot();
    }
  }, [isOpen, isInitialized]);

  const initializeChatbot = async () => {
    try {
      setIsLoading(true);
      const welcomeMessage = await chatbotService.sendWelcomeMessage(user?.id);
      setMessages([welcomeMessage]);
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize chatbot:', error);
      const fallbackMessage: ChatMessage = {
        id: `bot_welcome_${Date.now()}`,
        text: "¡Hola! I'm LingoBot, your multilingual learning assistant. How can I help you today?",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages([fallbackMessage]);
      setIsInitialized(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    try {
      const response = await chatbotService.sendMessage(userMessage, user?.id);
      setMessages(prev => [...prev, ...response.messages]);

      if (response.isComplete) {
        chatbotService.resetSession();
        setIsInitialized(false);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message. Please try again.');
      const errorMessage: ChatMessage = {
        id: `bot_error_${Date.now()}`,
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset chatbot state shortly after closing
    setTimeout(() => {
      setMessages([]);
      setIsInitialized(false);
      chatbotService.resetSession();
    }, 300);
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-20 right-6 w-80 h-96 z-50 shadow-2xl animate-in slide-in-from-bottom-5">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-t-lg">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">LingoBot</h3>
                  <p className="text-xs opacity-90">Multilingual Assistant</p>
                </div>
                {isAuthenticated && (
                  <Badge variant="secondary" className="text-xs">
                    {user?.name}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-primary-foreground hover:bg-white/20"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isLoading && messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Connecting to LingoBot...</span>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                    <div className={`flex items-start space-x-2 max-w-[80%] ${msg.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          msg.isBot ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        {msg.isBot ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      </div>
                      <div
                        className={`p-3 rounded-2xl ${
                          msg.isBot ? 'bg-muted text-foreground' : 'bg-primary text-primary-foreground'
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        {msg.intent && msg.confidence && (
                          <div className="mt-1 text-xs opacity-70">
                            Intent: {msg.intent} ({Math.round(msg.confidence * 100)}%)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isLoading && messages.length > 0 && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2 p-3 bg-muted rounded-2xl">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">LingoBot is typing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything in any language..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  disabled={isLoading || !message.trim()}
                  className="bg-primary hover:bg-primary-dark"
                  aria-label="Send message"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
              <div className="mt-2 text-xs text-muted-foreground text-center">
                Press Enter to send • Shift+Enter for new line
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Chat Toggle Button — pulses gently every 10s */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 z-50 chatbot-pulse-10"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </Button>
    </>
  );
};

export default ChatbotWidget;
