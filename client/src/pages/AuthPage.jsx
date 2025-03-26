import { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Tabs, Tab } from '@mui/material';
import { login, register } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (activeTab === 0) {
        // Login
        const response = await login(formData);
        localStorage.setItem('token', response.data.token); // In a real app
        navigate('/dashboard');
      } else {
        // Register
        await register(formData);
        setActiveTab(0); // Switch to login after registration
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #5D293B 0%, #05334D 100%)'
    }}>
      <Paper elevation={6} sx={{ 
        width: 400, 
        p: 4, 
        borderRadius: 4,
        background: 'rgba(255, 255, 255, 0.9)'
      }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, val) => setActiveTab(val)}
          centered
          sx={{ mb: 3 }}
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
        
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
          />
          
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
          />
          
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ 
              mt: 3,
              bgcolor: 'secondary.main',
              '&:hover': { bgcolor: 'secondary.main', opacity: 0.9 }
            }}
          >
            {activeTab === 0 ? 'Login' : 'Register'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}