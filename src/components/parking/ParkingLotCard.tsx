
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Car, Accessibility, Wifi, Coffee, Shield, Star } from 'lucide-react';

interface ParkingLot {
  id: string;
  name: string;
  address: string;
  distance: string;
  price: number;
  rating: number;
  totalRatings: number;
  availableSpots: number;
  totalSpots: number;
  amenities: string[];
  image: string;
}

interface ParkingLotCardProps {
  lot: ParkingLot;
  getAvailabilityClass: (available: number, total: number) => string;
}

const ParkingLotCard = ({ lot, getAvailabilityClass }: ParkingLotCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="parking-card overflow-hidden">
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
  );
};

export default ParkingLotCard;
