import { pool } from "../db";

interface Card {
  id: number;
  trader_id: number;
  card_number: string;
  bank_name: string;
  min_amount: number;
  max_amount: number;
}

/**
 * Selects the best available card for a given payment amount.
 * Filters by active traders, active cards, and amount range.
 * Returns null if no suitable card found.
 */
export async function selectCard(amount: number): Promise<Card | null> {
  const result = await pool.query<Card>(
    `SELECT c.id, c.trader_id, c.card_number, c.bank_name, c.min_amount, c.max_amount
     FROM cards c
     JOIN traders t ON c.trader_id = t.id
     WHERE c.is_active = true
       AND t.is_active = true
       AND c.min_amount <= $1
       AND c.max_amount >= $1
     ORDER BY RANDOM()
     LIMIT 1`,
    [amount]
  );

  return result.rows[0] ?? null;
}
