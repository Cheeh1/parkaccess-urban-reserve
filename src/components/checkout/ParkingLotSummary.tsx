
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, Calendar, Clock, Car } from 'lucide-react';

interface ParkingLotSummaryProps {
  reservation: {
    parkingLotName: string;
    spotId: string;
    date: string;
    startTime: string;
    endTime: string;
    totalPrice: number;
  };
}

const ParkingLotSummary = ({ reservation }: ParkingLotSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="font-medium">{reservation.parkingLotName}</p>
              <p className="text-sm text-muted-foreground">Spot {reservation.spotId}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm">{new Date(reservation.date).toLocaleDateString()}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm">{reservation.startTime} - {reservation.endTime}</p>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Parking fee</span>
            <span>₦{reservation.totalPrice}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Service fee</span>
            <span>₦0</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>₦{reservation.totalPrice}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParkingLotSummary;
