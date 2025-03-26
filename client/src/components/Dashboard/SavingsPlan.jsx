import { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, CircularProgress, 
  Button, Divider, Card, CardContent 
} from '@mui/material';
import { generateSavingsPlan } from '../../services/api';

export default function SavingsPlan({ financialData }) {
  const [plan, setPlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (financialData) {
      handleGeneratePlan();
    }
  }, [financialData]);

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await generateSavingsPlan(financialData);
      setPlan(response.data.plan);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate plan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 4, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
        Your Personalized Savings Plan
      </Typography>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      ) : plan ? (
        <Card sx={{ bgcolor: 'background.paper', mt: 2 }}>
          <CardContent>
            {plan.split('\n').map((paragraph, i) => (
              <Typography 
                key={i} 
                paragraph 
                sx={{ 
                  mb: 2,
                  whiteSpace: 'pre-wrap',
                  color: 'text.primary'
                }}
              >
                {paragraph}
              </Typography>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Typography sx={{ color: 'text.secondary', my: 2 }}>
          No plan generated yet. Submit your financial details to get started.
        </Typography>
      )}
      
      <Divider sx={{ my: 3 }} />
      
      <Button
        variant="contained"
        onClick={handleGeneratePlan}
        disabled={isLoading || !financialData}
        sx={{
          bgcolor: 'accent.main',
          '&:hover': { bgcolor: 'accent.main', opacity: 0.9 }
        }}
      >
        Regenerate Plan
      </Button>
    </Paper>
  );
}