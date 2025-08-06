import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Paper } from '@mui/material';
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import type { WeightChartProps } from '../types/api';

const WeightChart: React.FC<WeightChartProps> = ({ plotData }) => {
  const { t } = useTranslation();

  return (
    <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
      <TrendingUpIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        {t('chart.title', 'Weight Progress Chart')}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t('chart.comingSoon', 'Chart visualization coming soon!')}
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2">
          {t('chart.dataPoints', 'Data points')}: {plotData?.dates?.length || 0}
        </Typography>
        <Typography variant="body2">
          {t('chart.targetWeight', 'Target weight')}: {plotData?.target_weight || 0} lbs
        </Typography>
      </Box>
    </Paper>
  );
};

export default WeightChart;
