import { createTheme } from '@mui/material/styles';

// Create a theme instance with a clean, modern design inspired by Apple/Google
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Google blue
      light: '#4791db',
      dark: '#115293',
      contrastText: '#fff',
    },
    secondary: {
      main: '#03a9f4', // Lighter blue
      light: '#67daff',
      dark: '#007ac1',
      contrastText: '#fff',
    },
    error: {
      main: '#f44336', // Material red
      light: '#e57373',
      dark: '#d32f2f',
    },
    warning: {
      main: '#ff9800', // Material orange
      light: '#ffb74d',
      dark: '#f57c00',
    },
    info: {
      main: '#2196f3', // Material blue
      light: '#64b5f6',
      dark: '#1976d2',
    },
    success: {
      main: '#4caf50', // Material green
      light: '#81c784',
      dark: '#388e3c',
    },
    background: {
      default: '#f5f7fa', // Light gray background (Apple-inspired)
      paper: '#ffffff',
    },
    text: {
      primary: '#212121', // Almost black
      secondary: '#757575', // Medium gray
      disabled: '#9e9e9e', // Light gray
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 500,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 500,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none', // Don't uppercase button text (more Apple-like)
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8, // Slightly rounded corners
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.05),0px 1px 1px 0px rgba(0,0,0,0.03),0px 1px 3px 0px rgba(0,0,0,0.1)',
    // More subtle shadows for the rest of the array...
    ...Array(23).fill('0px 3px 5px -1px rgba(0,0,0,0.05),0px 5px 8px 0px rgba(0,0,0,0.03),0px 1px 14px 0px rgba(0,0,0,0.1)'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.1)',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#1565c0',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0,0,0,0.05)',
        },
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 8px rgba(0,0,0,0.05)',
          overflow: 'hidden',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          boxShadow: '0px 2px 8px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.12)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.24)',
            },
          },
        },
      },
    },
  },
});

export default theme;