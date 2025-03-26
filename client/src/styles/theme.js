import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5D293B',
      light: '#7D4E5F',
      dark: '#3D1A29',
      50: '#f0e6ea',
      100: '#d9c1cc',
      200: '#c098ab',
      300: '#a66f89',
      400: '#935070',
      500: '#803157', // Old Mauve (main)
      600: '#782c4f',
      700: '#6d2546',
      800: '#631f3c',
      900: '#50132d',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2F837D',
      light: '#5FB3AD',
      dark: '#005750',
      50: '#e0f0ef',
      100: '#b3dad7',
      200: '#80c2bd',
      300: '#4da9a3',
      400: '#26968f',
      500: '#00847b', // Celadon Green (main)
      600: '#007c73',
      700: '#007168',
      800: '#00675e',
      900: '#00544b',
      contrastText: '#ffffff',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
      contrastText: '#ffffff',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#05334D',
      secondary: '#927464',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
    common: {
      white: '#ffffff',
      black: '#000000',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      A100: '#f5f5f5',
      A200: '#eeeeee',
      A400: '#bdbdbd',
      A700: '#616161',
    },
    // Your custom colors
    accent: {
      main: '#C6A778',
      contrast: '#A4A650',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 300 },
    h2: { fontSize: '2rem', fontWeight: 400 },
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;