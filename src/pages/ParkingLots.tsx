import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Calendar, Clock, Filter, MapPin, Car, Accessibility, Wifi, Coffee, Shield, Star, ChevronDown, ChevronUp, SortAsc, SortDesc } from 'lucide-react';
import { Search } from "lucide-react";

// Mock data for parking lots
const mockParkingLots = [
  {
    id: '1',
    name: 'Unity Road Parking Complex',
    address: '123 Unity Road, Ilorin',
    distance: '0.3 km',
    price: 500, // Price in Naira per hour
    rating: 4.8,
    totalRatings: 124,
    availableSpots: 15,
    totalSpots: 25,
    amenities: ['security', 'covered', 'accessible', 'cctv'],
    image: 'https://images.unsplash.com/photo-1470224114660-3f6686c562eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: '2',
    name: 'Central Market Parking',
    address: '45 Market Road, Ilorin',
    distance: '0.8 km',
    price: 300, // Price in Naira per hour
    rating: 4.2,
    totalRatings: 89,
    availableSpots: 8,
    totalSpots: 40,
    amenities: ['security', 'accessible'],
    image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: '3',
    name: 'Garden City Mall Parking',
    address: '78 Mall Avenue, Ilorin',
    distance: '1.2 km',
    price: 700, // Price in Naira per hour
    rating: 4.9,
    totalRatings: 210,
    availableSpots: 35,
    totalSpots: 120,
    amenities: ['security', 'covered', 'accessible', 'cctv', 'ev_charging', 'restrooms', 'cafe'],
    image: 'https://images.unsplash.com/photo-1582648373212-d3bd443a2024?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: '4',
    name: 'University Parking Zone',
    address: '200 Campus Road, Ilorin',
    distance: '2.5 km',
    price: 250, // Price in Naira per hour
    rating: 4.0,
    totalRatings: 67,
    availableSpots: 5,
    totalSpots: 30,
    amenities: ['security'],
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: '5',
    name: 'Stadium Parking Area',
    address: '55 Sports Complex, Ilorin',
    distance: '3.1 km',
    price: 400, // Price in Naira per hour
    rating: 4.5,
    totalRatings: 156,
    availableSpots: 50,
    totalSpots: 200,
    amenities: ['security', 'accessible', 'cctv'],
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  }
];

const ParkingLots = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [date, setDate] = useState(searchParams.get('date') || '');
  const [entryTime, setEntryTime] = useState(searchParams.get('entryTime') || '');
  const [exitTime, setExitTime] = useState(searchParams.get('exitTime') || '');
  
  const [parkingLots, setParkingLots] = useState(mockParkingLots);
  const [filteredLots, setFilteredLots] = useState(mockParkingLots);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState('distance');
  
  // Filter states
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minDistance, setMinDistance] = useState(0);
  const [maxDistance, setMaxDistance] = useState(5);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [availability, setAvailability] = useState(0); // Minimum available spots
  
  useEffect(() => {
    // In a real application, this would be an API call to fetch parking lots based on search params
    console.log("Searching for lots near:", location, "on", date, "from", entryTime, "to", exitTime);
    
    // For now, we'll just use our mock data
    setParkingLots(mockParkingLots);
    applyFilters();
  }, [location, date, entryTime, exitTime]);
  
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  const applyFilters = () => {
    let filtered = [...parkingLots];
    
    // Apply price filter
    filtered = filtered.filter(lot => lot.price >= priceRange[0] && lot.price <= priceRange[1]);
    
    // Apply distance filter
    filtered = filtered.filter(lot => {
      const distanceValue = parseFloat(lot.distance);
      return distanceValue >= minDistance && distanceValue <= maxDistance;
    });
    
    // Apply amenities filter
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(lot => 
        selectedAmenities.every(amenity => lot.amenities.includes(amenity))
      );
    }
    
    // Apply availability filter
    filtered = filtered.filter(lot => lot.availableSpots >= availability);
    
    // Apply sorting
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
  
  const handleAmenityToggle = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/parking-lots?location=${encodeURIComponent(location)}&date=${encodeURIComponent(date)}&entryTime=${encodeURIComponent(entryTime)}&exitTime=${encodeURIComponent(exitTime)}`);
    applyFilters();
  };
  
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
        {/* Search bar */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="parking-label flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Location
                  </label>
                  <Input 
                    type="text" 
                    placeholder="Enter address or landmark"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="parking-input"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="parking-label flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Date
                  </label>
                  <Input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="parking-input"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="parking-label flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Entry Time
                  </label>
                  <Input 
                    type="time" 
                    value={entryTime}
                    onChange={(e) => setEntryTime(e.target.value)}
                    className="parking-input"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="parking-label flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Exit Time
                  </label>
                  <Input 
                    type="time" 
                    value={exitTime}
                    onChange={(e) => setExitTime(e.target.value)}
                    className="parking-input"
                  />
                </div>
                
                <div className="md:col-span-5">
                  <Button type="submit" className="w-full bg-parking-secondary hover:bg-parking-primary">
                    <Search className="mr-2 h-5 w-5" />
                    Update Search
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        {/* Results container */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter sidebar (mobile toggle) */}
          <div className="w-full mb-4 lg:hidden">
            <Button 
              onClick={toggleFilter} 
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
          
          {/* Filter sidebar */}
          <div className={`lg:w-1/4 ${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
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
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="security"
                        checked={selectedAmenities.includes('security')}
                        onChange={() => handleAmenityToggle('security')}
                        className="mr-2"
                      />
                      <label htmlFor="security" className="text-sm">Security Guard</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="cctv"
                        checked={selectedAmenities.includes('cctv')}
                        onChange={() => handleAmenityToggle('cctv')}
                        className="mr-2"
                      />
                      <label htmlFor="cctv" className="text-sm">CCTV Surveillance</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="covered"
                        checked={selectedAmenities.includes('covered')}
                        onChange={() => handleAmenityToggle('covered')}
                        className="mr-2"
                      />
                      <label htmlFor="covered" className="text-sm">Covered Parking</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="accessible"
                        checked={selectedAmenities.includes('accessible')}
                        onChange={() => handleAmenityToggle('accessible')}
                        className="mr-2"
                      />
                      <label htmlFor="accessible" className="text-sm">Accessible Spots</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="ev_charging"
                        checked={selectedAmenities.includes('ev_charging')}
                        onChange={() => handleAmenityToggle('ev_charging')}
                        className="mr-2"
                      />
                      <label htmlFor="ev_charging" className="text-sm">EV Charging</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="restrooms"
                        checked={selectedAmenities.includes('restrooms')}
                        onChange={() => handleAmenityToggle('restrooms')}
                        className="mr-2"
                      />
                      <label htmlFor="restrooms" className="text-sm">Restrooms</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="cafe"
                        checked={selectedAmenities.includes('cafe')}
                        onChange={() => handleAmenityToggle('cafe')}
                        className="mr-2"
                      />
                      <label htmlFor="cafe" className="text-sm">Cafe/Restaurant</label>
                    </div>
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
          </div>
          
          {/* Results list */}
          <div className="lg:w-3/4">
            <h2 className="text-2xl font-bold mb-4">Available Parking Lots</h2>
            
            {filteredLots.length === 0 ? (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-700">No parking lots match your criteria</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters or search for a different location.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLots.map((lot) => (
                  <Card key={lot.id} className="parking-card overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 h-48 md:h-auto relative">
                        <img 
                          src={lot.image} 
                          alt={lot.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4 md:p-6 md:w-2/3">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div>
                            <h3 className="text-xl font-bold">{lot.name}</h3>
                            <div className="flex items-center mt-1">
                              <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                              <p className="text-gray-600 text-sm">{lot.address}</p>
                            </div>
                            <div className="flex items-center mt-1">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              <p className="text-gray-600 text-sm">
                                {lot.rating} ({lot.totalRatings} reviews)
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 md:mt-0 text-right">
                            <p className="text-2xl font-bold text-parking-primary">₦{lot.price}</p>
                            <p className="text-gray-500 text-sm">per hour</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:justify-between mt-4">
                          <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
                            {lot.amenities.includes('security') && (
                              <div className="flex items-center bg-gray-100 px-2 py-1 rounded text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                Security
                              </div>
                            )}
                            {lot.amenities.includes('covered') && (
                              <div className="flex items-center bg-gray-100 px-2 py-1 rounded text-xs">
                                <Car className="h-3 w-3 mr-1" />
                                Covered
                              </div>
                            )}
                            {lot.amenities.includes('accessible') && (
                              <div className="flex items-center bg-gray-100 px-2 py-1 rounded text-xs">
                                <Accessibility className="h-3 w-3 mr-1" />
                                Accessible
                              </div>
                            )}
                            {lot.amenities.includes('cafe') && (
                              <div className="flex items-center bg-gray-100 px-2 py-1 rounded text-xs">
                                <Coffee className="h-3 w-3 mr-1" />
                                Cafe
                              </div>
                            )}
                            {lot.amenities.includes('wifi') && (
                              <div className="flex items-center bg-gray-100 px-2 py-1 rounded text-xs">
                                <Wifi className="h-3 w-3 mr-1" />
                                WiFi
                              </div>
                            )}
                            {lot.amenities.length > 5 && (
                              <div className="flex items-center bg-gray-100 px-2 py-1 rounded text-xs">
                                +{lot.amenities.length - 5} more
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="flex flex-col items-center">
                              <div className={getAvailabilityClass(lot.availableSpots, lot.totalSpots)}>
                                {lot.availableSpots}/{lot.totalSpots} spots
                              </div>
                              <p className="text-gray-500 text-xs mt-1">{lot.distance} away</p>
                            </div>
                            <Button 
                              onClick={() => navigate(`/parking-lot/${lot.id}`)}
                              className="bg-parking-secondary hover:bg-parking-primary"
                            >
                              Reserve
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
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
