import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Paper,
  Box,
  Typography,
  Tabs,
  Tab,
  Fade,
} from '@mui/material';
import { Pets as PetsIcon } from '@mui/icons-material';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useAuth } from '../context/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fade in={true} timeout={300}>
          <Box sx={{ pt: 3 }}>
            {children}
          </Box>
        </Fade>
      )}
    </div>
  );
}

const AuthScreen: React.FC = () => {
  const { t } = useTranslation();
  const { registrationEnabled } = useAuth();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            bgcolor: 'background.paper',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              py: 4,
              px: 3,
              textAlign: 'center',
            }}
          >
            <PetsIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              {t('app.title', 'Cat Weight Tracker')}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {t('auth.subtitle', 'Track your feline friend\'s health journey')}
            </Typography>
          </Box>

          {/* Auth Forms */}
          <Box sx={{ p: 0 }}>
            {registrationEnabled ? (
              <>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="fullWidth"
                  sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 500,
                    },
                  }}
                >
                  <Tab label={t('auth.signIn', 'Sign In')} />
                  <Tab label={t('auth.signUp', 'Sign Up')} />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                  <Box sx={{ p: 3 }}>
                    <LoginForm />
                  </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  <Box sx={{ p: 3 }}>
                    <RegisterForm />
                  </Box>
                </TabPanel>
              </>
            ) : (
              <Box sx={{ p: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom textAlign="center">
                  {t('auth.signIn', 'Sign In')}
                </Typography>
                <LoginForm />
              </Box>
            )}
          </Box>
        </Paper>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" sx={{ color: 'white', opacity: 0.8 }}>
            {t('auth.footer', 'Keep your cat healthy and happy')}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthScreen;
