
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import ParkingMap from '@/components/parking/ParkingMap';
import ParkingSearch from '@/components/parking/ParkingSearch';
import ParkingFilters from '@/components/parking/ParkingFilters';
import ParkingLotCard from '@/components/parking/ParkingLotCard';
import { mockParkingLots, ParkingLot } from '@/utils/parkingData';

const ParkingLots = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [date, setDate] = useState(searchParams.get('date') || '');
  const [entryTime, setEntryTime] = useState(searchParams.get('entryTime') || '');
  const [exitTime, setExitTime] = useState(searchParams.get('exitTime') || '');
  
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>(mockParkingLots);
  const [filteredLots, setFilteredLots] = useState<ParkingLot[]>(mockParkingLots);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState('distance');
  
  // Filter states
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minDistance, setMinDistance] = useState(0);
  const [maxDistance, setMaxDistance] = useState(5);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [availability, setAvailability] = useState(0);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/parking-lots?location=${encodeURIComponent(location)}&date=${encodeURIComponent(date)}&entryTime=${encodeURIComponent(entryTime)}&exitTime=${encodeURIComponent(exitTime)}`);
    applyFilters();
  };
  
  const handleAmenityToggle = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };
  
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
    console.log("Searching for lots near:", location, "on", date, "from", entryTime, "to", exitTime);
    setParkingLots(mockParkingLots);
    applyFilters();
  }, [location, date, entryTime, exitTime]);
  
  useEffect(() => {
    applyFilters();
  }, [priceRange, minDistance, maxDistance, selectedAmenities, availability, sortOption]);
  
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
          {/* Filter toggle (mobile) */}
          <div className="w-full mb-4 lg:hidden">
            <Button 
              onClick={() => setIsFilterOpen(!isFilterOpen)} 
              variant="outline" 
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Filter & Sort
              </div>
              {isFilterOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </Button>
          </div>
          
          {/* Filters sidebar */}
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
          
          {/* Results list and map */}
          <div className="lg:w-3/4">
            <h2 className="text-2xl font-bold mb-4">Available Parking Lots</h2>
            
            <div className="mb-6">
              <ParkingMap locations={filteredLots} />
            </div>
            
            {filteredLots.length === 0 ? (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-700">No parking lots match your criteria</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters or search for a different location.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLots.map((lot) => (
                  <ParkingLotCard
                    key={lot.id}
                    lot={lot}
                    getAvailabilityClass={getAvailabilityClass}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ParkingLots;
