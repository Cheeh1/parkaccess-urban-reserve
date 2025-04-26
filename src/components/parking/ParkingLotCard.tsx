
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ParkingLotCardProps {
  id: string;
  name: string;
  address: string;
  price: number;
  availableSpots: number;
  totalSpots: number;
  distance: number;
  spotId: string;
}

const ParkingLotCard = ({
  id,
  name,
  address,
  price,
  availableSpots,
  totalSpots,
  distance,
  spotId,
}: ParkingLotCardProps) => {
  const navigate = useNavigate();
  
  const handleReserve = () => {
    const reservation = {
      parkingLotName: name,
      spotId: spotId,
      date: new Date().toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '12:00',
      totalPrice: price,
    };
    
    navigate('/checkout', { state: { reservation } });
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-sm text-muted-foreground">{address}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">₦{price}</p>
            <p className="text-sm text-muted-foreground">per hour</p>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <p className="text-sm">
            <span className="text-muted-foreground">Available spots: </span>
            <span className="font-medium">{availableSpots}/{totalSpots}</span>
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Distance: </span>
            <span className="font-medium">{distance.toFixed(1)} km</span>
          </p>
        </div>
        
        <Button 
          className="w-full" 
          onClick={handleReserve}
          disabled={availableSpots === 0}
        >
          {availableSpots === 0 ? 'No Spots Available' : 'Reserve Spot'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ParkingLotCard;
