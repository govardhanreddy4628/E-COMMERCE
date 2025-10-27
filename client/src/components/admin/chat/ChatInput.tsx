import { Smile, Paperclip, Mic, Send } from "lucide-react";
import { useState } from "react";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { useDispatch } from "react-redux";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  return (
    <div className="p-4 border-t border-border bg-chat-input">
      <div className="flex items-end gap-3">
        {/* Attachment button */}
        <Button variant="ghost" size="sm" disabled={disabled} onClick={handleFileOpen}>
          <Paperclip className="h-4 w-4" />
        </Button>
        
        {/* Message input */}
        <div className="flex-1 relative">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            className="pr-10 bg-background border-border resize-none"
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            disabled={disabled}
          >
            <Smile className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Voice/Send button */}
        {message.trim() ? (
          <Button 
            onClick={handleSend}
            disabled={disabled}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="ghost" size="sm" disabled={disabled}>
            <Mic className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Typing indicator */}
      <div className="mt-2 h-4">
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-typing-indicator rounded-full animate-bounce"></div>
            <div className="w-1 h-1 bg-typing-indicator rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1 h-1 bg-typing-indicator rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-xs text-muted-foreground ml-2">Alice is typing...</span>
        </div>
      </div>
    </div>
  );
}