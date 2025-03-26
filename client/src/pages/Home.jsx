// src/pages/Home.jsx
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      p: 4,
      background: 'linear-gradient(135deg, #5D293B 0%, #05334D 100%)',
      color: 'white',
      textAlign: 'center'
    }}>
      <Typography variant="h2" component="h1" gutterBottom sx={{ mb: 4 }}>
        ExpenseAI Planner
      </Typography>
      <Typography variant="h5" sx={{ mb: 6 }}>
        Smart financial planning with AI-powered insights
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/auth?mode=login')}
          sx={{
            bgcolor: 'accent.main',
            '&:hover': { bgcolor: 'accent.main', opacity: 0.9 }
          }}
        >
          Login
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/auth?mode=register')}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'accent.main' }
          }}
        >
          Register
        </Button>
      </Box>
    </Box>
  );
}