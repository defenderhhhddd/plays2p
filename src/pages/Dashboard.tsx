import { useState, useEffect } from "react";
import { useGetStats, getGetStatsQueryKey, useListOrders, getListOrdersQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUpRight, Clock, CheckCircle2, CreditCard, Activity, 
  TrendingUp, DollarSign, Users, AlertTriangle, Trophy, 
  BarChart3, PieChart, Calendar, Download, Eye, Smartphone,
  Circle
} from "lucide-react";
import { format } from "date-fns";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RePieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";

// Демо-данные для графиков
const weeklyData = [
  { name: "Пн", доход: 1200, заказы: 12 },
  { name: "Вт", доход: 1900, заказы: 18 },
  { name: "Ср", доход: 1500, заказы: 14 },
  { name: "Чт", доход: 2200, заказы: 22 },
  { name: "Пт", доход: 2800, заказы: 28 },
  { name: "Сб", доход: 2100, заказы: 20 },
  { name: "Вс", доход: 1700, заказы: 15 },
];

const methodData = [
  { name: "Банковские карты", value: 65, color: "#D4AF37" },
  { name: "Криптовалюты", value: 25, color: "#FFD700" },
  { name: "Сим-карты", value: 10, color: "#B8860B" },
];

const topOrders = [
  { id: "P2P-001", amount: 15000, profit: 300, client: "Алексей" },
  { id: "P2P-002", amount: 12500, profit: 250, client: "Мария" },
  { id: "P2P-003", amount: 10000, profit: 200, client: "Дмитрий" },
];

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetStats({ query: { queryKey: getGetStatsQueryKey() } });
  const { data: orders, isLoading: ordersLoading } = useListOrders({ query: { queryKey: getListOrdersQueryKey() } });
  const recentOrders = orders?.slice(0, 5) || [];
  const [todayProfit, setTodayProfit] = useState(1247.50);
  const [prediction, setPrediction] = useState(3200);
  const [traderRank, setTraderRank] = useState(3);
  const [totalTraders, setTotalTraders] = useState(12);
  
  // Данные для виджета "Устройства"
  const [devices, setDevices] = useState({
    total: 2,
    active: 1,
    offline: 1,
    lastActive: new Date(2026, 5, 6, 14, 30)
  });

  const fmt = (v: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);
  const fmtRub = (v: number) => new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", minimumFractionDigits: 0 }).format(v);

  return (
    <div className="space-y-8 page-transition">
      {/* Заголовок */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-mono uppercase flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#D4AF37]" />
            Системная панель
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Реальная статистика и прогнозы</p>
        </div>
        <button className="gradient-btn px-4 py-2 rounded-lg text-sm flex items-center gap-2">
          <Download className="w-4 h-4" />
          Экспорт отчёта
        </button>
      </div>

      {/* Виджеты */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Прибыль сегодня" value={fmtRub(todayProfit)} icon={<TrendingUp className="h-4 w-4 text-green-500" />} loading={false} color="gold" />
        <StatCard title="Прогноз на неделю" value={fmtRub(prediction)} icon={<Calendar className="h-4 w-4 text-[#D4AF37]" />} loading={false} color="gold" />
        <StatCard title="Активных карт" value={stats?.activeCards?.toString() || "0"} icon={<CreditCard className="h-4 w-4 text-[#D4AF37]" />} loading={statsLoading} />
        <StatCard title="Рейтинг" value={`#${traderRank} из ${totalTraders}`} icon={<Trophy className="h-4 w-4 text-yellow-500" />} loading={false} />
      </div>

      {/* Виджет "Устройства" (как в Payscrow) */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-premium rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-mono text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#D4AF37]" />
              Устройства
            </h2>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-gray-400">Онлайн: {devices.active}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-black/40 rounded-lg p-3">
              <p className="text-2xl font-bold text-white">{devices.total}</p>
              <p className="text-xs text-gray-500">Всего</p>
            </div>
            <div className="bg-black/40 rounded-lg p-3">
              <p className="text-2xl font-bold text-green-500">{devices.active}</p>
              <p className="text-xs text-gray-500">Активны</p>
            </div>
            <div className="bg-black/40 rounded-lg p-3">
              <p className="text-2xl font-bold text-red-500">{devices.offline}</p>
              <p className="text-xs text-gray-500">Офлайн</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Последняя активность: {devices.lastActive.toLocaleString()}
          </p>
          <button className="w-full mt-3 text-[#D4AF37] text-xs hover:underline">
            Управление устройствами →
          </button>
        </div>

        {/* График дохода */}
        <div className="glass-premium rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold font-mono text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#D4AF37]" />
              Доход по дням
            </h2>
            <select className="bg-gray-800 text-white text-sm rounded-lg px-3 py-1 border border-gray-700">
              <option>За неделю</option>
              <option>За месяц</option>
              <option>За год</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", borderColor: "#D4AF37" }} />
              <Area type="monotone" dataKey="доход" stroke="#D4AF37" fillOpacity={1} fill="url(#colorIncome)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Круговая диаграмма методов оплаты */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-premium rounded-xl p-6">
          <h2 className="text-lg font-bold font-mono text-white flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-[#D4AF37]" />
            Методы оплаты
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <RePieChart>
              <Pie data={methodData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                {methodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", borderColor: "#D4AF37" }} />
              <Legend />
            </RePieChart>
          </ResponsiveContainer>
        </div>

        {/* Топ платежей */}
        <div className="glass-premium rounded-xl p-6">
          <h2 className="text-lg font-bold font-mono text-white flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Топ платежей
          </h2>
          <div className="space-y-3">
            {topOrders.map((order, idx) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                <div className="flex items-center gap-3">
                  <span className="text-[#D4AF37] font-bold">#{idx + 1}</span>
                  <div>
                    <p className="text-white font-medium">{order.id}</p>
                    <p className="text-xs text-gray-400">{order.client}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#D4AF37] font-bold">{fmtRub(order.amount)}</p>
                  <p className="text-xs text-green-500">+{fmtRub(order.profit)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Последние заказы */}
      <div className="glass-premium rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-bold font-mono text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#D4AF37]" />
            Последние заказы
          </h2>
          <Eye className="w-4 h-4 text-gray-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr className="text-left text-xs text-gray-400">
                <th className="p-3">Заказ</th>
                <th className="p-3">Сумма</th>
                <th className="p-3">Прибыль</th>
                <th className="p-3">Статус</th>
                <th className="p-3">Дата</th>
              </td>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {ordersLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={5} className="p-3"><Skeleton className="h-8 w-full" /></td></tr>
                ))
              ) : recentOrders.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Нет заказов</td></tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="p-3 font-mono text-sm">{order.orderId}</td>
                    <td className="p-3 text-[#D4AF37] font-bold">{fmt(order.amount)}</td>
                    <td className="p-3 text-green-500">+{(order.amount * 0.02).toFixed(2)}$</td>
                    <td className="p-3">
                      <Badge className={`font-mono text-[10px] uppercase px-2 py-0.5 ${
                        order.status === "pending" ? "bg-yellow-500/10 text-yellow-500" :
                        order.status === "confirmed" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                      }`}>
                        {order.status === "pending" ? "Ожидание" : order.status === "confirmed" ? "Подтверждён" : "Отклонён"}
                      </Badge>
                    </td>
                    <td className="p-3 text-gray-400 text-sm">{format(new Date(order.createdAt), "dd MMM HH:mm")}</td>
                  </table>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, loading, color = "default" }: any) {
  return (
    <Card className={`border-border/50 ${color === "gold" ? "bg-gradient-to-r from-[#D4AF37]/10 to-transparent" : "bg-card/50"}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium tracking-wider text-muted-foreground uppercase">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? <Skeleton className="h-7 w-24" /> : <div className="text-2xl font-bold text-[#D4AF37]">{value}</div>}
      </CardContent>
    </Card>
  );
}
