import { useState } from 'react';
import { History, Trash2, Download, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../ui/dialog';
import { ChatHistory as ChatHistoryType, Agent } from '../types/Agent';
import { Button } from '../../../ui/button';
import { ScrollArea } from '../../../ui/scroll-area';

interface ChatHistoryProps {
  agent: Agent | null;
  histories: ChatHistoryType[];
  currentHistoryId?: string;
  onLoadHistory: (historyId: string) => void;
  onDeleteHistory: (historyId: string) => void;
  onNewChat: () => void;
  onExportHistory: (historyId: string) => void;
}

export function ChatHistory({ 
  agent, 
  histories, 
  currentHistoryId, 
  onLoadHistory, 
  onDeleteHistory, 
  onNewChat,
  onExportHistory 
}: ChatHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  const agentHistories = histories.filter(h => h.agentId === agent?.id);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getHistoryPreview = (history: ChatHistoryType) => {
    const lastMessage = history.messages[history.messages.length - 1];
    if (!lastMessage) return 'Empty conversation';
    
    const content = lastMessage.content;
    return content.length > 50 ? content.substring(0, 50) + '...' : content;
  };

  if (!agent) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-admin-sidebar-fg/70 hover:text-admin-sidebar-fg hover:bg-admin-sidebar-hover"
        >
          <History size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Chat History - {agent.name}</span>
            <Button onClick={onNewChat} size="sm" variant="outline">
              <Plus size={16} className="mr-2" />
              New Chat
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
          {agentHistories.length === 0 ? (
            <div className="text-center py-8">
              <History size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No chat history yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Start a conversation to see it here
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {agentHistories.map((history) => (
                <div
                  key={history.id}
                  className={`
                    p-4 rounded-lg border cursor-pointer transition-colors
                    ${currentHistoryId === history.id 
                      ? 'bg-primary/10 border-primary' 
                      : 'hover:bg-muted border-border'
                    }
                  `}
                  onClick={() => {
                    onLoadHistory(history.id);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {formatDate(history.createdAt)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {history.messages.length} messages
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onExportHistory(history.id);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Download size={12} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteHistory(history.id);
                        }}
                        className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {getHistoryPreview(history)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}