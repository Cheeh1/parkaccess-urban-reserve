import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useParkingLot } from "@/hooks/useParkingLot";
import { Calendar, Clock, MapPin, Car } from "lucide-react";
import { format } from "date-fns";
import { timeSlotApi, paymentsApi } from "@/utils/api";

interface CarDetails {
  licensePlate: string;
  carModel: string;
  carColor: string;
}

const Booking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    parkingLot,
    loading: parkingLotLoading,
    error,
  } = useParkingLot(id || "");

  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [carDetails, setCarDetails] = useState<CarDetails>({
    licensePlate: "",
    carModel: "",
    carColor: "",
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  const checkAvailability = async () => {
    if (!selectedDate || !startTime || !endTime) {
      toast({
        title: "Missing Information",
        description: "Please select date, start time, and end time",
        variant: "destructive",
      });
      return;
    }

    // Validate that end time is after start time
    const start = new Date(`${selectedDate}T${startTime}`);
    const end = new Date(`${selectedDate}T${endTime}`);

    if (end <= start) {
      toast({
        title: "Invalid Time Range",
        description: "End time must be after start time",
        variant: "destructive",
      });
      return;
    }

    try {
      setAvailabilityLoading(true);
      const startDateTime = start.toISOString();
      const endDateTime = end.toISOString();

      await timeSlotApi.checkAvailability(id!, startDateTime, endDateTime);
      setAvailabilityChecked(true);

      toast({
        title: "Availability Confirmed",
        description: "A parking spot is available for your selected time",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "No Availability",
        description:
          err instanceof Error
            ? err.message
            : "No spots available for selected time",
        variant: "destructive",
      });
      setAvailabilityChecked(false);
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const handleBookSlot = async () => {
    if (!availabilityChecked) {
      toast({
        title: "Check Availability First",
        description: "Please check availability before proceeding",
        variant: "destructive",
      });
      return;
    }

    if (
      !carDetails.licensePlate ||
      !carDetails.carModel ||
      !carDetails.carColor
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all car details",
        variant: "destructive",
      });
      return;
    }

    try {
      setBookingLoading(true);

      // Calculate amount (assuming hourly rate calculation)
      const start = new Date(`${selectedDate}T${startTime}`);
      const end = new Date(`${selectedDate}T${endTime}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      const amount = Math.round(hours * (parkingLot?.hourlyRate || 0) * 100); // Amount in kobo

      // Initialize payment with new structure
      const paymentResult = await paymentsApi.initialize({
        parkingLotId: id!,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        carDetails,
        amount,
      });

      // Navigate to checkout with payment details
      navigate(`/checkout/${id}`, {
        state: {
          timeSlot: paymentResult.data.timeSlot,
          paymentReference: paymentResult.data.paymentReference,
          assignedSpot: paymentResult.data.assignedSpot,
          carDetails,
          parkingLot,
          amount,
        },
      });
    } catch (err) {
      toast({
        title: "Booking Failed",
        description:
          err instanceof Error ? err.message : "Failed to book parking slot",
        variant: "destructive",
      });
    } finally {
      setBookingLoading(false);
    }
  };

  // Reset availability check when time changes
  useEffect(() => {
    setAvailabilityChecked(false);
  }, [selectedDate, startTime, endTime]);

  if (parkingLotLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-parking-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (error || !parkingLot) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-red-500">Failed to load parking lot details</p>
              <Button
                onClick={() => navigate("/parking-lots")}
                className="mt-4"
              >
                Back to Parking Lots
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const calculateHours = () => {
    if (!selectedDate || !startTime || !endTime) return 0;
    const start = new Date(`${selectedDate}T${startTime}`);
    const end = new Date(`${selectedDate}T${endTime}`);
    return Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60 * 60));
  };

  const hours = calculateHours();
  const totalAmount = Math.round(hours * (parkingLot?.hourlyRate || 0));

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/parking-lots")}
            className="mb-4"
          >
            ← Back to Parking Lots
          </Button>
          <h1 className="text-3xl font-bold">
            Book Parking at {parkingLot.name}
          </h1>
          <div className="flex items-center text-muted-foreground mt-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{parkingLot.location}</span>
            <span className="mx-4">•</span>
            <span>₦{parkingLot.hourlyRate}/hour</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Form */}
          <div className="space-y-6">
            {/* Date and Time Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Select Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Entry Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">Exit Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
                <Button
                  onClick={checkAvailability}
                  disabled={
                    !selectedDate ||
                    !startTime ||
                    !endTime ||
                    availabilityLoading
                  }
                  className="w-full"
                  variant={availabilityChecked ? "default" : "outline"}
                >
                  {availabilityLoading
                    ? "Checking..."
                    : availabilityChecked
                    ? "✓ Available"
                    : "Check Availability"}
                </Button>
              </CardContent>
            </Card>

            {/* Car Details */}
            {availabilityChecked && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Car className="h-5 w-5 mr-2" />
                    Car Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="licensePlate">License Plate</Label>
                    <Input
                      id="licensePlate"
                      value={carDetails.licensePlate}
                      onChange={(e) =>
                        setCarDetails((prev) => ({
                          ...prev,
                          licensePlate: e.target.value,
                        }))
                      }
                      placeholder="e.g., ABC123"
                    />
                  </div>
                  <div>
                    <Label htmlFor="carModel">Car Model</Label>
                    <Input
                      id="carModel"
                      value={carDetails.carModel}
                      onChange={(e) =>
                        setCarDetails((prev) => ({
                          ...prev,
                          carModel: e.target.value,
                        }))
                      }
                      placeholder="e.g., Toyota Camry"
                    />
                  </div>
                  <div>
                    <Label htmlFor="carColor">Car Color</Label>
                    <Input
                      id="carColor"
                      value={carDetails.carColor}
                      onChange={(e) =>
                        setCarDetails((prev) => ({
                          ...prev,
                          carColor: e.target.value,
                        }))
                      }
                      placeholder="e.g., Black"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Summary */}
          <div className="lg:sticky lg:top-6 h-fit">
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={parkingLot.images?.[0] || "/placeholder.svg"}
                    alt={parkingLot.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">{parkingLot.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {parkingLot.location}
                  </p>

                  {selectedDate && (
                    <div className="border-t pt-4">
                      <p className="text-sm">
                        <strong>Date:</strong>{" "}
                        {format(new Date(selectedDate), "MMMM d, yyyy")}
                      </p>
                    </div>
                  )}

                  {startTime && endTime && (
                    <div className="space-y-2">
                      <p className="text-sm">
                        <strong>Entry Time:</strong> {startTime}
                      </p>
                      <p className="text-sm">
                        <strong>Exit Time:</strong> {endTime}
                      </p>
                      <p className="text-sm">
                        <strong>Duration:</strong> {hours.toFixed(1)} hour(s)
                      </p>
                      {availabilityChecked && (
                        <p className="text-sm text-green-600">
                          <strong>Status:</strong> Spot will be auto-assigned
                        </p>
                      )}
                      <div className="border-t pt-2">
                        <p className="text-lg font-semibold">
                          Total: ₦{totalAmount}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleBookSlot}
                  disabled={
                    !availabilityChecked ||
                    !carDetails.licensePlate ||
                    !carDetails.carModel ||
                    !carDetails.carColor ||
                    bookingLoading
                  }
                  className="w-full"
                >
                  {bookingLoading ? "Processing..." : "Proceed to Payment"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Booking;
