
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Car } from 'lucide-react';

const formSchema = z.object({
  model: z.string().min(2, { message: 'Car model must be at least 2 characters.' }),
  color: z.string().min(2, { message: 'Car color must be at least 2 characters.' }),
  plateNumber: z.string().min(2, { message: 'Plate number is required.' }),
});

type FormValues = z.infer<typeof formSchema>;

interface CheckoutCarDetailsProps {
  initialValues: {
    model: string;
    color: string;
    plateNumber: string;
  };
  onSubmit: (values: FormValues) => void;
}

const CheckoutCarDetails = ({ initialValues, onSubmit }: CheckoutCarDetailsProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-primary/10 p-3 rounded-full">
          <Car className="h-10 w-10 text-primary" />
        </div>
      </div>
      
      <p className="text-center text-muted-foreground mb-6">
        Please provide your car details for identification at the parking lot.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
              Save Car Details
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CheckoutCarDetails;
