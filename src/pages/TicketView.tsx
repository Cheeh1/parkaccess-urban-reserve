import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Car,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";

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

const TicketView = () => {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<BookingHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        if (!id) {
          throw new Error("Ticket ID is required");
        }

        // This would normally be an API call
        // For now, simulating with localStorage or a mock API
        const response = await fetch(`/api/booking/${id}`);

        if (!response.ok) {
          throw new Error("Ticket not found");
        }

        const ticketData = await response.json();

        // Calculate time status
        const now = new Date();
        const startTime = new Date(ticketData.startTime);
        const endTime = new Date(ticketData.endTime);

        let timeStatus: "upcoming" | "past" | "ongoing";
        if (now < startTime) {
          timeStatus = "upcoming";
        } else if (now > endTime) {
          timeStatus = "past";
        } else {
          timeStatus = "ongoing";
        }

        setTicket({ ...ticketData, timeStatus });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load ticket");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const getStatusBadge = (status: "upcoming" | "past" | "ongoing") => {
    const statusConfig = {
      upcoming: {
        color: "bg-blue-100 text-blue-800",
        icon: Clock,
        label: "Upcoming",
      },
      ongoing: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        label: "Active",
      },
      past: {
        color: "bg-gray-100 text-gray-800",
        icon: XCircle,
        label: "Expired",
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Ticket not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const duration = Math.round(
    (new Date(ticket.endTime).getTime() -
      new Date(ticket.startTime).getTime()) /
      (1000 * 60 * 60)
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">
              ParkAccess
            </h1>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Parking E-Ticket
            </h2>
            <p className="text-gray-600">Booking ID: {ticket._id}</p>
            <div className="mt-4 flex justify-center">
              {getStatusBadge(ticket.timeStatus)}
            </div>
          </div>

          {/* Status Alert */}
          {ticket.timeStatus === "ongoing" && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Your parking session is currently active. Please ensure your
                vehicle is parked in the designated spot.
              </AlertDescription>
            </Alert>
          )}

          {ticket.timeStatus === "past" && (
            <Alert className="bg-red-50 border-red-200">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                This parking session has expired. Please ensure your vehicle has
                been removed from the parking spot.
              </AlertDescription>
            </Alert>
          )}

          {ticket.timeStatus === "upcoming" && (
            <Alert className="bg-blue-50 border-blue-200">
              <Clock className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Your parking session is scheduled to begin at{" "}
                {format(new Date(ticket.startTime), "h:mm a")}. Please arrive on
                time.
              </AlertDescription>
            </Alert>
          )}

          {/* Parking Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {ticket.parkingLot.name}
              </CardTitle>
              <p className="text-gray-600">{ticket.parkingLot.location}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-gray-600">
                      {format(new Date(ticket.startTime), "EEEE, MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-gray-600">
                      {format(new Date(ticket.startTime), "h:mm a")} -{" "}
                      {format(new Date(ticket.endTime), "h:mm a")}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="font-medium">Parking Spot</p>
                  <p className="text-gray-600 text-lg font-semibold">
                    Spot {ticket.spotNumber}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Duration</p>
                  <p className="text-gray-600">{duration} hour(s)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Vehicle Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">License Plate</p>
                  <p className="text-gray-600 font-mono text-lg font-semibold">
                    {ticket.carDetails.licensePlate}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Vehicle</p>
                  <p className="text-gray-600">{ticket.carDetails.carModel}</p>
                </div>
                <div>
                  <p className="font-medium">Color</p>
                  <p className="text-gray-600">{ticket.carDetails.carColor}</p>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">Amount Paid</p>
                    <p className="text-gray-600">
                      ₦{(ticket.payment.amount / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 pt-4 border-t">
            <p>This is your official parking ticket.</p>
            <p className="mt-1">Generated on {format(new Date(), "PPpp")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketView;
