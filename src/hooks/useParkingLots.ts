
import { useState, useEffect } from 'react';
import { mockParkingLots, ParkingLot } from '@/utils/parkingData';

export const useParkingLots = (
  priceRange: number[],
  minDistance: number,
  maxDistance: number,
  selectedAmenities: string[],
  availability: number,
  sortOption: string
) => {
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>(mockParkingLots);
  const [filteredLots, setFilteredLots] = useState<ParkingLot[]>(mockParkingLots);

  const applyFilters = () => {
    let filtered = [...parkingLots];
    
    filtered = filtered.filter(lot => lot.price >= priceRange[0] && lot.price <= priceRange[1]);
    
    filtered = filtered.filter(lot => {
      const distanceValue = parseFloat(lot.distance);
      return distanceValue >= minDistance && distanceValue <= maxDistance;
    });
    
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(lot => 
        selectedAmenities.every(amenity => lot.amenities.includes(amenity))
      );
    }
    
    filtered = filtered.filter(lot => lot.availableSpots >= availability);
    
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'availability':
          return b.availableSpots - a.availableSpots;
        case 'distance':
        default:
          return parseFloat(a.distance) - parseFloat(b.distance);
      }
    });
    
    setFilteredLots(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [priceRange, minDistance, maxDistance, selectedAmenities, availability, sortOption]);

  return { parkingLots, filteredLots };
};
