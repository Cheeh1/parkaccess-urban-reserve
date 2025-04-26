
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type FormValues = z.infer<typeof formSchema>;

interface PaymentFormProps {
  onSubmit: (values: FormValues) => void;
  paymentMethod: string;
  onPaymentMethodChange: (value: string) => void;
  isProcessing: boolean;
  totalPrice: number;
}

const PaymentForm = ({
  onSubmit,
  paymentMethod,
  onPaymentMethodChange,
  isProcessing,
}: PaymentFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            onValueChange={onPaymentMethodChange}
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
      </form>
    </Form>
  );
};

export default PaymentForm;
