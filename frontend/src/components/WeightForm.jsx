import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { format } from 'date-fns';

const WeightForm = ({ onSubmit }) => {
  const { t } = useTranslation();
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const [formData, setFormData] = useState({
    date: today,
    user_weight: '',
    combined_weight: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      user_weight: parseFloat(formData.user_weight),
      combined_weight: parseFloat(formData.combined_weight),
    });
    
    // Reset form after submission
    setFormData({
      date: today,
      user_weight: '',
      combined_weight: '',
    });
  };

  const calculatedCatWeight = 
    formData.user_weight && formData.combined_weight 
      ? (parseFloat(formData.combined_weight) - parseFloat(formData.user_weight)).toFixed(1)
      : '';

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t('weights.recordWeight')}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">{t('weights.date')}</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="user_weight">{t('weights.userWeight')}</Label>
            <Input
              id="user_weight"
              name="user_weight"
              type="number"
              step="0.1"
              min="0"
              value={formData.user_weight}
              onChange={handleChange}
              required
              placeholder={t('weights.enterYourWeight')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="combined_weight">{t('weights.combinedWeight')}</Label>
            <Input
              id="combined_weight"
              name="combined_weight"
              type="number"
              step="0.1"
              min="0"
              value={formData.combined_weight}
              onChange={handleChange}
              required
              placeholder={t('weights.enterCombinedWeight')}
            />
          </div>
          {calculatedCatWeight && (
            <div className="p-3 bg-secondary rounded-md">
              <p className="text-sm font-medium">
                {t('weights.calculatedCatWeight')}: <span className="font-bold">{calculatedCatWeight} kg</span>
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit">{t('weights.recordWeight')}</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default WeightForm;