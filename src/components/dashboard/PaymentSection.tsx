
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

// Mock payment method type
interface PaymentMethod {
  id: string;
  type: string;
  number: string;
  expiry: string;
  isDefault: boolean;
}

interface PaymentSectionProps {
  paymentMethods: PaymentMethod[];
}

const PaymentSection = ({ paymentMethods }: PaymentSectionProps) => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Payment Methods</h2>
    <Card>
      <CardHeader>
        <CardTitle>Saved Payment Methods</CardTitle>
        <CardDescription>Manage your saved payment methods</CardDescription>
      </CardHeader>
      <CardContent>
        {paymentMethods.map((method) => (
          <div 
            key={method.id} 
            className="flex items-center justify-between p-4 border rounded-md mb-4"
          >
            <div className="flex items-center">
              {method.type === 'Visa' ? (
                <div className="h-10 w-16 bg-blue-600 text-white flex items-center justify-center rounded-md mr-3">
                  <span className="font-bold">VISA</span>
                </div>
              ) : (
                <div className="h-10 w-16 bg-red-500 text-white flex items-center justify-center rounded-md mr-3">
                  <span className="font-bold">MC</span>
                </div>
              )}
              <div>
                <p className="font-medium">{method.number}</p>
                <p className="text-sm text-gray-500">Expires {method.expiry}</p>
              </div>
            </div>
            <div className="flex items-center">
              {method.isDefault && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-4">
                  Default
                </span>
              )}
              <Button variant="ghost" size="sm" className="h-8 text-gray-600">
                Edit
              </Button>
              <Button variant="ghost" size="sm" className="h-8 text-red-500">
                Delete
              </Button>
            </div>
          </div>
        ))}
        <Button className="mt-4">
          <CreditCard className="mr-2 h-4 w-4" />
          Add Payment Method
        </Button>
      </CardContent>
    </Card>
  </div>
);

export default PaymentSection;
