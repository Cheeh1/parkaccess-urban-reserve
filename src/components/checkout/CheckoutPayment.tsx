
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Calendar, Clock, Car } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

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

interface CheckoutPaymentProps {
  reservation: Reservation;
  carDetails: CarDetails;
  onBack: () => void;
  onComplete: () => void;
}

const CheckoutPayment = ({ reservation, carDetails, onBack, onComplete }: CheckoutPaymentProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("credit-card");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Payment successful",
        description: "Your payment has been processed successfully.",
      });
      onComplete();
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-primary/10 p-3 rounded-full">
          <CreditCard className="h-10 w-10 text-primary" />
        </div>
      </div>
      
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
        
        <Separator className="my-3" />
        
        <div className="flex justify-between font-semibold">
          <span>Total Amount:</span>
          <span>₦{reservation.totalPrice}</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium">Payment Method</h3>
        
        <RadioGroup 
          defaultValue="credit-card" 
          value={paymentMethod}
          onValueChange={setPaymentMethod}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
            <RadioGroupItem value="credit-card" id="credit-card" />
            <Label htmlFor="credit-card" className="flex-grow cursor-pointer">
              <div className="flex justify-between items-center">
                <span>Credit / Debit Card</span>
                <div className="flex space-x-1">
                  <div className="h-6 w-10 bg-blue-600 rounded text-white flex items-center justify-center text-xs font-bold">VISA</div>
                  <div className="h-6 w-10 bg-red-500 rounded text-white flex items-center justify-center text-xs font-bold">MC</div>
                </div>
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
            <RadioGroupItem value="bank-transfer" id="bank-transfer" />
            <Label htmlFor="bank-transfer" className="cursor-pointer">Bank Transfer</Label>
          </div>
          
          <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
            <RadioGroupItem value="ussd" id="ussd" />
            <Label htmlFor="ussd" className="cursor-pointer">USSD</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button 
          onClick={handlePayment} 
          className="flex-1" 
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : `Pay ₦${reservation.totalPrice}`}
        </Button>
      </div>
    </div>
  );
};

export default CheckoutPayment;
