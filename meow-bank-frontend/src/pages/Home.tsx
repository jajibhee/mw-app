import { Container, Typography, Box, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Home = () => {
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
      <Box sx={{ width: '100%', maxWidth: '1200px', px: 2, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Meow Bank
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
          Your trusted financial partner
        </Typography>
        
        <Paper sx={{ p: 4, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
            <RouterLink to="/create-account" style={{ textDecoration: 'none' }}>
              <Paper
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                Create Account
              </Paper>
            </RouterLink>
            <RouterLink to="/transfer" style={{ textDecoration: 'none' }}>
              <Paper
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                Transfer Money
              </Paper>
            </RouterLink>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Home; 