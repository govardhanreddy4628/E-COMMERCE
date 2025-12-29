// File: AdminAgentLayout.tsx
import React, { useEffect, useRef, useState } from "react";


export default function AdminAgentLayout2() {
  return (
    <div className="h-[calc(100vh-4.2rem)] flex bg-gray-50">
      <AgentSidebar />
      <main className="flex-1 p-6">
        <div className="h-full bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
          <header className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">AI Admin Agent</h2>
              <p className="text-xs text-muted-foreground">Ask the agent about sales, inventory, forecasts and more.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-gray-500">Model</div>
                <div className="text-sm font-medium">gpt-4o-mini</div>
              </div>
            </div>
          </header>

          <div className="flex-1">
            <AgentChat />
          </div>
        </div>
      </main>
    </div>
  );
}


// File: AgentSidebar.tsx


export type AgentItem = {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
};

const AGENTS: AgentItem[] = [
  { id: "sales", title: "Sales Agent", subtitle: "Forecasts & Trends" },
  { id: "inventory", title: "Inventory Agent", subtitle: "Restocks & Alerts" },
  { id: "support", title: "Support Agent", subtitle: "Tickets & Replies" },
  { id: "marketing", title: "Marketing Agent", subtitle: "Campaign ideas" },
];

function AgentSidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
      <div className="mb-4 px-1">
        <h1 className="text-xl font-semibold">Agents</h1>
        <p className="text-sm text-gray-500">Choose an agent to start</p>
      </div>

      <nav className="flex-1 overflow-auto space-y-2">
        {AGENTS.map((a) => (
          <button
            key={a.id}
            className="w-full text-left p-3 rounded-lg hover:bg-sky-50 transition flex items-center gap-3"
          >
            <div className="h-9 w-9 rounded-md bg-sky-100 flex items-center justify-center text-sky-700 font-semibold">
              {a.title.split(" ").map((w) => w[0]).join("")}
            </div>
            <div className="flex-1">
              <div className="font-medium">{a.title}</div>
              <div className="text-xs text-gray-500">{a.subtitle}</div>
            </div>
            <div className="text-xs text-gray-400">›</div>
          </button>
        ))}
      </nav>

      <div className="mt-4">
        <button className="w-full px-3 py-2 bg-sky-600 text-white rounded-md">New Conversation</button>
      </div>
    </aside>
  );
}


// File: AgentChat.tsx


type Role = "user" | "assistant";

type Message = {
  id: string;
  role: Role;
  text: string;
  time?: string;
};

const INITIAL: Message[] = [
  { id: "m1", role: "assistant", text: "Hi — I'm your AI Admin Agent. Ask me about sales, forecasts, or inventory.", time: new Date().toISOString() },
];

function formatTime(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function AgentChat() {
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // auto-scroll to bottom when messages change
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  function sendMessage() {
    if (!text.trim()) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", text: text.trim(), time: new Date().toISOString() };
    setMessages((m) => [...m, userMsg]);
    setText("");

    // fake assistant reply
    setLoading(true);
    setTimeout(() => {
      const reply: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: generateFakeReply(userMsg.text),
        time: new Date().toISOString(),
      };
      setMessages((m) => [...m, reply]);
      setLoading(false);
    }, 900 + Math.random() * 800);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-4 overflow-auto" ref={containerRef}>
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] md:max-w-[60%] ${m.role === "user" ? "text-right" : "text-left"}`}>
                <div className={`${m.role === "user" ? "bg-sky-600 text-white" : "bg-gray-100 text-gray-900"} inline-block rounded-2xl px-4 py-2 leading-relaxed`}>
                  <div className="whitespace-pre-wrap">{m.text}</div>
                </div>
                <div className="text-xs text-gray-400 mt-1">{formatTime(m.time)}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[60%]">
                <div className="bg-gray-100 text-gray-700 inline-block rounded-2xl px-4 py-2">
                  <TypingDots />
                </div>
                <div className="text-xs text-gray-400 mt-1">...</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t p-4">
        <div className="max-w-3xl mx-auto flex gap-3 items-end">
          <textarea
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about sales, forecasts, or inventory... (Shift+Enter for newline)"
            className="flex-1 resize-none rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function generateFakeReply(userText: string) {
  // small deterministic-ish fake reply based on keywords
  const t = userText.toLowerCase();
  if (t.includes("sales")) return "Last week sales increased by 12% compared to the previous week. Do you want a category breakdown?";
  if (t.includes("forecast")) return "Forecast for next 7 days: steady with a slight increase on weekends. Confidence: medium.";
  if (t.includes("inventory")) return "3 products are below reorder threshold: SKU-123 (10 left), SKU-456 (4 left), SKU-789 (2 left).";
  if (t.includes("recommend")) return "Recommend promoting top-selling T-shirts and offering a 10% discount on slow movers.";
  return "I can help with sales summaries, inventory checks, forecasts, and recommendations. Ask me anything about your store.";
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0s" }} />
      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.1s" }} />
      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
    </div>
  );
}


/*
Usage:
- Place these three files under src/components/
- Import AdminAgentLayout into a page (e.g., src/App.tsx):

  import AdminAgentLayout from "./components/AdminAgentLayout";
  export default function App() { return <AdminAgentLayout /> }

- Ensure Tailwind is setup in your Vite project.
*/
