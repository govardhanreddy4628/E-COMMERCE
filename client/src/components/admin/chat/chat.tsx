import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useState } from "react";
import { ChatSidebar } from './ChatSidebar';
import { ChatArea } from './ChatArea';
import { toast } from "../../../hooks/use-toast";
import "./chat.css"


interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
  senderName?: string;
  senderAvatar?: string;
  isRead?: boolean;
}

interface Chat {
  id: string;
  name: string;
  isOnline: boolean;
  isGroup: boolean;
  memberCount?: number;
  avatar?: string;
}

const mockChats: Chat[] = [
  {
    id: "1",
    name: "Alice Johnson",
    isOnline: true,
    isGroup: false
  },
  {
    id: "2",
    name: "Dev Team",
    isOnline: false,
    isGroup: true,
    memberCount: 12
  },
  {
    id: "3",
    name: "Bob Wilson",
    isOnline: false,
    isGroup: false
  },
  {
    id: "4",
    name: "Design Team",
    isOnline: false,
    isGroup: true,
    memberCount: 8
  }
];

const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      content: "Hey! How's your new chat app coming along?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isOwn: false,
      senderName: "Alice Johnson",
      isRead: true
    },
    {
      id: "2",
      content: "It's looking amazing! Just finished the UI components.",
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
      isOwn: true,
      isRead: true
    },
    {
      id: "3",
      content: "The design system with the purple theme is really clean 🎨",
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      isOwn: false,
      senderName: "Alice Johnson",
      isRead: true
    },
    {
      id: "4",
      content: "Thanks! Next step is integrating Supabase for real-time messaging",
      timestamp: new Date(Date.now() - 1000 * 60 * 1),
      isOwn: true,
      isRead: false
    }
  ],
  "2": [
    {
      id: "5",
      content: "Great work on the chat interface everyone! 🚀",
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      isOwn: false,
      senderName: "Sarah Tech Lead",
      isRead: true
    },
    {
      id: "6",
      content: "The message bubbles look perfect",
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      isOwn: false,
      senderName: "Mike Developer",
      isRead: true
    }
  ]
};


const Chat = () => {
  // ✅ Infer the correct type from the io() return
  const socketRef = useRef<ReturnType<typeof io> | null>(null);

  const [selectedChatId, setSelectedChatId] = useState<string>();
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
  const [isConnected, setIsConnected] = useState(false);

  const selectedChat = mockChats.find(chat => chat.id === selectedChatId) || null;
  const currentMessages = selectedChatId ? messages[selectedChatId] || [] : [];
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  console.log(isConnected)

  const handleSendMessage = (content: string) => {
    if (!selectedChatId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      isOwn: true,
      isRead: false
    };

    setMessages(prev => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMessage]
    }));
  };

  useEffect(() => {
    console.log(import.meta.env.VITE_BACKEND_URL_LOCAL)
    const backendUrl = import.meta.env.VITE_BACKEND_URL_LOCAL as string;

    if (!backendUrl) {
      console.error('Backend URL is not defined.');
      return;
    }

    socketRef.current = io(backendUrl + "/admin", {
      transports: ["websocket"],
      transportOptions: {
        websocket: {
          withCredentials: true,
        },
      },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });



    socketRef.current.on("connect", () => {
      console.log("🟢 Connected to socket");
      setIsConnected(true);
    });
    socketRef.current.on("disconnect", () => {
      console.log("🔴 Disconnected from socket");
      setIsConnected(false);
    });

    // Listen for icoming messages
    // socketRef.current.on("recieveMessage", (msg: ChatMessage) => {
    //   setSelectedChatId((prev) => [...prev, msg])
    // })

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // useEffect(() => {
  //   //Auto scroll to bottom when new message arrives
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth"})
  // },[chat])

  const handleNewChat = () => {
    toast({
      title: "New Chat",
      description: "Create a new conversation or contact list here",
    })
  }

  return <div className="h-[calc(100vh-4rem)] flex bg-background">
    <ChatSidebar
      selectedChatId={selectedChatId}
      onChatSelect={setSelectedChatId}
      onNewChat={handleNewChat}
    />
    <ChatArea
      selectedChat={selectedChat}
      messages={currentMessages}
      onSendMessage={handleSendMessage}
    />
  </div>
};

export default Chat;


