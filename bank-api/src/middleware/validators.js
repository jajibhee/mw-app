const { body, param, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            error: 'Validation Error',
            details: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    }
    next();
};

const createAccountValidation = [
    body('customer_id')
        .isInt({ min: 1 })
        .withMessage('Customer ID must be a positive integer')
        .trim(),
    body('initial_deposit')
        .isFloat({ min: 0.01 })
        .withMessage('Initial deposit must be a positive number greater than 0')
        .toFloat(),
    validate
];

// Transfer validation
const transferValidation = [
    body('sender_id')
        .isInt({ min: 1 })
        .withMessage('Sender ID must be a positive integer')
        .trim(),
    body('receiver_id')
        .isInt({ min: 1 })
        .withMessage('Receiver ID must be a positive integer')
        .trim(),
    body('amount')
        .isFloat({ min: 0.01 })
        .withMessage('Amount must be a positive number greater than 0')
        .toFloat(),
    validate
];

// Account ID validation for routes with :id parameter
const accountIdValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Account ID must be a positive integer')
        .trim(),
    validate
];

module.exports = {
    createAccountValidation,
    transferValidation,
    accountIdValidation
}; 