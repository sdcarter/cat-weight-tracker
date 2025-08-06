import { type ThemeOptions, createTheme } from '@mui/material/styles';

// Material 3 Color Tokens
const material3Colors = {
  primary: {
    main: '#6750A4',
    light: '#EADDFF',
    dark: '#21005D',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#625B71',
    light: '#E8DEF8',
    dark: '#1D192B',
    contrastText: '#FFFFFF',
  },
  tertiary: {
    main: '#7D5260',
    light: '#FFD8E4',
    dark: '#31111D',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#BA1A1A',
    light: '#FFDAD6',
    dark: '#410002',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#FF8F00',
    light: '#FFF3C4',
    dark: '#3E2723',
    contrastText: '#000000',
  },
  info: {
    main: '#2196F3',
    light: '#E3F2FD',
    dark: '#0D47A1',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#4CAF50',
    light: '#E8F5E8',
    dark: '#1B5E20',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#FFFBFE',
    paper: '#FFFBFE',
  },
  surface: {
    main: '#FFFBFE',
    variant: '#E7E0EC',
    container: '#F3EDF7',
    containerHigh: '#ECE6F0',
    containerHighest: '#E6E0E9',
  },
  outline: {
    main: '#79747E',
    variant: '#CAC4D0',
  },
  text: {
    primary: '#1C1B1F',
    secondary: '#49454F',
    disabled: '#79747E',
  },
};

// Material 3 Typography Scale
const material3Typography = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontSize: '3.5rem',
    fontWeight: 400,
    lineHeight: 1.167,
    letterSpacing: '-0.01562em',
  },
  h2: {
    fontSize: '2.25rem',
    fontWeight: 400,
    lineHeight: 1.2,
    letterSpacing: '-0.00833em',
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 400,
    lineHeight: 1.167,
    letterSpacing: '0em',
  },
  h4: {
    fontSize: '1.25rem',
    fontWeight: 400,
    lineHeight: 1.235,
    letterSpacing: '0.00735em',
  },
  h5: {
    fontSize: '1.125rem',
    fontWeight: 400,
    lineHeight: 1.334,
    letterSpacing: '0em',
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.6,
    letterSpacing: '0.0075em',
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.00938em',
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.43,
    letterSpacing: '0.01071em',
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.75,
    letterSpacing: '0.02857em',
    textTransform: 'none' as const,
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 1.66,
    letterSpacing: '0.03333em',
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 2.66,
    letterSpacing: '0.08333em',
    textTransform: 'uppercase' as const,
  },
};

// Material 3 Shape System
const material3Shape = {
  borderRadius: 12, // Medium corner radius
};

// Material 3 Component Overrides
const material3Components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 20, // Full corner radius for buttons
        textTransform: 'none' as const,
        fontWeight: 500,
        padding: '10px 24px',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
        },
      },
      contained: {
        '&:hover': {
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
        '&:hover': {
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 4, // Small corner radius for text fields
        },
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 28, // Extra large corner radius for dialogs
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 8, // Small corner radius for chips
      },
    },
  },
  MuiFab: {
    styleOverrides: {
      root: {
        borderRadius: 16, // Large corner radius for FABs
      },
    },
  },
};

// Create Material 3 Theme
export const material3Theme = createTheme({
  palette: {
    mode: 'light',
    ...material3Colors,
  },
  typography: material3Typography,
  shape: material3Shape,
  components: material3Components,
  spacing: 8, // 8px base spacing unit
} as ThemeOptions);

// Dark theme variant
export const material3DarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#D0BCFF',
      light: '#EADDFF',
      dark: '#4F378B',
      contrastText: '#21005D',
    },
    secondary: {
      main: '#CCC2DC',
      light: '#E8DEF8',
      dark: '#4A4458',
      contrastText: '#1D192B',
    },
    background: {
      default: '#1C1B1F',
      paper: '#1C1B1F',
    },
    surface: {
      main: '#1C1B1F',
      variant: '#49454F',
      container: '#211F26',
      containerHigh: '#2B2930',
      containerHighest: '#36343B',
    },
    text: {
      primary: '#E6E0E9',
      secondary: '#CAC4D0',
      disabled: '#79747E',
    },
  },
  typography: material3Typography,
  shape: material3Shape,
  components: material3Components,
  spacing: 8,
} as ThemeOptions);

export default material3Theme;
