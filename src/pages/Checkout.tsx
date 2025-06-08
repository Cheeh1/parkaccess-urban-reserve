import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, CreditCard, MapPin, Clock, Car } from "lucide-react";
import { format } from "date-fns";
import { paymentsApi } from "@/utils/api";
import { usePaystackPayment } from "@/utils/paystack";
import { useAuth } from "@/hooks/useAuth";

interface PaystackPopup {
  setup: (config: {
    key: string;
    email: string;
    amount: number;
    ref: string;
    metadata?: Record<string, unknown>;
    callback: (response: { reference: string }) => void;
    onClose: () => void;
  }) => {
    openIframe: () => void;
  };
}

declare global {
  interface Window {
    PaystackPop: PaystackPopup;
  }
}

const Checkout = () => {
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "processing" | "success" | "failed"
  >("pending");
  const [verificationLoading, setVerificationLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { initiatePayment } = usePaystackPayment();
  const { userData } = useAuth();

  const {
    timeSlot,
    paymentReference,
    assignedSpot,
    carDetails,
    parkingLot,
    amount,
  } = location.state || {};

  useEffect(() => {
    // Load Paystack script when component mounts
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => {
      // console.log("Paystack script loaded successfully");
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
      const existingScript = document.querySelector(
        'script[src="https://js.paystack.co/v1/inline.js"]'
      );
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [toast]);

  useEffect(() => {
    if (!timeSlot || !paymentReference || !carDetails || !parkingLot) {
      toast({
        title: "Error",
        description: "Missing booking information. Please start over.",
        variant: "destructive",
      });
      navigate("/parking-lots");
    }
  }, [timeSlot, paymentReference, carDetails, parkingLot, toast, navigate]);

  const verifyPayment = async (reference: string) => {
    try {
      setVerificationLoading(true);
      const result = await paymentsApi.verify(reference);

      if (result.success) {
        setPaymentStatus("success");
        toast({
          title: "Payment Successful!",
          description: "Your parking spot has been reserved successfully.",
        });
      } else {
        setPaymentStatus("failed");
        toast({
          title: "Payment Failed",
          description: "Payment could not be verified. Please contact support.",
          variant: "destructive",
        });
      }
    } catch (err) {
      setPaymentStatus("failed");
      toast({
        title: "Verification Error",
        description:
          err instanceof Error ? err.message : "Failed to verify payment",
        variant: "destructive",
      });
    } finally {
      setVerificationLoading(false);
    }
  };

  const handlePayment = () => {
    // console.log("handlePayment called");

    setPaymentStatus("processing");

    const success = initiatePayment({
      email: userData?.email || "user@example.com",
      amount: amount, // Amount in kobo
      reference: paymentReference,
      metadata: {
        parkingLotId: id,
        timeSlotId: timeSlot._id,
        spotNumber: assignedSpot,
      },
      onSuccess: (reference: string) => {
        verifyPayment(reference);
      },
      onCancel: () => {
        setPaymentStatus("pending");
        toast({
          title: "Payment Cancelled",
          description: "Payment was cancelled. You can try again.",
          variant: "destructive",
        });
      },
    });

    if (!success) {
      setPaymentStatus("pending");
      toast({
        title: "Payment Error",
        description: "Could not initialize payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFinish = () => {
    navigate("/dashboard");
  };

  if (!timeSlot || !paymentReference || !carDetails || !parkingLot) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-parking-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-center">
            {paymentStatus === "success"
              ? "Booking Confirmed!"
              : "Complete Payment"}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={parkingLot.images?.[0] || "/placeholder.svg"}
                  alt={parkingLot.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{parkingLot.name}</h3>
                  <p className="text-muted-foreground">{parkingLot.location}</p>
                </div>

                <div className="border-t pt-3 space-y-2">
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>
                      <strong>Date:</strong>{" "}
                      {format(new Date(timeSlot.startTime), "MMMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>
                      <strong>Time:</strong>{" "}
                      {format(new Date(timeSlot.startTime), "HH:mm")} -{" "}
                      {format(new Date(timeSlot.endTime), "HH:mm")}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span>
                      <strong>Spot Number:</strong> {assignedSpot}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span>
                      <strong>Duration:</strong>{" "}
                      {Math.round(
                        (new Date(timeSlot.endTime).getTime() -
                          new Date(timeSlot.startTime).getTime()) /
                          (1000 * 60 * 60)
                      )}{" "}
                      hour(s)
                    </span>
                  </div>
                </div>

                <div className="border-t pt-3 space-y-2">
                  <h4 className="font-semibold flex items-center">
                    <Car className="h-4 w-4 mr-2" />
                    Car Details
                  </h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>License Plate:</strong> {carDetails.licensePlate}
                    </p>
                    <p>
                      <strong>Model:</strong> {carDetails.carModel}
                    </p>
                    <p>
                      <strong>Color:</strong> {carDetails.carColor}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {paymentStatus === "success" ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    Payment Successful
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {paymentStatus === "success" ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Booking Confirmed!
                    </h3>
                    <p className="text-muted-foreground">
                      Your parking spot has been reserved. You'll receive a
                      confirmation email shortly.
                    </p>
                  </div>
                  <Button onClick={handleFinish} className="w-full">
                    Go to Dashboard
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Payment Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>
                          Parking Fee (
                          {Math.round(
                            (new Date(timeSlot.endTime).getTime() -
                              new Date(timeSlot.startTime).getTime()) /
                              (1000 * 60 * 60)
                          )}{" "}
                          hour(s))
                        </span>
                        <span>₦{(amount / 100).toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total</span>
                        <span>₦{(amount / 100).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {paymentStatus === "processing" || verificationLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-parking-primary mx-auto"></div>
                      <p className="mt-4 text-muted-foreground">
                        {verificationLoading
                          ? "Verifying payment..."
                          : "Processing payment..."}
                      </p>
                    </div>
                  ) : paymentStatus === "failed" ? (
                    <div className="text-center space-y-4">
                      <p className="text-red-600">
                        Payment failed. Please try again.
                      </p>
                      <Button onClick={handlePayment} className="w-full">
                        Retry Payment
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={handlePayment}
                      className="w-full"
                      disabled={
                        paymentStatus === "pending" || verificationLoading
                      }
                    >
                      Pay with Paystack
                    </Button>
                  )}

                  <div className="text-center">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/book/${id}`)}
                      className="w-full"
                    >
                      Back to Booking
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Checkout;
