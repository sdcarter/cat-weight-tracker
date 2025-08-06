import type React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { Delete as DeleteIcon, Timeline as TimelineIcon } from '@mui/icons-material';
import type { WeightTableProps } from '../types/api';

const WeightTable: React.FC<WeightTableProps> = ({ weights, onDeleteWeight }) => {
  const { t } = useTranslation();

  if (!weights || weights.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <TimelineIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          {t('weights.noRecords', 'No weight records found')}
        </Typography>
        <Typography variant="body2" color="text.disabled">
          {t('weights.addFirstRecord', 'Add your first weight record to track progress')}
        </Typography>
      </Box>
    );
  }

  const calculateCatWeight = (userWeight: number, combinedWeight: number): number => {
    return Math.max(0, combinedWeight - userWeight);
  };

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('weights.date', 'Date')}</TableCell>
            <TableCell align="right">{t('weights.userWeight', 'Your Weight')}</TableCell>
            <TableCell align="right">{t('weights.combinedWeight', 'Combined Weight')}</TableCell>
            <TableCell align="right">{t('weights.catWeight', 'Cat Weight')}</TableCell>
            <TableCell align="center">{t('common.actions', 'Actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {weights.map((record) => {
            const catWeight = calculateCatWeight(record.user_weight, record.combined_weight);
            return (
              <TableRow key={record.id} hover>
                <TableCell>
                  {new Date(record.date).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <Chip 
                    label={`${record.user_weight} lbs`} 
                    size="small" 
                    variant="outlined" 
                  />
                </TableCell>
                <TableCell align="right">
                  <Chip 
                    label={`${record.combined_weight} lbs`} 
                    size="small" 
                    variant="outlined" 
                  />
                </TableCell>
                <TableCell align="right">
                  <Chip 
                    label={`${catWeight.toFixed(1)} lbs`} 
                    size="small" 
                    color="primary"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => onDeleteWeight(record.id)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WeightTable;
