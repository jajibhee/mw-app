const db = require('../config/database');

class Transaction {
    static async create(senderId, receiverId, amount, type) {
        const result = await db.query(
            'INSERT INTO transactions (sender_id, receiver_id, amount, transaction_type) VALUES ($1, $2, $3, $4) RETURNING *',
            [senderId, receiverId, amount, type]
        );
        return result.rows[0];
    }

    static async getByAccountId(accountId) {
        const result = await db.query(
            `SELECT t.*, 
                    a1.account_number as sender_account_number,
                    a2.account_number as receiver_account_number
             FROM transactions t
             LEFT JOIN accounts a1 ON t.sender_id = a1.id
             LEFT JOIN accounts a2 ON t.receiver_id = a2.id
             WHERE t.sender_id = $1 OR t.receiver_id = $1
             ORDER BY t.created_at DESC`,
            [accountId]
        );
        return result.rows;
    }
}

module.exports = Transaction; 