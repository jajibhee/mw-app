const Account = require('../models/account');
const Transaction = require('../models/transaction');
const db = require('../config/database');

class TransactionService {
    static async transfer(senderId, receiverId, amount) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            // Prevent transfer to same account
            if (senderId === receiverId) {
                throw new Error('Cannot transfer money to the same account');
            }

            // Check if receiver account exists
            const receiverAccount = await Account.getById(receiverId);
            if (!receiverAccount) {
                throw new Error(`Receiver account with ID ${receiverId} not found`);
            }

            // Check sender's balance
            const senderBalance = await Account.getBalance(senderId);
            if (!senderBalance) {
                throw new Error(`Sender account with ID ${senderId} not found`);
            }

            if (senderBalance < amount) {
                throw new Error(`Insufficient funds. Current balance: ${senderBalance}`);
            }

            // Get account numbers for response
            const senderAccount = await Account.getById(senderId);

            // Perform the transfer
            await Account.updateBalance(senderId, amount, false);
            await Account.updateBalance(receiverId, amount, true);
            await Transaction.create(senderId, receiverId, amount, 'TRANSFER');

            await client.query('COMMIT');

            return {
                message: 'Transfer successful',
                details: {
                    from_account: senderAccount.account_number,
                    to_account: receiverAccount.account_number,
                    amount: amount
                }
            };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = TransactionService; 