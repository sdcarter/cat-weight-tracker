import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';

const CatList = ({ cats, onSelect, onEdit, onDelete, selectedCatId }) => {
  if (!cats || cats.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No cats found. Add a cat to get started.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cats.map((cat) => (
        <Card 
          key={cat.id} 
          className={`cursor-pointer ${selectedCatId === cat.id ? 'border-primary border-2' : ''}`}
          onClick={() => onSelect(cat.id)}
        >
          <CardHeader>
            <CardTitle>{cat.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Target Weight: <span className="font-medium">{cat.target_weight} kg</span></p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(cat);
              }}
            >
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(cat.id);
              }}
            >
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default CatList;