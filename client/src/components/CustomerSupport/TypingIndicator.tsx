import React from "react";
import { Bot } from "lucide-react";

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex w-full gap-4 p-4 justify-start animate-fade-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-medium">
        <Bot className="w-4 h-4" />
      </div>
      
      <div className="max-w-[80%] p-4 rounded-2xl shadow-soft bg-chat-bot-bg text-chat-bot-fg">
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" />
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: '0.4s' }} />
          </div>
          <span className="text-xs text-muted-foreground ml-2">AI is typing...</span>
        </div>
      </div>
    </div>
  );
};