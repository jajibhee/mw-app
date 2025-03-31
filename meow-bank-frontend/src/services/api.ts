import axios from 'axios';
import { Account, Transaction, TransferRequest, CreateAccountRequest } from '../types';

//would have used env variables but for now this is fine
const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const accountService = {
    createAccount: async (data: CreateAccountRequest): Promise<Account> => {
        const response = await api.post('/accounts', data);
        return response.data;
    },

    getAllAccounts: async (): Promise<Account[]> => {
        const response = await api.get('/accounts');
        return response.data;
    },

    getBalance: async (accountId: number): Promise<{ balance: number }> => {
        const response = await api.get(`/accounts/${accountId}/balance`);
        return response.data;
    },

    getTransactionHistory: async (accountId: number): Promise<Transaction[]> => {
        const response = await api.get(`/accounts/${accountId}/transactions`);
        return response.data;
    },
};

export const transactionService = {
    transfer: async (data: TransferRequest): Promise<{ message: string; details: any }> => {
        const response = await api.post('/transactions', data);
        return response.data;
    },
}; 