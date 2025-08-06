import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Typography, Card, CardContent, Box } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <PersonIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              {t('profile.title', 'User Profile')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('profile.comingSoon', 'Profile management coming soon!')}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ProfilePage;
