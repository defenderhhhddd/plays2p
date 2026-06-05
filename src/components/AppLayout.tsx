import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Receipt, AlertTriangle, Wallet, CreditCard,
  MessageCircle, HelpCircle, Settings, LogOut, Key, Shield,
  Users, Bell, Download, Smartphone, Globe, FileText
} from "lucide-react";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface Section {
  title: string;
  items: MenuItem[];
}

// Порядок и названия как в Payscrow
const menuItems: MenuItem[] = [
  { name: "Главная", href: "/dashboard", icon: LayoutDashboard },
  { name: "Ордеры", href: "/orders", icon: Receipt },
  { name: "Апелляции", href: "/disputes", icon: AlertTriangle },
  { name: "Баланс", href: "/wallet", icon: Wallet },
  { name: "Реквизиты", href: "/cards", icon: CreditCard },
  { name: "Уведомления и СМС", href: "/notifications", icon: Bell },
  { name: "Поддержка", href: "/support", icon: MessageCircle },
  { name: "Терминалы", href: "/terminals", icon: Smartphone },
  { name: "Устройства", href: "/devices", icon: Users },
  { name: "Скачать APK", href: "/download-apk", icon: Download },
  { name: "API ключи", href: "/api-keys", icon: Key },
  { name: "Безопасность", href: "/security", icon: Shield },
  { name: "Логи аудита", href: "/logs", icon: FileText },
  { name: "Отчёты", href: "/reports", icon: Globe },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const handleLogout = async () => {
    // Удаляем сессию на сервере
    const sessionToken = localStorage.getItem("sessionToken");
    if (sessionToken) {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-session-token": sessionToken }
      });
    }
    localStorage.clear();
    window.location.href = "/login?secret=kitchen";
  };

  return (
    <div className="flex min-h-screen bg-black">
      <aside className="w-64 border-r border-gray-800 bg-black/50 backdrop-blur-sm flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-5 border-b border-gray-800">
          <div className="w-8 h-8 bg-[#D4AF37] rounded-md shadow-md shadow-[#D4AF37]/30 flex-shrink-0" />
          <span className="text-white font-bold tracking-wider font-mono text-sm">PLAYERS2PAY</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1 scrollbar-gold">
          {menuItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all cursor-pointer group ${
                  isActive
                    ? "bg-[#D4AF37]/10 text-[#D4AF37] border-l-2 border-[#D4AF37]"
                    : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                }`}>
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all w-full"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Выйти</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
