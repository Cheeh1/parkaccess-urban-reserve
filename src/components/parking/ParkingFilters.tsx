import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ParkingFiltersProps {
  minPrice: number | undefined;
  setMinPrice: (price: number | undefined) => void;
  maxPrice: number | undefined;
  setMaxPrice: (price: number | undefined) => void;
}

const ParkingFilters = ({
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
}: ParkingFiltersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="minPrice">Minimum Price (₦/hour)</Label>
          <Input
            id="minPrice"
            type="number"
            placeholder="Min price"
            value={minPrice || ''}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : undefined;
              setMinPrice(value);
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxPrice">Maximum Price (₦/hour)</Label>
          <Input
            id="maxPrice"
            type="number"
            placeholder="Max price"
            value={maxPrice || ''}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : undefined;
              setMaxPrice(value);
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ParkingFilters;
