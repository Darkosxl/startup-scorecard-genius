
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  onQuery: (query: string) => void;
  isProcessing?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onQuery, isProcessing = false }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I can help you analyze startup data and create scorecards. Ask me questions about specific sectors, startups, or metrics.'
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || isProcessing) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, newUserMessage]);
    onQuery(input);
    setInput('');
    
    // This would typically be handled by the parent component
    // through a response to the onQuery callback
    const processingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: 'Processing your request...'
    };
    
    setMessages(prev => [...prev, processingMessage]);
  };

  return (
    <Card className="flex flex-col h-full border rounded-lg overflow-hidden">
      <div className="p-4 border-b bg-slate-50 dark:bg-slate-800/50">
        <h3 className="text-lg font-medium">AI Assistant</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Ask me about startups, sectors, or to create scorecards
        </p>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`flex max-w-[80%] ${
                message.role === 'user'
                  ? 'bg-primary text-white rounded-2xl rounded-tr-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl rounded-tl-sm'
              } px-4 py-3 animate-slide-up`}
            >
              <div className="flex">
                <div className="mr-2 mt-1">
                  {message.role === 'user' ? (
                    <User size={16} />
                  ) : (
                    <Bot size={16} />
                  )}
                </div>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about startups or metrics..."
            className="flex-grow"
            disabled={isProcessing}
          />
          <Button type="submit" size="icon" disabled={isProcessing}>
            <Send size={18} />
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ChatInterface;
