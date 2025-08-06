import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Typography } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

const ProfileForm: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ textAlign: 'center', py: 4 }}>
        <PersonIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          {t('profile.form', 'Profile Settings')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('profile.comingSoon', 'Profile management coming soon!')}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
