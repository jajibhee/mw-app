import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import { accountService } from '../services/api';
import { CreateAccountRequest } from '../types';

const CreateAccount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateAccountRequest>({
    customer_id: '',
    initial_deposit: undefined as unknown as number,
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.initial_deposit || formData.initial_deposit <= 0) {
      setError('Initial deposit must be greater than 0');
      return;
    }

    try {
      const account = await accountService.createAccount(formData);
      setSuccess(`Account created successfully! Account number: ${account.account_number}`);
      setFormData({ customer_id: '', initial_deposit: 0 });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create account');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'initial_deposit' ? Number(value) : value,
    }));
  };

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
          Create New Account
        </Typography>
        
        <Paper sx={{ p: 4, mt: 2 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Customer ID"
              name="customer_id"
              value={formData.customer_id}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Initial Deposit"
              name="initial_deposit"
              type="number"
              value={formData.initial_deposit}
              onChange={handleChange}
              margin="normal"
              required
              inputProps={{ min: 0.01, step: 0.01 }}
            />
            
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
              >
                Create Account
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

export default CreateAccount; 