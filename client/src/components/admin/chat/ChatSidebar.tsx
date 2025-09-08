import { Search, Plus, Settings, Users, MessageCircle } from "lucide-react";
import { Input } from "../../../ui/input";
import { ScrollArea } from "../../../ui/scroll-area";
import { Button } from "../../../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar";
import { Badge } from "@mui/material";

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  avatar?: string;
  isGroup: boolean;
}

interface ChatSidebarProps {
  selectedChatId?: string;
  onChatSelect: (chatId: string) => void;
}

const mockChats: Chat[] = [
  {
    id: "1",
    name: "Alice Johnson",
    lastMessage: "Hey! How's your project going?",
    timestamp: "2m ago",
    unreadCount: 2,
    isOnline: true,
    isGroup: false
  },
  {
    id: "2",
    name: "Dev Team",
    lastMessage: "Sarah: The new feature is ready for testing",
    timestamp: "5m ago",
    unreadCount: 0,
    isOnline: false,
    isGroup: true
  },
  {
    id: "3",
    name: "Bob Wilson",
    lastMessage: "Thanks for the help yesterday!",
    timestamp: "1h ago",
    unreadCount: 0,
    isOnline: false,
    isGroup: false
  },
  {
    id: "4",
    name: "Design Team",
    lastMessage: "Mike: New mockups are in Figma",
    timestamp: "2h ago",
    unreadCount: 1,
    isOnline: false,
    isGroup: true
  }
];

export function ChatSidebar({ selectedChatId, onChatSelect }: ChatSidebarProps) {
  return (
    <div className="w-96 bg-chat-sidebar border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-foreground">Messages</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search conversations..." 
            className="pl-10 bg-chat-input border-border"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {mockChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
                selectedChatId === chat.id ? 'bg-accent' : ''
              }`}
            >
              <div className="relative">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={chat.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {chat.isGroup ? (
                      <Users className="h-6 w-6" />
                    ) : (
                      chat.name.split(' ').map(n => n[0]).join('')
                    )}
                  </AvatarFallback>
                </Avatar>
                {chat.isOnline && !chat.isGroup && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-online-indicator rounded-full border-2 border-chat-sidebar"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-foreground truncate">
                    {chat.name}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {chat.timestamp}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {chat.lastMessage}
                </p>
              </div>
              
              {chat.unreadCount > 0 && (
                <Badge className="bg-primary text-primary-foreground">
                  {chat.unreadCount}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}