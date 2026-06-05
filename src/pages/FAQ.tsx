import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Search, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";

interface FAQItem {
  question: string;
  answer: string;
}

interface Category {
  title: string;
  icon: string;
  items: FAQItem[];
}

const categories: Category[] = [
  {
    title: "Начало работы",
    icon: "🚀",
    items: [
      {
        question: "Как получить токен доступа?",
        answer: "Токен доступа выдаётся администратором платформы. Обратитесь к вашему менеджеру или в службу поддержки — они создадут аккаунт и предоставят токен в течение рабочего дня.",
      },
      {
        question: "Что такое трафик и как его включить?",
        answer: "Трафик — это поток входящих платёжных заказов. Включите тумблер «Трафик» в верхней панели дашборда. Когда трафик активен, система начнёт направлять вам платёжные запросы согласно параметрам ваших карт.",
      },
      {
        question: "Как добавить карту?",
        answer: "Перейдите в раздел «Мои карты» → нажмите «Добавить карту» → заполните данные: номер карты, держателя, банк, лимиты сумм и количество платежей. После сохранения карта сразу начнёт принимать платежи.",
      },
    ],
  },
  {
    title: "Платежи и лимиты",
    icon: "💳",
    items: [
      {
        question: "Как рассчитывается моя прибыль?",
        answer: "Прибыль рассчитывается как процент от суммы каждого успешно обработанного платежа. Ваш процент комиссии указан в профиле. Например, при комиссии 5% и платеже $100 — ваша прибыль составит $5.",
      },
      {
        question: "Что такое лимиты карты?",
        answer: "У каждой карты можно задать: минимальную и максимальную сумму одного платежа, общее количество платежей в день и максимальное количество платежей в минуту. Это защищает вас от перегрузки и нежелательных транзакций.",
      },
      {
        question: "Когда происходит выплата баланса?",
        answer: "Выплаты осуществляются по запросу через раздел «Кошелёк». Минимальная сумма для вывода — $50. Обработка занимает от 1 до 24 часов в рабочие дни.",
      },
      {
        question: "Почему заказ не приходит на мою карту?",
        answer: "Проверьте: 1) включён ли трафик, 2) активна ли карта, 3) попадает ли сумма заказа в диапазон лимитов вашей карты, 4) не превышен ли лимит платежей в минуту.",
      },
    ],
  },
  {
    title: "Безопасность",
    icon: "🔐",
    items: [
      {
        question: "Что делать если токен скомпрометирован?",
        answer: "Немедленно свяжитесь с поддержкой через чат или email. Мы заблокируем старый токен и выдадим новый в течение нескольких минут. Никогда не передавайте токен третьим лицам.",
      },
      {
        question: "Как защитить свой аккаунт?",
        answer: "Храните токен только в защищённом месте, не передавайте его никому, не используйте в публичных сетях Wi-Fi. При подозрительной активности сразу обращайтесь в поддержку.",
      },
      {
        question: "Как просматривать историю действий?",
        answer: "Все действия фиксируются в разделе «Логи аудита» — там отображается время, тип операции и результат. Это помогает отслеживать активность и выявлять подозрительные события.",
      },
    ],
  },
];

export default function FAQ() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  const toggle = (key: string) => setOpen((prev) => (prev === key ? null : key));

  const filtered = categories.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        !search ||
        item.question.toLowerCase().includes(search.toLowerCase()) ||
        item.answer.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <AppLayout>
      <div className="p-6 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white font-mono">Частые вопросы</h1>
          <p className="text-gray-500 text-sm mt-1">Найдите ответы на популярные вопросы</p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по вопросам..."
            className="w-full pl-11 pr-4 py-3 bg-[#0f0f0f] border border-gray-800 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37] transition-colors text-sm"
          />
        </div>

        {/* Categories */}
        <div className="space-y-6">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-4xl mb-3">🔍</p>
              <p>Ничего не найдено по запросу «{search}»</p>
            </div>
          ) : (
            filtered.map((cat) => (
              <div key={cat.title}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{cat.icon}</span>
                  <h2 className="text-white font-semibold">{cat.title}</h2>
                  <span className="text-gray-600 text-xs">({cat.items.length})</span>
                </div>

                <div className="space-y-2">
                  {cat.items.map((item) => {
                    const key = cat.title + item.question;
                    const isOpen = open === key;
                    return (
                      <div
                        key={key}
                        className="bg-[#0f0f0f] border border-gray-800 rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() => toggle(key)}
                          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-800/30 transition-colors"
                        >
                          <span className="text-white text-sm font-medium pr-4">{item.question}</span>
                          {isOpen
                            ? <ChevronUp className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                            : <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />}
                        </button>
                        <div className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-48" : "max-h-0"}`}>
                          <p className="px-5 pb-4 text-gray-400 text-sm leading-relaxed border-t border-gray-800 pt-3">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Contact support CTA */}
        <div className="mt-10 bg-[#0f0f0f] border border-[#D4AF37]/20 rounded-2xl p-6 text-center">
          <p className="text-white font-semibold mb-1">Не нашли ответ?</p>
          <p className="text-gray-500 text-sm mb-4">Наша поддержка онлайн 24/7 и готова помочь</p>
          <button
            onClick={() => setLocation("/support")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37] text-black rounded-lg font-medium hover:bg-[#c4a030] transition-all text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            Написать в поддержку
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
