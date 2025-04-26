
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';

const formSchema = z.object({
  model: z.string().min(2, { message: 'Car model must be at least 2 characters.' }),
  color: z.string().min(2, { message: 'Car color must be at least 2 characters.' }),
  plateNumber: z.string().min(2, { message: 'Plate number is required.' }),
});

export type CarFormValues = z.infer<typeof formSchema>;

interface CarDetailsFormProps {
  initialValues: CarFormValues;
  onSubmit: (values: CarFormValues) => void;
}

const CarDetailsForm = ({ initialValues, onSubmit }: CarDetailsFormProps) => {
  const form = useForm<CarFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Car Model</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Toyota Camry" {...field} />
              </FormControl>
              <FormDescription>
                Enter the make and model of your car
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Car Color</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Silver" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="plateNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>License Plate Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g. ABC-123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="pt-4">
          <Button type="submit" className="w-full">
            Proceed to Payment
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CarDetailsForm;
