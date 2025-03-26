import { useState, useEffect } from 'react';  // Added both hooks
import { useNavigate } from 'react-router-dom';  // Make sure this is imported
import { Box, CircularProgress, Typography } from '@mui/material';

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  if (isAuthenticated === null) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress />
        <Typography>Verifying authentication...</Typography>
      </Box>
    );
  }

  return isAuthenticated ? children : null;
}