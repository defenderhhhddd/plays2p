import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, CreditCard, History, Settings, LogOut,
  MessageCircle, HelpCircle, User, Key, Shield,
  FileText, Globe, Wallet, ChevronDown, ChevronRight
} from "lucide-react";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface Section {
  title: string;
  collapsible: boolean;
  items: MenuItem[];
}

const sections: Section[] = [
  {
    title: "Главное",
    collapsible: false,
    items: [
      { name: "Дашборд", href: "/dashboard", icon: LayoutDashboard },
      { name: "Мои карты", href: "/cards", icon: CreditCard },
      { name: "История заказов", href: "/history", icon: History },
    ],
  },
  {
    title: "Поддержка",
    collapsible: true,
    items: [
      { name: "Чат поддержки", href: "/support", icon: MessageCircle, badge: "Online" },
      { name: "FAQ", href: "/faq", icon: HelpCircle },
    ],
  },
  {
    title: "Настройки",
    collapsible: true,
    items: [
      { name: "Профиль", href: "/profile", icon: User },
      { name: "API ключи", href: "/api-keys", icon: Key },
      { name: "Безопасность", href: "/security", icon: Shield },
    ],
  },
  {
    title: "Дополнительно",
    collapsible: true,
    items: [
      { name: "Логи аудита", href: "/logs", icon: FileText },
      { name: "Отчёты", href: "/reports", icon: FileText },
      { name: "Обмен", href: "/exchange", icon: Globe },
      { name: "Кошелёк", href: "/wallet", icon: Wallet },
    ],
  },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleLogout = () => {
    localStorage.removeItem("traderToken");
    localStorage.removeItem("traderId");
    localStorage.removeItem("traderName");
    window.location.href = "/";
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
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4 scrollbar-gold">
          {sections.map((section) => {
            const isOpen = !section.collapsible || !collapsed[section.title];
            return (
              <div key={section.title}>
                {section.collapsible ? (
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="flex items-center justify-between w-full px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-300 transition-colors"
                  >
                    {section.title}
                    {isOpen
                      ? <ChevronDown className="w-3.5 h-3.5" />
                      : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                ) : (
                  <p className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {section.title}
                  </p>
                )}

                <div className={`space-y-0.5 overflow-hidden transition-all duration-200 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                  {section.items.map((item) => {
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
                </div>
              </div>
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
