const express = require('express');
const router = express.Router();
const AccountService = require('../services/accountService');
const { createAccountValidation, accountIdValidation } = require('../middleware/validators');

// Get all accounts
router.get('/', async (req, res) => {
    try {
        const accounts = await AccountService.getAllAccounts();
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new account
router.post('/', createAccountValidation, async (req, res) => {
    try {
        const { customer_id, initial_deposit } = req.body;
        const account = await AccountService.createAccount(customer_id, initial_deposit);
        res.status(201).json(account);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get account balance
router.get('/:id/balance', accountIdValidation, async (req, res) => {
    try {
        const balance = await AccountService.getBalance(req.params.id);
        res.json({ balance });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Get transaction history
router.get('/:id/transactions', accountIdValidation, async (req, res) => {
    try {
        const transactions = await AccountService.getTransactionHistory(req.params.id);
        res.json(transactions);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router; 