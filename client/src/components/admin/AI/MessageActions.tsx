import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Copy, Check } from 'lucide-react';
import { useToast } from '../../../hooks/use-toast';
import { Message } from '../types/Agent';
import { Button } from '../../../ui/button';

interface MessageActionsProps {
  message: Message;
  onRateMessage: (messageId: string, rating: 'like' | 'dislike') => void;
}

export function MessageActions({ message, onRateMessage }: MessageActionsProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast({
        description: 'Message copied to clipboard',
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        description: 'Failed to copy message',
        variant: 'destructive',
        duration: 2000,
      });
    }
  };

  const handleLike = () => {
    const newRating = message.rating === 'like' ? undefined : 'like';
    onRateMessage(message.id, newRating as 'like' | 'dislike');
    
    if (newRating === 'like') {
      toast({
        description: 'Thanks for your feedback!',
        duration: 2000,
      });
    }
  };

  const handleDislike = () => {
    const newRating = message.rating === 'dislike' ? undefined : 'dislike';
    onRateMessage(message.id, newRating as 'like' | 'dislike');
    
    if (newRating === 'dislike') {
      toast({
        description: 'Feedback noted. We\'ll work to improve.',
        duration: 2000,
      });
    }
  };

  // Only show actions for assistant messages
  if (message.role !== 'assistant') return null;

  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="h-6 w-6 p-0 hover:bg-muted"
        title="Copy message"
      >
        {copied ? (
          <Check size={12} className="text-green-500" />
        ) : (
          <Copy size={12} className="text-muted-foreground" />
        )}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        className={`
          h-6 w-6 p-0 hover:bg-green-50 hover:text-green-600
          ${message.rating === 'like' ? 'text-green-600 bg-green-50' : 'text-muted-foreground'}
        `}
        title="Like this response"
      >
        <ThumbsUp size={12} />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDislike}
        className={`
          h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600
          ${message.rating === 'dislike' ? 'text-red-600 bg-red-50' : 'text-muted-foreground'}
        `}
        title="Dislike this response"
      >
        <ThumbsDown size={12} />
      </Button>
    </div>
  );
}