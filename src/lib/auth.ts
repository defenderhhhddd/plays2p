export const auth = {
  setTrader(traderId: number, traderName: string, token: string) {
    localStorage.setItem("traderId", String(traderId));
    localStorage.setItem("traderName", traderName);
    localStorage.setItem("traderToken", token);
  },

  setAdmin(adminName: string, token: string) {
    localStorage.setItem("adminName", adminName);
    localStorage.setItem("adminToken", token);
  },

  getTrader() {
    return {
      id: Number(localStorage.getItem("traderId")),
      name: localStorage.getItem("traderName") ?? "",
      token: localStorage.getItem("traderToken") ?? "",
    };
  },

  getAdmin() {
    return {
      name: localStorage.getItem("adminName") ?? "",
      token: localStorage.getItem("adminToken") ?? "",
    };
  },

  isTraderLoggedIn(): boolean {
    return !!localStorage.getItem("traderToken");
  },

  isAdminLoggedIn(): boolean {
    return !!localStorage.getItem("adminToken");
  },

  logoutTrader() {
    localStorage.removeItem("traderId");
    localStorage.removeItem("traderName");
    localStorage.removeItem("traderToken");
  },

  logoutAdmin() {
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminToken");
  },
};
