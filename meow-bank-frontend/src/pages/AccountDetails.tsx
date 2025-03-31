import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
} from '@mui/material';
import { accountService } from '../services/api';
import { Transaction } from '../types';

const AccountDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [balanceData, transactionsData] = await Promise.all([
          accountService.getBalance(Number(id)),
          accountService.getTransactionHistory(Number(id)),
        ]);
        setBalance(balanceData.balance);
        setTransactions(transactionsData);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch account details');
      } finally {
        setLoading(false);
      }
    };


    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  console.log('balance', balance);
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      width: '100vw',
      bgcolor: 'background.default',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      py: 4
    }}>
      <Box sx={{ width: '100%', maxWidth: '1200px', px: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Account Details
        </Typography>
        
        {error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : (
          <>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Current Balance
              </Typography>
              <Typography variant="h4" color="primary">
                ${Number(balance).toFixed(2)}
              </Typography>
            </Paper>

            <Typography variant="h5" gutterBottom>
              Transaction History
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>From</TableCell>
                    <TableCell>To</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{transaction.transaction_type}</TableCell>
                      <TableCell>{transaction.sender_account_number}</TableCell>
                      <TableCell>{transaction.receiver_account_number}</TableCell>
                      <TableCell align="right">
                        ${Number(transaction.amount).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </Box>
  );
};

export default AccountDetails; 