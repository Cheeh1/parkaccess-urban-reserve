import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CheckoutCarDetails from '@/components/checkout/CheckoutCarDetails';
import CheckoutPayment from '@/components/checkout/CheckoutPayment';
import CheckoutSuccess from '@/components/checkout/CheckoutSuccess';
import ParkingLotSummary from '@/components/checkout/ParkingLotSummary';
import { useLocation, useNavigate } from 'react-router-dom';

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
  
  const reservationData: ReservationData = location.state?.reservation || {
    parkingLotName: 'Sample Parking Lot',
    spotId: 'A-15',
    date: '2025-04-30',
    startTime: '10:00',
    endTime: '12:00',
    totalPrice: 1200,
  };
  
  const handleCarDetailsSubmit = (details: typeof carDetails) => {
    setCarDetails(details);
    setStep('payment');
  };
  
  const handlePaymentComplete = () => {
    setStep('success');
  };
  
  const handleBackToCarDetails = () => {
    setStep('car-details');
  };
  
  const handleFinish = () => {
    navigate('/dashboard');
  };
  
  const handleProceedToPayment = () => {
    setStep('payment');
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
                  <CheckoutCarDetails 
                    initialValues={carDetails} 
                    onSubmit={handleCarDetailsSubmit}
                  />
                )}
                {step === 'payment' && (
                  <CheckoutPayment 
                    reservation={reservationData}
                    carDetails={carDetails}
                    onBack={handleBackToCarDetails}
                    onComplete={handlePaymentComplete}
                  />
                )}
                {step === 'success' && (
                  <CheckoutSuccess 
                    reservation={reservationData}
                    carDetails={carDetails}
                    onFinish={handleFinish}
                  />
                )}
              </CardContent>
              {step === 'success' && (
                <CardFooter className="flex justify-center">
                  <Button onClick={handleFinish}>Return to Dashboard</Button>
                </CardFooter>
              )}
            </Card>
          </div>
          
          <div className="lg:sticky lg:top-6 h-fit">
            <ParkingLotSummary 
              reservation={reservationData} 
              showPaymentButton={step === 'car-details'} 
              onPaymentClick={handleProceedToPayment}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Checkout;
