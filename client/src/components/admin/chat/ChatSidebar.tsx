import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../ui/dialog";
import { toast } from "../../../hooks/use-toast";
import { Search, Plus, Settings, Users, MessageCircle, UserPlus, Users2 } from "lucide-react";
import { Button } from "../../../ui/button";
import { Label } from "../../../ui/label";
import { Switch } from "../../../ui/switch";
import { Input } from "../../../ui/input";
import { Separator } from "../../../ui/separator";
import { ScrollArea } from "../../../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar";
import { Badge } from "../../../ui/badge";

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
  onNewChat?: () => void;
}

interface User {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
}

const mockUsers: User[] = [
  { id: "u1", name: "Alice Johnson" },
  { id: "u2", name: "Bob Wilson" },
  { id: "u3", name: "Sarah Tech Lead" },
  { id: "u4", name: "Mike Developer" },
  { id: "u2", name: "Bob Wilson" },
  { id: "u3", name: "Sarah Tech Lead" },
  { id: "u4", name: "Mike Developer" },
];

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

export function ChatSidebar({ selectedChatId, onChatSelect, onNewChat }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [lastSeen, setLastSeen] = useState(false);

  const [allUsers, setAllUsers] = useState<User[]>(mockUsers);
  const [chatMode, setChatMode] = useState<"individual" | "group">("individual");
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");


  const filteredChats = mockChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewChat = () => {
    setNewChatOpen(true);
  };

  const handleCreateIndividualChat = () => {
    setNewChatOpen(false);
    setShowUsersModal(true);
    setChatMode("individual")
    toast({
      title: "New Individual Chat",
      description: "Creating a new individual conversation..."
    });
    onNewChat?.();
  };

  const handleCreateGroupChat = () => {
    setNewChatOpen(false);
    setShowUsersModal(true);
    setChatMode("group")
    toast({
      title: "New Group Chat",
      description: "Creating a new group conversation..."
    });
    onNewChat?.();
  };

  // 🔍 Filtered users based on search
  const filteredUsers = useMemo(() => {
    return allUsers.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allUsers]);

  // ✅ Select/unselect logic
  const toggleUser = (id: string) => {
    if (chatMode === "individual") {
      setSelectedUsers([id]);
    } else {
      if (selectedUsers.includes(id)) {
        setSelectedUsers(selectedUsers.filter((u) => u !== id));
      } else {
        setSelectedUsers([...selectedUsers, id]);
      }
    }
  };

  const onCreateChat = ()  => {setShowUsersModal(false)};


  return (
    <div className="w-80 bg-chat-sidebar border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-foreground">Messages</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleNewChat}>
              <Plus className="h-4 w-4" />
            </Button>
            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Chat Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Notifications</h4>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifications" className="text-sm">Enable notifications</Label>
                      <Switch
                        id="notifications"
                        checked={notifications}
                        onCheckedChange={(checked) => {
                          setNotifications(checked);
                          toast({
                            title: checked ? "Notifications enabled" : "Notifications disabled",
                            description: checked ? "You'll receive message notifications" : "You won't receive message notifications"
                          });
                        }}
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Privacy</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="read-receipts" className="text-sm">Read receipts</Label>
                        <Switch
                          id="read-receipts"
                          checked={readReceipts}
                          onCheckedChange={(checked) => {
                            setReadReceipts(checked);
                            toast({
                              title: checked ? "Read receipts enabled" : "Read receipts disabled",
                              description: checked ? "Others can see when you read messages" : "Others can't see when you read messages"
                            });
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="last-seen" className="text-sm">Show last seen</Label>
                        <Switch
                          id="last-seen"
                          checked={lastSeen}
                          onCheckedChange={(checked) => {
                            setLastSeen(checked);
                            toast({
                              title: checked ? "Last seen visible" : "Last seen hidden",
                              description: checked ? "Others can see when you were last online" : "Others can't see when you were last online"
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-10 bg-chat-input border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredChats.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "No conversations found" : "No conversations yet"}
              </p>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onChatSelect(chat.id)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${selectedChatId === chat.id ? 'bg-accent' : ''
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
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-600 rounded-full border-2 border-chat-sidebar"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0 max-w-48">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-foreground truncate">
                      {chat.name}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {chat.timestamp}
                    </span>
                  </div>
                  {/* for truncate to make work it's nearest parent should contrain its child width thats why i given max-w-48 for its parent. */}
                  <p className="text-sm text-muted-foreground truncate">
                    {chat.lastMessage}
                  </p>
                </div>

                {chat.unreadCount > 0 && (
                  <Badge variant="default" className="bg-primary text-primary-foreground">
                    {chat.unreadCount}
                  </Badge>
                )}
              </div>
            )))}
        </div>
      </ScrollArea>

      {/* New Chat Dialog */}
      <Dialog open={newChatOpen} onOpenChange={setNewChatOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start New Chat</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Button
              onClick={handleCreateIndividualChat}
              className="w-full justify-start"
              variant="outline"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Start Individual Chat
            </Button>
            <Button
              onClick={handleCreateGroupChat}
              className="w-full justify-start"
              variant="outline"
            >
              <Users2 className="h-4 w-4 mr-2" />
              Create Group Chat
            </Button>
          </div>
        </DialogContent>
      </Dialog>


      {/* New Chat Dialog */}
      <Dialog open={showUsersModal} onOpenChange={setShowUsersModal}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle>
              {chatMode === "individual" ? "Start New Chat" : "Create Group Chat"}
            </DialogTitle>
          </DialogHeader>

          {/* 🧠 Group name input */}
          {chatMode === "group" && (
            <div className="mb-3">
              <Input
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
          )}

          {/* 🔍 Search bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* 👥 User list */}
          <ScrollArea className="h-64 border rounded-lg">
            <div className="divide-y divide-border">
              {filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground text-sm">
                  No users found
                </div>
              ) : (
                filteredUsers.map((user) => {
                  const isSelected = selectedUsers.includes(user.id);
                  return (
                    <div
                      key={user.id}
                      className={`flex items-center gap-3 p-3 cursor-pointer transition-all ${isSelected
                          ? "bg-primary/10 hover:bg-primary/20"
                          : "hover:bg-accent"
                        }`}
                      onClick={() => toggleUser(user.id)}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user.name}
                        </p>
                      </div>
                      {isSelected && (
                        <span className="text-primary font-semibold text-xs">
                          ✓
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>

          <Button className="w-full mt-4" onClick={onCreateChat}>
            {chatMode === "individual" ? "Start Chat" : "Create Group"}
          </Button>

        </DialogContent>

      </Dialog>

    </div>
  );
}