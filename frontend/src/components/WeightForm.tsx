import type React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { Scale as ScaleIcon } from '@mui/icons-material';
import type { WeightFormProps, FormErrors } from '../types/api';

const WeightForm: React.FC<WeightFormProps> = ({ onSubmit }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    user_weight: '',
    combined_weight: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.date) {
      newErrors.date = t('validation.required', 'This field is required');
    }

    if (!formData.user_weight) {
      newErrors.user_weight = t('validation.required', 'This field is required');
    } else {
      const weight = Number.parseFloat(formData.user_weight);
      if (isNaN(weight) || weight <= 0) {
        newErrors.user_weight = t('validation.positiveNumber', 'Must be a positive number');
      }
    }

    if (!formData.combined_weight) {
      newErrors.combined_weight = t('validation.required', 'This field is required');
    } else {
      const weight = Number.parseFloat(formData.combined_weight);
      if (isNaN(weight) || weight <= 0) {
        newErrors.combined_weight = t('validation.positiveNumber', 'Must be a positive number');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        date: formData.date,
        user_weight: Number.parseFloat(formData.user_weight),
        combined_weight: Number.parseFloat(formData.combined_weight),
      });
      
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        user_weight: '',
        combined_weight: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <ScaleIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="h3">
            {t('weights.addRecord', 'Add Weight Record')}
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                name="date"
                label={t('weights.date', 'Date')}
                type="date"
                value={formData.date}
                onChange={handleChange}
                error={!!errors.date}
                helperText={errors.date}
                fullWidth
                required
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                name="user_weight"
                label={t('weights.userWeight', 'Your Weight')}
                type="number"
                value={formData.user_weight}
                onChange={handleChange}
                error={!!errors.user_weight}
                helperText={errors.user_weight || t('weights.userWeightHelp', 'Your weight alone')}
                fullWidth
                required
                variant="outlined"
                placeholder="150.0"
                inputProps={{
                  step: 0.1,
                  min: 0.1,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                name="combined_weight"
                label={t('weights.combinedWeight', 'Combined Weight')}
                type="number"
                value={formData.combined_weight}
                onChange={handleChange}
                error={!!errors.combined_weight}
                helperText={errors.combined_weight || t('weights.combinedWeightHelp', 'You + cat weight')}
                fullWidth
                required
                variant="outlined"
                placeholder="155.0"
                inputProps={{
                  step: 0.1,
                  min: 0.1,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{ borderRadius: 3, px: 4 }}
                >
                  {isSubmitting 
                    ? t('common.saving', 'Saving...') 
                    : t('weights.addRecord', 'Add Record')
                  }
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeightForm;
