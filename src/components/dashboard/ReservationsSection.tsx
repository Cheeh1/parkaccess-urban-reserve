import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Car,
  Calendar,
  MapPin,
  Clock,
  CreditCard,
  File,
  Star,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { timeSlotApi } from "@/utils/api";
import { format } from "date-fns";
import ETicket from "./ETicket";
import CancelConfirmDialog from "./CancelConfirmDialog";

interface BookingHistory {
  _id: string;
  parkingLot: {
    name: string;
    location: string;
  };
  spotNumber: number;
  startTime: string;
  endTime: string;
  carDetails: {
    licensePlate: string;
    carModel: string;
    carColor: string;
  };
  payment: {
    status: string;
    amount: number;
  };
  status: string;
  timeStatus: "upcoming" | "past" | "ongoing";
}

interface ReservationsSectionProps {
  // Remove the reservations prop since we'll fetch data internally
}

const ReservationsSection = ({}: ReservationsSectionProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<BookingHistory | null>(
    null
  );
  const [showTicket, setShowTicket] = useState(false);
  const [selectedCancel, setSelectedCancel] = useState<BookingHistory | null>(
    null
  );
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  const fetchBookingHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await timeSlotApi.getHistory();

      if (result.success && result.data) {
        setBookings(result.data);
      } else {
        setError("Failed to load booking history");
      }
    } catch (err) {
      console.error("Error fetching booking history:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load booking history"
      );
      toast({
        title: "Error",
        description: "Failed to load booking history. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicket = (booking: BookingHistory) => {
    setSelectedTicket(booking);
    setShowTicket(true);
  };

  const handleCancelBooking = (booking: BookingHistory) => {
    setSelectedCancel(booking);
    setShowCancelDialog(true);
  };

  const confirmCancelBooking = async () => {
    if (!selectedCancel) return;

    try {
      setCancelLoading(true);
      const result = await timeSlotApi.cancel(selectedCancel._id);

      if (result.success) {
        toast({
          title: "Booking Cancelled",
          description: "Your booking has been successfully cancelled.",
        });

        // Remove the cancelled booking from the list
        setBookings(
          bookings.filter((booking) => booking._id !== selectedCancel._id)
        );
        setShowCancelDialog(false);
        setSelectedCancel(null);
      } else {
        throw new Error("Failed to cancel booking");
      }
    } catch (err) {
      console.error("Error cancelling booking:", err);
      toast({
        title: "Cancellation Failed",
        description:
          err instanceof Error
            ? err.message
            : "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCancelLoading(false);
    }
  };

  const upcomingBookings = bookings.filter(
    (booking) => booking.timeStatus === "upcoming"
  );
  const ongoingBookings = bookings.filter(
    (booking) => booking.timeStatus === "ongoing"
  );
  const pastBookings = bookings.filter(
    (booking) => booking.timeStatus === "past"
  );

  const handleBookNow = () => {
    navigate("/parking-lots");
  };

  const getStatusBadge = (timeStatus: string, paymentStatus: string) => {
    if (timeStatus === "upcoming") {
      return (
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          Upcoming
        </span>
      );
    } else if (timeStatus === "ongoing") {
      return (
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          Ongoing
        </span>
      );
    } else if (timeStatus === "past") {
      return (
        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
          Completed
        </span>
      );
    }
    return null;
  };

  const getBorderColor = (timeStatus: string) => {
    if (timeStatus === "upcoming") return "border-blue-300";
    if (timeStatus === "ongoing") return "border-green-300";
    return "border-gray-300";
  };

  const renderBookingCard = (booking: BookingHistory) => (
    <Card key={booking._id} className="overflow-hidden">
      <CardContent className="p-0">
        <div className={`p-4 border-l-4 ${getBorderColor(booking.timeStatus)}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {booking.parkingLot.name}
              </h3>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                {booking.parkingLot.location} • Spot {booking.spotNumber}
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
              {getStatusBadge(booking.timeStatus, booking.payment.status)}
              {booking.payment.status === "success" && (
                <span className="text-green-600 text-xs font-medium">Paid</span>
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-600">
                {format(new Date(booking.startTime), "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-600">
                {format(new Date(booking.startTime), "HH:mm")} -{" "}
                {format(new Date(booking.endTime), "HH:mm")}
              </span>
            </div>
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-600">
                ₦{(booking.payment.amount / 100).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Car className="h-4 w-4 mr-1" />
              Vehicle Details
            </h4>
            <div className="text-sm text-gray-600">
              <span className="font-medium">
                {booking.carDetails.licensePlate}
              </span>{" "}
              • {booking.carDetails.carModel} • {booking.carDetails.carColor}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300"
              onClick={() => handleViewTicket(booking)}
            >
              <File className="h-4 w-4 mr-1" />
              {booking.timeStatus === "past" ? "View Receipt" : "View E-Ticket"}
            </Button>
            {booking.timeStatus === "upcoming" && (
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => handleCancelBooking(booking)}
              >
                Cancel
              </Button>
            )}
            {booking.timeStatus === "past" && (
              <Button variant="outline" size="sm">
                <Star className="h-4 w-4 mr-1" />
                Rate Experience
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-parking-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-lg">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-lg font-medium text-red-900">
          Error Loading Bookings
        </h3>
        <p className="mt-1 text-red-600">{error}</p>
        <div className="mt-6">
          <Button onClick={fetchBookingHistory} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Reservations</h2>
      <Tabs defaultValue="upcoming">
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">
            Upcoming{" "}
            {upcomingBookings.length > 0 && `(${upcomingBookings.length})`}
          </TabsTrigger>
          <TabsTrigger value="ongoing">
            Ongoing{" "}
            {ongoingBookings.length > 0 && `(${ongoingBookings.length})`}
          </TabsTrigger>
          <TabsTrigger value="past">
            Past {pastBookings.length > 0 && `(${pastBookings.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Car className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No upcoming reservations
              </h3>
              <p className="mt-1 text-gray-500">
                You don't have any parking reservations scheduled.
              </p>
              <div className="mt-6">
                <Button onClick={handleBookNow}>Find Parking</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map(renderBookingCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="ongoing">
          {ongoingBookings.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Clock className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No ongoing reservations
              </h3>
              <p className="mt-1 text-gray-500">
                You don't have any active parking sessions.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {ongoingBookings.map(renderBookingCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          {pastBookings.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Clock className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No past reservations
              </h3>
              <p className="mt-1 text-gray-500">
                You haven't made any parking reservations yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pastBookings.map(renderBookingCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* E-Ticket Modal */}
      <ETicket
        booking={selectedTicket}
        isOpen={showTicket}
        onClose={() => {
          setShowTicket(false);
          setSelectedTicket(null);
        }}
      />

      {/* Cancel Confirmation Dialog */}
      <CancelConfirmDialog
        booking={selectedCancel}
        isOpen={showCancelDialog}
        onClose={() => {
          setShowCancelDialog(false);
          setSelectedCancel(null);
        }}
        onConfirm={confirmCancelBooking}
        loading={cancelLoading}
      />
    </div>
  );
};

export default ReservationsSection;
