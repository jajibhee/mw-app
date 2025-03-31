export interface Account {
    id: number;
    customer_id: string;
    account_number: string;
    balance: number;
    created_at: string;
}

export interface Transaction {
    id: number;
    sender_id: number;
    receiver_id: number;
    amount: number;
    transaction_type: 'DEPOSIT' | 'TRANSFER';
    created_at: string;
    sender_account_number?: string;
    receiver_account_number?: string;
}

export interface TransferRequest {
    sender_id: number;
    receiver_id: number;
    amount: number;
}

export interface CreateAccountRequest {
    customer_id: string;
    initial_deposit: number;
} 