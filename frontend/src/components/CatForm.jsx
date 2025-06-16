import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';

const CatForm = ({ onSubmit, initialData = null }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    target_weight: initialData?.target_weight || '',
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
      target_weight: parseFloat(formData.target_weight),
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{initialData ? t('cats.editCat') : t('cats.addCat')}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('cats.name')}</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder={t('cats.enterName')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target_weight">{t('cats.targetWeight')}</Label>
            <Input
              id="target_weight"
              name="target_weight"
              type="number"
              step="0.1"
              min="0"
              value={formData.target_weight}
              onChange={handleChange}
              required
              placeholder={t('cats.enterTargetWeight')}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit">{initialData ? t('cats.update') : t('cats.add')}</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CatForm;