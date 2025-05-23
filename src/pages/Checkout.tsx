
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CheckoutCarDetails from '@/components/checkout/CheckoutCarDetails';
import CheckoutPayment from '@/components/checkout/CheckoutPayment';
import CheckoutSuccess from '@/components/checkout/CheckoutSuccess';
import ParkingLotSummary from '@/components/checkout/ParkingLotSummary';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ReservationData {
  parkingLotName: string;
  spotId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
}

const Checkout = () => {
  const [step, setStep] = useState<'car-details' | 'payment' | 'success'>('car-details');
  const [carDetails, setCarDetails] = useState({
    model: '',
    color: '',
    plateNumber: '',
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const reservationData: ReservationData = location.state?.reservation || {
    parkingLotName: 'Sample Parking Lot',
    spotId: 'A-15',
    date: '2025-04-30',
    startTime: '10:00',
    endTime: '12:00',
    totalPrice: 1200,
  };
  
  useEffect(() => {
    // Load Paystack script when component mounts
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => {
      console.log('Paystack script loaded successfully');
    };
    script.onerror = () => {
      toast({
        title: "Payment Error",
        description: "Failed to load payment provider. Please try again later.",
        variant: "destructive",
      });
    };
    document.body.appendChild(script);

    return () => {
      // Clean up script when component unmounts
      document.body.removeChild(script);
    };
  }, [toast]);
  
  const handleCarDetailsSubmit = (details: typeof carDetails) => {
    setCarDetails(details);
    setStep('payment');
  };
  
  const handlePaymentComplete = () => {
    setStep('success');
  };
  
  const handleFinish = () => {
    navigate('/dashboard');
  };

  const handleStepAction = () => {
    if (step === 'car-details') {
      document.querySelector('form')?.requestSubmit();
    } else if (step === 'payment') {
      document.querySelector('form')?.requestSubmit();
    }
  };

  const handleBack = () => {
    if (step === 'payment') {
      setStep('car-details');
    }
  };
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Complete Your Reservation</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>
                    {step === 'car-details' && 'Step 1: Car Details'}
                    {step === 'payment' && 'Step 2: Payment'}
                    {step === 'success' && 'Reservation Complete!'}
                  </span>
                  {(step === 'car-details' || step === 'payment') && (
                    <div className="text-sm font-normal text-muted-foreground">
                      {reservationData.parkingLotName} - Spot {reservationData.spotId}
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {step === 'car-details' && (
                  <div className="space-y-6">
                    <CheckoutCarDetails 
                      initialValues={carDetails} 
                      onSubmit={handleCarDetailsSubmit}
                    />
                    <Button 
                      onClick={handleStepAction}
                      className="w-full"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                )}
                {step === 'payment' && (
                  <div className="space-y-6">
                    <CheckoutPayment 
                      reservation={reservationData}
                      carDetails={carDetails}
                      onBack={handleBack}
                      onComplete={handlePaymentComplete}
                    />
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        variant="outline" 
                        onClick={handleBack}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={handleStepAction}
                        className="flex-1"
                      >
                        Complete Payment
                      </Button>
                    </div>
                  </div>
                )}
                {step === 'success' && (
                  <CheckoutSuccess 
                    reservation={reservationData}
                    carDetails={carDetails}
                    onFinish={handleFinish}
                  />
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:sticky lg:top-6 h-fit">
            <ParkingLotSummary 
              reservation={reservationData} 
              showPaymentButton={false}
              onPaymentClick={() => {}}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Checkout;
