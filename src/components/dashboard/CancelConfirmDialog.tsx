import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { format } from "date-fns";

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

interface CancelConfirmDialogProps {
  booking: BookingHistory | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const CancelConfirmDialog = ({
  booking,
  isOpen,
  onClose,
  onConfirm,
  loading,
}: CancelConfirmDialogProps) => {
  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Cancel Booking
          </DialogTitle>
          <DialogDescription className="text-left">
            Are you sure you want to cancel this booking? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h4 className="font-medium">{booking.parkingLot.name}</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <strong>Date:</strong>{" "}
              {format(new Date(booking.startTime), "EEEE, MMMM d, yyyy")}
            </p>
            <p>
              <strong>Time:</strong>{" "}
              {format(new Date(booking.startTime), "h:mm a")} -{" "}
              {format(new Date(booking.endTime), "h:mm a")}
            </p>
            <p>
              <strong>Spot:</strong> {booking.spotNumber}
            </p>
            <p>
              <strong>Vehicle:</strong> {booking.carDetails.licensePlate} (
              {booking.carDetails.carModel})
            </p>
            <p>
              <strong>Amount:</strong> ₦
              {(booking.payment.amount / 100).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-sm text-amber-800">
            <strong>Refund Policy:</strong> Cancellations made more than 2 hours
            before the start time are eligible for a full refund. Later
            cancellations may incur charges.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Keep Booking
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? "Cancelling..." : "Cancel Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelConfirmDialog;
