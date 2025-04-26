
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Calendar, Clock, Car } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { usePaystackPayment } from '@/utils/paystack';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

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

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type FormValues = z.infer<typeof formSchema>;

const CheckoutPayment = ({ reservation, carDetails, onBack, onComplete }: CheckoutPaymentProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("paystack");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { initiatePayment } = usePaystackPayment();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  
  const handlePayment = (values: FormValues) => {
    setIsProcessing(true);
    
    // Convert price from Naira to Kobo (multiply by 100)
    const amountInKobo = reservation.totalPrice * 100;
    
    const success = initiatePayment({
      email: values.email,
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
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handlePayment)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">Payment Details</h3>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="your.email@example.com" 
                      type="email" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <RadioGroup 
              defaultValue="paystack" 
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="space-y-3 mt-4"
            >
              <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="paystack" id="paystack" />
                <Label htmlFor="paystack" className="flex-grow cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span>Paystack</span>
                    <div className="flex space-x-1">
                      <div className="h-6 w-10 bg-green-600 rounded text-white flex items-center justify-center text-xs font-bold">Pay</div>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
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
            >
              {isProcessing ? "Processing..." : `Pay ₦${reservation.totalPrice}`}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CheckoutPayment;
