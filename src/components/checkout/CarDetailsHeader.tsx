
import React from 'react';
import { Car } from 'lucide-react';

const CarDetailsHeader = () => {
  return (
    <>
      <div className="flex items-center justify-center mb-6">
        <div className="bg-primary/10 p-3 rounded-full">
          <Car className="h-10 w-10 text-primary" />
        </div>
      </div>
      
      <p className="text-center text-muted-foreground mb-6">
        Please provide your car details for identification at the parking lot.
      </p>
    </>
  );
};

export default CarDetailsHeader;
