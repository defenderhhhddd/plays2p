/**
 * Telegram notification service.
 * Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env to enable.
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

async function sendMessage(text: string): Promise<void> {
  if (!BOT_TOKEN || !CHAT_ID) return; // Telegram not configured

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML" }),
    });
  } catch (err) {
    console.error("Telegram notification failed:", err);
  }
}

export const telegramNotifier = {
  newOrder: (orderId: string, amount: number, traderName: string) =>
    sendMessage(
      `🆕 <b>Новый заказ</b>\n` +
      `ID: <code>${orderId}</code>\n` +
      `Сумма: <b>$${amount.toFixed(2)}</b>\n` +
      `Трейдер: ${traderName}`
    ),

  orderConfirmed: (orderId: string, amount: number, profit: number) =>
    sendMessage(
      `✅ <b>Заказ подтверждён</b>\n` +
      `ID: <code>${orderId}</code>\n` +
      `Сумма: <b>$${amount.toFixed(2)}</b>\n` +
      `Прибыль: <b>$${profit.toFixed(2)}</b>`
    ),

  orderRejected: (orderId: string) =>
    sendMessage(`❌ <b>Заказ отклонён</b>\nID: <code>${orderId}</code>`),
};
