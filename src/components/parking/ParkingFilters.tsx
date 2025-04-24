
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface ParkingFiltersProps {
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  minDistance: number;
  setMinDistance: (value: number) => void;
  maxDistance: number;
  setMaxDistance: (value: number) => void;
  selectedAmenities: string[];
  handleAmenityToggle: (amenity: string) => void;
  availability: number;
  setAvailability: (value: number) => void;
  sortOption: string;
  setSortOption: (value: string) => void;
}

const ParkingFilters = ({
  priceRange,
  setPriceRange,
  minDistance,
  setMinDistance,
  maxDistance,
  setMaxDistance,
  selectedAmenities,
  handleAmenityToggle,
  availability,
  setAvailability,
  sortOption,
  setSortOption,
}: ParkingFiltersProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Filter Results</h3>
        
        {/* Price Range */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Price per hour (₦)</h4>
          <Slider
            defaultValue={[0, 1000]}
            max={1000}
            step={50}
            value={priceRange}
            onValueChange={setPriceRange}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>₦{priceRange[0]}</span>
            <span>₦{priceRange[1]}</span>
          </div>
        </div>
        
        {/* Distance */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Distance (km)</h4>
          <div className="flex items-center gap-2 mb-2">
            <Input 
              type="number" 
              min="0"
              max="10"
              step="0.1"
              value={minDistance}
              onChange={(e) => setMinDistance(parseFloat(e.target.value))}
              className="w-20"
            />
            <span>to</span>
            <Input 
              type="number" 
              min="0"
              max="10"
              step="0.1"
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
              className="w-20"
            />
          </div>
        </div>
        
        {/* Amenities */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Amenities</h4>
          <div className="space-y-2">
            {['security', 'cctv', 'covered', 'accessible', 'ev_charging', 'restrooms', 'cafe'].map((amenity) => (
              <div key={amenity} className="flex items-center">
                <input
                  type="checkbox"
                  id={amenity}
                  checked={selectedAmenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="mr-2"
                />
                <label htmlFor={amenity} className="text-sm capitalize">
                  {amenity.replace('_', ' ')}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Availability */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Minimum Availability</h4>
          <Input 
            type="number" 
            min="0"
            value={availability}
            onChange={(e) => setAvailability(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        
        {/* Sort Options */}
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Sort By</h4>
          <select 
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="distance">Distance (Nearest)</option>
            <option value="price_low">Price (Low to High)</option>
            <option value="price_high">Price (High to Low)</option>
            <option value="rating">Rating (Highest)</option>
            <option value="availability">Availability (Most)</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParkingFilters;
