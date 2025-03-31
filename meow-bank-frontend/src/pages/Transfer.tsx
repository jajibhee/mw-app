import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  SelectChangeEvent,
} from '@mui/material';
import { transactionService, accountService } from '../services/api';
import { TransferRequest, Account } from '../types';

const Transfer = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [formData, setFormData] = useState<TransferRequest>({
    sender_id: 0,
    receiver_id: 0,
    amount: undefined as unknown as number,
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [senderBalance, setSenderBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await accountService.getAllAccounts();
        setAccounts(response);
        setLoading(false);
      } catch (err: any) {
        setError('Failed to fetch accounts');
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    const fetchSenderBalance = async () => {
      if (formData.sender_id) {
        try {
          const response = await accountService.getBalance(formData.sender_id);
          setSenderBalance(response.balance);
        } catch (err: any) {
          setSenderBalance(null);
        }
      } else {
        setSenderBalance(null);
      }
    };
    fetchSenderBalance();
  }, [formData.sender_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.amount || formData.amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!formData.sender_id || !formData.receiver_id) {
      setError('Please select both sender and receiver accounts');
      return;
    }

    if (senderBalance !== null && formData.amount > senderBalance) {
      setError(`Insufficient funds, get your meow-ney up. Available balance: $${Number(senderBalance).toFixed(2)}`);
      return;
    }

    try {
      const result = await transactionService.transfer(formData);
      setSuccess(result.message);
      setFormData({
        sender_id: 0,
        receiver_id: 0,
        amount: undefined as unknown as number,
      });
      if (formData.sender_id) {
        const response = await accountService.getBalance(formData.sender_id);
        setSenderBalance(response.balance);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to transfer money');
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || '',
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>Loading accounts...</Typography>
      </Box>
    );
  }

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
          Transfer Money
        </Typography>
        
        <Paper sx={{ p: 4, mt: 2 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid sx={{ width: '100%' }}>
                <FormControl fullWidth>
                  <InputLabel>From Account</InputLabel>
                  <Select
                    name="sender_id"
                    value={formData.sender_id}
                    onChange={handleSelectChange}
                    label="From Account"
                    required
                  >
                    <MenuItem value={0}>Select account</MenuItem>
                    {accounts.map((account) => (
                      <MenuItem key={account.id} value={account.id}>
                        {account.account_number} (Balance: ${Number(account.balance).toFixed(2)})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid sx={{ width: '100%' }}>
                <FormControl fullWidth>
                  <InputLabel>To Account</InputLabel>
                  <Select
                    name="receiver_id"
                    value={formData.receiver_id}
                    onChange={handleSelectChange}
                    label="To Account"
                    required
                  >
                    <MenuItem value={0}>Select account</MenuItem>
                    {accounts
                      .filter(account => account.id !== formData.sender_id)
                      .map((account) => (
                        <MenuItem key={account.id} value={account.id}>
                          {account.account_number}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              {senderBalance !== null && (
                <Grid sx={{ width: '100%' }}>
                  <Alert severity="info">
                    Available Balance: ${Number(senderBalance).toFixed(2)}
                  </Alert>
                </Grid>
              )}

              <Grid sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  label="Amount"
                  name="amount"
                  type="number"
                  value={formData.amount || ''}
                  onChange={handleAmountChange}
                  required
                  inputProps={{ min: 0.01, step: 0.01 }}
                  helperText="Enter amount to transfer"
                />
              </Grid>
            </Grid>
            
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {success}
              </Alert>
            )}
            
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={!formData.sender_id || !formData.receiver_id || !formData.amount}
              >
                Transfer
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
                fullWidth
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default Transfer; 