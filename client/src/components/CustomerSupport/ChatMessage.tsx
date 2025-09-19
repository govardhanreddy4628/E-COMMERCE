import React, { useState } from "react";
import { Copy, Check, User, Bot } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../../ui/button";


interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
  };
  isStreaming?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isStreaming = false 
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "flex w-full gap-4 p-4 transition-all duration-300 animate-fade-in",
        message.isUser ? "justify-end" : "justify-start"
      )}
    >
      {!message.isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-medium">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[80%] p-4 rounded-2xl shadow-soft transition-all duration-300 hover:shadow-medium",
          message.isUser
            ? "bg-chat-user-bg text-chat-user-fg ml-auto"
            : "bg-chat-bot-bg text-chat-bot-fg"
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className={cn(
              "text-sm leading-relaxed whitespace-pre-wrap",
              isStreaming && "animate-typing"
            )}>
              {message.content}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs opacity-60">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
              {!message.isUser && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="h-6 w-6 p-0 opacity-60 hover:opacity-100 transition-opacity"
                >
                  {copied ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {message.isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center shadow-medium">
          <User className="w-4 h-4 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
};