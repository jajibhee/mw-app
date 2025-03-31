const db = require('../config/database');

class Account {
    static async create(customerId, initialDeposit) {
        const accountNumber = `MEWO${Date.now()}`;
        const result = await db.query(
            'INSERT INTO accounts (customer_id, account_number, balance) VALUES ($1, $2, $3) RETURNING *',
            [customerId, accountNumber, initialDeposit]
        );
        return result.rows[0];
    }

    static async getAll() {
        const result = await db.query(
            'SELECT * FROM accounts ORDER BY created_at DESC'
        );
        return result.rows;
    }

    static async getById(id) {
        const result = await db.query(
            'SELECT * FROM accounts WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    static async getBalance(id) {
        const result = await db.query(
            'SELECT balance FROM accounts WHERE id = $1',
            [id]
        );
        return result.rows[0]?.balance;
    }

    static async updateBalance(id, amount, isAddition) {
        const operator = isAddition ? '+' : '-';
        const result = await db.query(
            `UPDATE accounts SET balance = balance ${operator} $1 WHERE id = $2 RETURNING balance`,
            [amount, id]
        );
        return result.rows[0];
    }

    static async getTransactionHistory(id) {
        const result = await db.query(
            `SELECT t.*, 
                    a1.account_number as sender_account_number,
                    a2.account_number as receiver_account_number
             FROM transactions t
             LEFT JOIN accounts a1 ON t.sender_id = a1.id
             LEFT JOIN accounts a2 ON t.receiver_id = a2.id
             WHERE t.sender_id = $1 OR t.receiver_id = $1
             ORDER BY t.created_at DESC`,
            [id]
        );
        return result.rows;
    }
}

module.exports = Account; 