const BASE = "";

function getHeaders(): Record<string, string> {
  const token = localStorage.getItem("traderToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { "x-trader-token": token } : {}),
  };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...getHeaders(), ...(options?.headers ?? {}) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? "Request failed");
  }
  return res.json() as Promise<T>;
}

export const api = {
  // Auth
  login: (token: string) =>
    request<{ traderId: number; traderName: string }>("/api/auth/trader-login", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),

  // Trader
  getStats: (traderId: number) =>
    request(`/api/traders/${traderId}/stats`),

  getActiveOrders: (traderId: number) =>
    request(`/api/traders/${traderId}/active-orders`),

  getHistory: (traderId: number) =>
    request(`/api/traders/${traderId}/history`),

  getTrafficStatus: (traderId: number) =>
    request<{ enabled: boolean }>(`/api/traders/${traderId}/traffic-status`),

  toggleTraffic: (traderId: number, enabled: boolean) =>
    request(`/api/traders/${traderId}/traffic-toggle`, {
      method: "POST",
      body: JSON.stringify({ enabled }),
    }),

  // Cards
  getCards: (traderId: number) =>
    request(`/api/traders/${traderId}/cards`),

  addCard: (card: Record<string, unknown>) =>
    request("/api/traders/cards", {
      method: "POST",
      body: JSON.stringify(card),
    }),

  deleteCard: (cardId: number) =>
    request(`/api/traders/cards/${cardId}`, { method: "DELETE" }),

  // Orders
  confirmOrder: (orderId: string) =>
    request(`/api/orders/${orderId}/confirm`, { method: "POST" }),

  rejectOrder: (orderId: string) =>
    request(`/api/orders/${orderId}/reject`, { method: "POST" }),
};
