import { Box, Typography, Paper, Divider, Grid } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#5D293B', '#927464', '#C6A778', '#2F837D', '#05334D', '#A4A650'];

export default function FinancialSummary({ data }) {
  if (!data) return null;

  const { salary, rent, food, utilities, transportation, other_expenses } = data;
  
  const totalExpenses = rent + food + utilities + transportation + other_expenses;
  const savings = salary - totalExpenses;
  
  const pieData = [
    { name: 'Rent', value: rent },
    { name: 'Food', value: food },
    { name: 'Utilities', value: utilities },
    { name: 'Transport', value: transportation },
    { name: 'Other', value: other_expenses },
    { name: 'Savings', value: savings }
  ];

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 4, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
        Financial Summary
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => 
                    `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6">Income vs Expenses</Typography>
            
            <Box>
              <Typography>Monthly Salary: <strong>${salary.toFixed(2)}</strong></Typography>
              <Typography>Total Expenses: <strong>${totalExpenses.toFixed(2)}</strong></Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1" sx={{ color: savings >= 0 ? 'success.main' : 'error.main' }}>
                Monthly Savings: <strong>${savings.toFixed(2)}</strong>
              </Typography>
            </Box>
            
            <Divider sx={{ my: 1 }} />
            
            <Typography variant="h6">Expense Breakdown</Typography>
            {pieData.slice(0, -1).map((item, index) => (
              <Box key={item.name} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: COLORS[index] }}>
                  {item.name}:
                </Typography>
                <Typography>${item.value.toFixed(2)}</Typography>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}