
import React from 'react';
import CarDetailsHeader from './CarDetailsHeader';
import CarDetailsForm, { CarFormValues } from './CarDetailsForm';

interface CheckoutCarDetailsProps {
  initialValues: CarFormValues;
  onSubmit: (values: CarFormValues) => void;
}

const CheckoutCarDetails = ({ initialValues, onSubmit }: CheckoutCarDetailsProps) => {
  return (
    <div className="space-y-6">
      <CarDetailsHeader />
      <CarDetailsForm 
        initialValues={initialValues}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default CheckoutCarDetails;
