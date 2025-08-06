import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Alert } from '@mui/material';

const RegisterForm: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Alert severity="info" sx={{ borderRadius: 2 }}>
        <Typography variant="body1">
          {t('auth.registrationDisabled', 'Registration is currently disabled')}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {t('auth.contactAdmin', 'Please contact your administrator for access')}
        </Typography>
      </Alert>
    </Box>
  );
};

export default RegisterForm;
