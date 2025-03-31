const express = require('express');
const router = express.Router();
const TransactionService = require('../services/transactionService');
const { transferValidation } = require('../middleware/validators');

// Create a new transfer
router.post('/', transferValidation, async (req, res) => {
    try {
        const { sender_id, receiver_id, amount } = req.body;
        const result = await TransactionService.transfer(sender_id, receiver_id, amount);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router; 