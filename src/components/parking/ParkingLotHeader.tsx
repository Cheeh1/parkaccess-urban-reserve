
import React from 'react';

interface ParkingLotHeaderProps {
  name: string;
  address: string;
  price: number;
}

const ParkingLotHeader = ({ name, address, price }: ParkingLotHeaderProps) => {
  return (
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
  );
};

export default ParkingLotHeader;
