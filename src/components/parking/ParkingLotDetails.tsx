
import React from 'react';

interface ParkingLotDetailsProps {
  availableSpots: number;
  totalSpots: number;
  distance: number;
}

const ParkingLotDetails = ({ availableSpots, totalSpots, distance }: ParkingLotDetailsProps) => {
  return (
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
  );
};

export default ParkingLotDetails;
