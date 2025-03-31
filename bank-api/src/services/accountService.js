const Account = require('../models/account');
const Transaction = require('../models/transaction');

class AccountService {
    static async createAccount(customerId, initialDeposit) {
        const account = await Account.create(customerId, initialDeposit);
        await Transaction.create(account.id, account.id, initialDeposit, 'DEPOSIT');
        return account;
    }

    static async getAllAccounts() {
        const accounts = await Account.getAll();
        return accounts;
    }

    static async getBalance(accountId) {
        const balance = await Account.getBalance(accountId);
        if (!balance) {
            throw new Error(`Account with ID ${accountId} not found`);
        }
        return balance;
    }

    static async getTransactionHistory(accountId) {
        const transactions = await Transaction.getByAccountId(accountId);
        if (!transactions.length) {
            const account = await Account.getById(accountId);
            if (!account) {
                throw new Error(`Account with ID ${accountId} not found`);
            }
        }
        return transactions;
    }
}

module.exports = AccountService; 