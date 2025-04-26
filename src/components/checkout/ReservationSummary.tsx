
import React from 'react';
import { Calendar, Clock, Car } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ReservationSummaryProps {
  reservation: {
    parkingLotName: string;
    spotId: string;
    date: string;
    startTime: string;
    endTime: string;
  };
  carDetails: {
    model: string;
    color: string;
    plateNumber: string;
  };
}

const ReservationSummary = ({ reservation, carDetails }: ReservationSummaryProps) => {
  return (
    <div className="bg-muted/50 rounded-lg p-4 mb-6">
      <h3 className="font-medium mb-3">Reservation Summary</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Parking Lot:</span>
          <span className="font-medium">{reservation.parkingLotName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Spot ID:</span>
          <span className="font-medium">{reservation.spotId}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            Date:
          </span>
          <span className="font-medium">{new Date(reservation.date).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            Time:
          </span>
          <span className="font-medium">{reservation.startTime} - {reservation.endTime}</span>
        </div>
        <div className="flex justify-between">
          <span className="flex items-center text-muted-foreground">
            <Car className="h-4 w-4 mr-1" />
            Car:
          </span>
          <span className="font-medium">{carDetails.model}, {carDetails.color}</span>
        </div>
      </div>
    </div>
  );
};

export default ReservationSummary;
