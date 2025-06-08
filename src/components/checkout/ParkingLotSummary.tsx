import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Calendar } from 'lucide-react';

interface ParkingLot {
  _id: string;
  name: string;
  location: string;
  totalSpots: number;
  hourlyRate: number;
  images: string[];
  createdBy: {
    _id: string;
    fullName: string;
    email: string;
  };
  createdAt: string;
}

interface ReservationData {
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
}

interface ParkingLotSummaryProps {
  parkingLot: ParkingLot;
  reservation: ReservationData;
  showPaymentButton?: boolean;
  onPaymentClick?: () => void;
}

const ParkingLotSummary = ({
  parkingLot,
  reservation,
  showPaymentButton = true,
  onPaymentClick,
}: ParkingLotSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reservation Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video relative rounded-lg overflow-hidden">
          <img
            src={parkingLot.images[0] || '/placeholder.svg'}
            alt={parkingLot.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div>
          <h3 className="font-semibold text-lg">{parkingLot.name}</h3>
          <p className="text-gray-600 flex items-center mt-1">
            <MapPin className="h-4 w-4 mr-2" />
            {parkingLot.location}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{reservation.date}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>{reservation.startTime} - {reservation.endTime}</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Hourly Rate</span>
            <span>₦{parkingLot.hourlyRate}/hour</span>
          </div>
          <div className="flex justify-between items-center font-semibold">
            <span>Total</span>
            <span>₦{reservation.totalPrice}</span>
          </div>
        </div>

        {showPaymentButton && onPaymentClick && (
          <Button 
            onClick={onPaymentClick}
            className="w-full mt-4"
          >
            Proceed to Payment
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ParkingLotSummary;
