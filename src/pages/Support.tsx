import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Send, Phone, Mail, Clock } from "lucide-react";

interface Message {
  id: number;
  text: string;
  from: "user" | "support";
  time: string;
  status: "sent" | "delivered" | "read";
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Добро пожаловать в поддержку PLAYERS2PAY! Чем могу помочь?",
    from: "support",
    time: "10:00",
    status: "read",
  },
];

function formatTime() {
  return new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

export default function Support() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now(),
      text,
      from: "user",
      time: formatTime(),
      status: "sent",
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === userMsg.id ? { ...m, status: "delivered" as const } : m))
      );
    }, 600);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply: Message = {
        id: Date.now() + 1,
        text: "Спасибо за обращение! Наш специалист ответит в ближайшее время.",
        from: "support",
        time: formatTime(),
        status: "read",
      };
      setMessages((prev) => [
        ...prev.map((m) => (m.id === userMsg.id ? { ...m, status: "read" as const } : m)),
        reply,
      ]);
    }, 2200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-screen max-h-screen">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 bg-[#0a0a0a]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white font-mono">Чат поддержки</h1>
              <p className="text-gray-500 text-sm mt-0.5">Среднее время ответа — 5 минут</p>
            </div>
            <span className="flex items-center gap-2 text-green-400 text-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Онлайн
            </span>
          </div>
        </div>

        {/* Contact info bar */}
        <div className="flex items-center gap-6 px-6 py-2.5 border-b border-gray-800 bg-[#0f0f0f] text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> +7 (800) 000-00-00</span>
          <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> support@players2pay.com</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 24/7</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 scrollbar-gold">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${msg.from === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.from === "user"
                    ? "bg-[#D4AF37] text-black rounded-br-sm"
                    : "bg-[#1a1a1a] text-white border border-gray-800 rounded-bl-sm"
                }`}>
                  {msg.text}
                </div>
                <div className={`flex items-center gap-1 text-xs text-gray-600 ${msg.from === "user" ? "flex-row-reverse" : ""}`}>
                  <span>{msg.time}</span>
                  {msg.from === "user" && (
                    <span className="text-[#D4AF37]/60">
                      {msg.status === "sent" ? "✓" : msg.status === "delivered" ? "✓✓" : "✓✓"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-gray-800 bg-[#0a0a0a]">
          <div className="flex items-end gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Введите сообщение..."
              rows={1}
              className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37] transition-colors resize-none text-sm leading-relaxed"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="p-3 bg-[#D4AF37] rounded-xl text-black hover:bg-[#c4a030] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600 text-xs mt-2 px-1">Enter — отправить · Shift+Enter — новая строка</p>
        </div>
      </div>
    </AppLayout>
  );
}
