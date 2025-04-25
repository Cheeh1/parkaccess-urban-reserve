
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Car, Accessibility, Wifi, Coffee, Shield, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ParkingLocationMap from './ParkingLocationMap';

interface ParkingLotDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  lot: {
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
  };
}

const ParkingLotDetails = ({ isOpen, onClose, lot }: ParkingLotDetailsProps) => {
  // Generate coordinates based on the lot id (mock data)
  const coordinates = {
    lng: 4.5418 + (parseInt(lot.id) * 0.002),
    lat: 8.5433 + (parseInt(lot.id) * 0.002)
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{lot.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <img 
              src={lot.image} 
              alt={lot.name}
              className="w-full h-48 object-cover rounded-lg"
            />
            
            <div className="space-y-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                <p className="text-gray-600">{lot.address}</p>
              </div>
              
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                <p className="text-gray-600">
                  {lot.rating} ({lot.totalRatings} reviews)
                </p>
              </div>
              
              <div className="flex items-center">
                <Car className="h-5 w-5 text-gray-400 mr-2" />
                <p className="text-gray-600">
                  {lot.availableSpots} spots available out of {lot.totalSpots}
                </p>
              </div>
              
              <div className="text-2xl font-bold text-parking-primary">
                ₦{lot.price} <span className="text-sm text-gray-500">per hour</span>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {lot.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      {amenity === 'security' && <Shield className="h-4 w-4 mr-1" />}
                      {amenity === 'covered' && <Car className="h-4 w-4 mr-1" />}
                      {amenity === 'accessible' && <Accessibility className="h-4 w-4 mr-1" />}
                      {amenity === 'cafe' && <Coffee className="h-4 w-4 mr-1" />}
                      {amenity === 'wifi' && <Wifi className="h-4 w-4 mr-1" />}
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="h-[400px]">
            <ParkingLocationMap location={{ name: lot.name, address: lot.address, coordinates: [coordinates.lng, coordinates.lat] }} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParkingLotDetails;
