
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ParkingLotHeader from './ParkingLotHeader';
import ParkingLotDetails from './ParkingLotDetails';

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
        <ParkingLotHeader 
          name={name} 
          address={address} 
          price={price} 
        />
        
        <ParkingLotDetails 
          availableSpots={availableSpots}
          totalSpots={totalSpots}
          distance={distance}
        />
        
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
