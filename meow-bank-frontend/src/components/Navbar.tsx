import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Meow Bank
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
          <Button color="inherit" component={RouterLink} to="/create-account">
            Create Account
          </Button>
          <Button color="inherit" component={RouterLink} to="/transfer">
            Transfer
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 