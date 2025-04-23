
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Calendar, Clock, Car, MapPin, CreditCard } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Reservation {
  parkingLotName: string;
  spotId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
}

interface CarDetails {
  model: string;
  color: string;
  plateNumber: string;
}

interface CheckoutSuccessProps {
  reservation: Reservation;
  carDetails: CarDetails;
  onFinish: () => void;
}

const CheckoutSuccess = ({ reservation, carDetails, onFinish }: CheckoutSuccessProps) => {
  const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="bg-green-100 text-green-600 p-3 rounded-full mb-4">
          <CheckCircle className="h-12 w-12" />
        </div>
        <h2 className="text-xl font-semibold text-center">Payment Successful!</h2>
        <p className="text-muted-foreground text-center">
          Your parking spot has been reserved successfully.
        </p>
      </div>
      
      <div className="bg-muted/30 border-dashed border-2 border-muted rounded-lg p-6 relative">
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-background rounded-full"></div>
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-background rounded-full"></div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">E-Ticket ID:</span>
            <span className="font-bold">{ticketId}</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center">
            <span className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              Location:
            </span>
            <span className="font-medium">{reservation.parkingLotName}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Spot:</span>
            <span className="font-medium">{reservation.spotId}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              Date:
            </span>
            <span className="font-medium">{new Date(reservation.date).toLocaleDateString()}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              Time:
            </span>
            <span className="font-medium">{reservation.startTime} - {reservation.endTime}</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center">
            <span className="flex items-center text-muted-foreground">
              <Car className="h-4 w-4 mr-1" />
              Car Details:
            </span>
            <span className="font-medium">{carDetails.model}, {carDetails.color}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Plate Number:</span>
            <span className="font-medium">{carDetails.plateNumber}</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center">
            <span className="flex items-center text-muted-foreground">
              <CreditCard className="h-4 w-4 mr-1" />
              Amount Paid:
            </span>
            <span className="font-bold">₦{reservation.totalPrice}</span>
          </div>
        </div>
        
        <div className="mt-6 flex justify-center">
          <Button variant="outline" size="sm" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Download E-Ticket
          </Button>
        </div>
      </div>
      
      <div className="bg-muted/30 p-4 rounded-lg">
        <p className="text-sm text-center text-muted-foreground">
          Please present this e-ticket when you arrive at the parking lot. 
          You can find all your reservations in your dashboard.
        </p>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
