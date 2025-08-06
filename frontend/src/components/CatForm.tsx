import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { CatFormProps, FormErrors } from '../types/api';

const CatForm: React.FC<CatFormProps> = ({ 
  open, 
  onSubmit, 
  initialData = null, 
  onClose 
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    target_weight: initialData?.target_weight?.toString() || '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = t('validation.required', 'This field is required');
    } else if (formData.name.trim().length > 100) {
      newErrors.name = t('validation.maxLength', 'Name must be less than 100 characters');
    }

    // Validate target weight
    if (!formData.target_weight) {
      newErrors.target_weight = t('validation.required', 'This field is required');
    } else {
      const weight = parseFloat(formData.target_weight);
      if (isNaN(weight)) {
        newErrors.target_weight = t('validation.number', 'Must be a valid number');
      } else if (weight <= 0) {
        newErrors.target_weight = t('validation.positive', 'Must be greater than 0');
      } else if (weight > 50) {
        newErrors.target_weight = t('validation.maxWeight', 'Weight must be less than 50 lbs/kg');
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
        name: formData.name.trim(),
        target_weight: parseFloat(formData.target_weight),
      });
      
      // Reset form
      setFormData({ name: '', target_weight: '' });
      setErrors({});
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = (): void => {
    setFormData({ name: '', target_weight: '' });
    setErrors({});
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 4 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h2">
            {initialData 
              ? t('cats.edit', 'Edit Cat') 
              : t('cats.add', 'Add New Cat')
            }
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              name="name"
              label={t('cats.name', 'Cat Name')}
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              required
              variant="outlined"
              placeholder={t('cats.namePlaceholder', 'Enter your cat\'s name')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              name="target_weight"
              label={t('cats.targetWeight', 'Target Weight')}
              value={formData.target_weight}
              onChange={handleChange}
              error={!!errors.target_weight}
              helperText={errors.target_weight || t('cats.weightUnit', 'Weight in lbs or kg')}
              fullWidth
              required
              type="number"
              variant="outlined"
              placeholder="5.0"
              inputProps={{
                step: 0.1,
                min: 0.1,
                max: 50,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={handleClose}
            variant="text"
            sx={{ mr: 1 }}
          >
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ borderRadius: 3, minWidth: 100 }}
          >
            {isSubmitting 
              ? t('common.saving', 'Saving...') 
              : initialData 
                ? t('common.update', 'Update')
                : t('common.add', 'Add')
            }
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CatForm;
