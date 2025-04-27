
import React from 'react';
import ParkingLotCard from './ParkingLotCard';
import NoParkingLots from './NoParkingLots';
import { ParkingLot } from '@/utils/parkingData';

interface ParkingLotsListProps {
  lots: ParkingLot[];
  getAvailabilityClass: (available: number, total: number) => string;
}

const ParkingLotsList = ({ lots, getAvailabilityClass }: ParkingLotsListProps) => {
  if (lots.length === 0) {
    return <NoParkingLots />;
  }

  return (
    <div className="space-y-4">
      {lots.map((lot) => (
        <ParkingLotCard
          key={lot.id}
          id={lot.id}
          name={lot.name}
          address={lot.address}
          price={lot.price}
          availableSpots={lot.availableSpots}
          totalSpots={lot.totalSpots}
          distance={parseFloat(lot.distance)}
          spotId={lot.spotId}
          image={lot.image}
        />
      ))}
    </div>
  );
};

export default ParkingLotsList;
