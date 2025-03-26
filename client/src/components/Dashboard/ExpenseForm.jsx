import { useState, useEffect } from 'react';
import { 
  Box, TextField, Button, Typography, Paper, Slider,
  Select, MenuItem, InputLabel, FormControl, CircularProgress
} from '@mui/material';

const currencies = [
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'MAD', label: 'Moroccan Dirham (MAD)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'JPY', label: 'Japanese Yen (¥)' },
  { value: 'CAD', label: 'Canadian Dollar (C$)' },
];

export default function ExpensesForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    salary: '',
    rent: '',
    food: '',
    utilities: '',
    transportation: '',
    other: '',
    targetAmount: '',
    timeframe: 6,
    currency: 'USD',
    city: '',
    country: ''
  });

  const [loading, setLoading] = useState(true);

  // Load user settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/get-settings', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setFormData(prev => ({
            ...prev,
            currency: data.currency || 'USD',
            city: data.city || '',
            country: data.country || ''
          }));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Save settings first
      await fetch('/api/save-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currency: formData.currency,
          city: formData.city,
          country: formData.country
        })
      });

      // Format and submit financial data
      const formattedData = {
        salary: parseFloat(formData.salary) || 0,
        rent: parseFloat(formData.rent) || 0,
        food: parseFloat(formData.food) || 0,
        utilities: parseFloat(formData.utilities) || 0,
        transportation: parseFloat(formData.transportation) || 0,
        other_expenses: parseFloat(formData.other) || 0,
        target_amount: parseFloat(formData.targetAmount) || 0,
        timeframe_months: parseInt(formData.timeframe) || 6
      };
      
      onSubmit(formattedData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 4, maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
        Financial Planning
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Location and Currency Section */}
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <FormControl fullWidth>
            <InputLabel id="currency-label">Currency</InputLabel>
            <Select
              labelId="currency-label"
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              label="Currency"
              required
            >
              {currencies.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g. Casablanca"
          />
          
          <TextField
            fullWidth
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="e.g. Morocco"
          />
        </Box>

        {/* Income Section */}
        <Typography variant="h6" sx={{ mt: 2, color: 'text.primary' }}>
          Income
        </Typography>
        <TextField
          fullWidth
          label={`Monthly Salary (${formData.currency})`}
          name="salary"
          type="number"
          value={formData.salary}
          onChange={handleChange}
          required
          inputProps={{ min: 0, step: "0.01" }}
        />

        {/* Expenses Section */}
        <Typography variant="h6" sx={{ mt: 3, color: 'text.primary' }}>
          Monthly Expenses
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { sm: '1fr 1fr' }, gap: 3 }}>
          <TextField
            label={`Rent/Mortgage (${formData.currency})`}
            name="rent"
            type="number"
            value={formData.rent}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.01" }}
          />
          
          <TextField
            label={`Food (${formData.currency})`}
            name="food"
            type="number"
            value={formData.food}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.01" }}
          />
          
          <TextField
            label={`Utilities (${formData.currency})`}
            name="utilities"
            type="number"
            value={formData.utilities}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.01" }}
          />
          
          <TextField
            label={`Transportation (${formData.currency})`}
            name="transportation"
            type="number"
            value={formData.transportation}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.01" }}
          />
          
          <TextField
            label={`Other Expenses (${formData.currency})`}
            name="other"
            type="number"
            value={formData.other}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.01" }}
          />
        </Box>

        {/* Savings Goal Section */}
        <Typography variant="h6" sx={{ mt: 3, color: 'text.primary' }}>
          Savings Goal
        </Typography>
        
        <TextField
          fullWidth
          label={`Target Amount (${formData.currency})`}
          name="targetAmount"
          type="number"
          value={formData.targetAmount}
          onChange={handleChange}
          required
          inputProps={{ min: 0, step: "0.01" }}
        />
        
        <Box sx={{ mt: 2 }}>
          <Typography gutterBottom>
            Timeframe: {formData.timeframe} months
          </Typography>
          <Slider
            value={formData.timeframe}
            onChange={(e, val) => setFormData(prev => ({ ...prev, timeframe: val }))}
            min={1}
            max={24}
            step={1}
            valueLabelDisplay="auto"
            marks={[
              { value: 1, label: '1m' },
              { value: 6, label: '6m' },
              { value: 12, label: '1y' },
              { value: 24, label: '2y' }
            ]}
            sx={{ maxWidth: 600 }}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={{ 
            mt: 4,
            py: 2,
            bgcolor: 'secondary.main',
            '&:hover': { bgcolor: 'secondary.dark' }
          }}
        >
          Generate Personalized Savings Plan
        </Button>
      </Box>
    </Paper>
  );
}