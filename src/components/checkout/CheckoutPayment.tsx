
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePaystackPayment } from '@/utils/paystack';
import { Separator } from '@/components/ui/separator';
import ReservationSummary from './ReservationSummary';
import PaymentForm from './PaymentForm';

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
  const [paymentMethod, setPaymentMethod] = useState<string>("paystack");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { initiatePayment } = usePaystackPayment();

  const handlePayment = ({ email }: { email: string }) => {
    setIsProcessing(true);
    
    const amountInKobo = reservation.totalPrice * 100;
    
    const success = initiatePayment({
      email,
      amount: amountInKobo,
      metadata: {
        parkingLotName: reservation.parkingLotName,
        spotId: reservation.spotId,
        carModel: carDetails.model,
        carColor: carDetails.color,
        plateNumber: carDetails.plateNumber,
      },
      onSuccess: (reference) => {
        toast({
          title: "Payment successful",
          description: `Transaction reference: ${reference}`,
        });
        setIsProcessing(false);
        onComplete();
      },
      onCancel: () => {
        setIsProcessing(false);
        toast({
          title: "Payment cancelled",
          description: "You have cancelled the payment.",
        });
      },
    });
    
    if (!success) {
      setIsProcessing(false);
      toast({
        title: "Payment Error",
        description: "Could not initialize payment. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-primary/10 p-3 rounded-full">
          <CreditCard className="h-10 w-10 text-primary" />
        </div>
      </div>

      <ReservationSummary 
        reservation={reservation}
        carDetails={carDetails}
      />
      
      <div className="bg-muted/50 rounded-lg p-4 mb-6">
        <div className="flex justify-between font-semibold">
          <span>Total Amount:</span>
          <span>₦{reservation.totalPrice}</span>
        </div>
      </div>

      <PaymentForm 
        onSubmit={handlePayment}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
        isProcessing={isProcessing}
        totalPrice={reservation.totalPrice}
      />
      
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button 
          variant="outline" 
          onClick={onBack} 
          type="button"
          className="flex-1"
        >
          Back
        </Button>
        <Button 
          type="submit"
          className="flex-1" 
          disabled={isProcessing}
          onClick={() => document.querySelector('form')?.requestSubmit()}
        >
          {isProcessing ? "Processing..." : `Pay ₦${reservation.totalPrice}`}
        </Button>
      </div>
    </div>
  );
};

export default CheckoutPayment;
