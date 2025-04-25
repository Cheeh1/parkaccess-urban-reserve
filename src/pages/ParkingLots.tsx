
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ParkingSearch from '@/components/parking/ParkingSearch';
import ParkingFilters from '@/components/parking/ParkingFilters';
import ParkingLotsList from '@/components/parking/ParkingLotsList';
import FilterToggleButton from '@/components/parking/FilterToggleButton';
import { useParkingLots } from '@/hooks/useParkingLots';

const ParkingLots = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [date, setDate] = useState(searchParams.get('date') || '');
  const [entryTime, setEntryTime] = useState(searchParams.get('entryTime') || '');
  const [exitTime, setExitTime] = useState(searchParams.get('exitTime') || '');
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState('distance');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minDistance, setMinDistance] = useState(0);
  const [maxDistance, setMaxDistance] = useState(5);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [availability, setAvailability] = useState(0);
  
  const { filteredLots } = useParkingLots(
    priceRange,
    minDistance,
    maxDistance,
    selectedAmenities,
    availability,
    sortOption
  );
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/parking-lots?location=${encodeURIComponent(location)}&date=${encodeURIComponent(date)}&entryTime=${encodeURIComponent(entryTime)}&exitTime=${encodeURIComponent(exitTime)}`);
  };
  
  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(selectedAmenities.includes(amenity) 
      ? selectedAmenities.filter(a => a !== amenity)
      : [...selectedAmenities, amenity]
    );
  };
  
  const getAvailabilityClass = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return 'availability-high';
    if (percentage > 20) return 'availability-medium';
    return 'availability-low';
  };
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ParkingSearch
          location={location}
          setLocation={setLocation}
          date={date}
          setDate={setDate}
          entryTime={entryTime}
          setEntryTime={setEntryTime}
          exitTime={exitTime}
          setExitTime={setExitTime}
          handleSearch={handleSearch}
        />
        
        <div className="flex flex-col lg:flex-row gap-6">
          <FilterToggleButton 
            isFilterOpen={isFilterOpen}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          />
          
          <div className={`lg:w-1/4 ${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
            <ParkingFilters
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              minDistance={minDistance}
              setMinDistance={setMinDistance}
              maxDistance={maxDistance}
              setMaxDistance={setMaxDistance}
              selectedAmenities={selectedAmenities}
              handleAmenityToggle={handleAmenityToggle}
              availability={availability}
              setAvailability={setAvailability}
              sortOption={sortOption}
              setSortOption={setSortOption}
            />
          </div>
          
          <div className="lg:w-3/4">
            <h2 className="text-2xl font-bold mb-4">Available Parking Lots</h2>
            <ParkingLotsList 
              lots={filteredLots}
              getAvailabilityClass={getAvailabilityClass}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ParkingLots;
