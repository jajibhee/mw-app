import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreateAccount from './pages/CreateAccount';
import Transfer from './pages/Transfer';
import AccountDetails from './pages/AccountDetails';
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/account/:id" element={<AccountDetails />} />
          <Route path="/transfer" element={<Transfer />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
