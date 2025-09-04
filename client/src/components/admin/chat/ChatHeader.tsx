
import { Phone, Video, MoreVertical, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar";
import { Button } from "../../../ui/button";

interface ChatHeaderProps {
  chatName: string;
  isOnline?: boolean;
  isGroup?: boolean;
  memberCount?: number;
  avatar?: string;
}

export function ChatHeader({ chatName, isOnline, isGroup, memberCount, avatar }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-card">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatar} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {isGroup ? (
                <Users className="h-5 w-5" />
              ) : (
                chatName.split(' ').map(n => n[0]).join('')
              )}
            </AvatarFallback>
          </Avatar>
          {isOnline && !isGroup && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-online-indicator rounded-full border-2 border-card"></div>
          )}
        </div>
        
        <div>
          <h2 className="font-semibold text-foreground">{chatName}</h2>
          <p className="text-sm text-muted-foreground">
            {isGroup ? (
              `${memberCount} members`
            ) : (
              isOnline ? "Online" : "Last seen recently"
            )}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Video className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}