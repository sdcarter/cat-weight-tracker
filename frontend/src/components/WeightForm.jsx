import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { format } from 'date-fns';

const WeightForm = ({ onSubmit, catId }) => {
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
        <CardTitle>Record Weight</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
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
            <Label htmlFor="user_weight">Your Weight (kg)</Label>
            <Input
              id="user_weight"
              name="user_weight"
              type="number"
              step="0.1"
              min="0"
              value={formData.user_weight}
              onChange={handleChange}
              required
              placeholder="Enter your weight"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="combined_weight">Combined Weight (kg)</Label>
            <Input
              id="combined_weight"
              name="combined_weight"
              type="number"
              step="0.1"
              min="0"
              value={formData.combined_weight}
              onChange={handleChange}
              required
              placeholder="Enter combined weight (you + cat)"
            />
          </div>
          {calculatedCatWeight && (
            <div className="p-3 bg-secondary rounded-md">
              <p className="text-sm font-medium">
                Calculated Cat Weight: <span className="font-bold">{calculatedCatWeight} kg</span>
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit">Record Weight</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default WeightForm;