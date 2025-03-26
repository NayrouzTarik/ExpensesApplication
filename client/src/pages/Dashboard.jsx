import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { getFinancialHistory } from '../services/api';
import ExpenseForm from '../components/Dashboard/ExpenseForm';
import FinancialSummary from '../components/Dashboard/FinancialSummary';
import SavingsPlan from '../components/Dashboard/SavingsPlan';

export default function Dashboard() {
  const [financialData, setFinancialData] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getFinancialHistory();
        setHistory(response.data);
        if (response.data.length > 0) {
          setFinancialData(response.data[0]);
        }
      } catch (err) {
        setError('Failed to load financial history. Please try again.');
        console.error('Error fetching history:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleSubmit = (data) => {
    const formattedData = {
      salary: parseFloat(data.salary),
      rent: parseFloat(data.rent || 0),
      food: parseFloat(data.food || 0),
      utilities: parseFloat(data.utilities || 0),
      transportation: parseFloat(data.transportation || 0),
      other_expenses: parseFloat(data.other || 0),
      target_amount: parseFloat(data.targetAmount),
      timeframe_months: parseInt(data.timeframe)
    };
    setFinancialData(formattedData);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', mb: 4 }}>
        Financial Dashboard
      </Typography>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 4 }}>
        <Box>
          <ExpenseForm 
            onSubmit={handleSubmit} 
            initialData={financialData} 
          />
        </Box>
        
        <Box>
          {financialData && (
            <>
              <FinancialSummary data={financialData} />
              <SavingsPlan financialData={financialData} />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}