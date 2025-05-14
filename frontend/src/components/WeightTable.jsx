import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from './ui/table';
import { Button } from './ui/button';
import { format } from 'date-fns';

const WeightTable = ({ weights, onDelete }) => {
  if (!weights || weights.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No weight records found.</p>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Your Weight (kg)</TableHead>
            <TableHead>Combined Weight (kg)</TableHead>
            <TableHead>Cat Weight (kg)</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {weights.map((weight) => (
            <TableRow key={weight.id}>
              <TableCell>{format(new Date(weight.date), 'MMM d, yyyy')}</TableCell>
              <TableCell>{weight.user_weight.toFixed(1)}</TableCell>
              <TableCell>{weight.combined_weight.toFixed(1)}</TableCell>
              <TableCell className="font-medium">{weight.cat_weight.toFixed(1)}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDelete(weight.id)}
                  className="text-destructive hover:text-destructive"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WeightTable;