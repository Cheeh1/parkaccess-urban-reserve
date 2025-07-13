import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Car,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Download,
  Printer,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode";

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

interface ETicketProps {
  booking: BookingHistory | null;
  isOpen: boolean;
  onClose: () => void;
}

const ETicket = ({ booking, isOpen, onClose }: ETicketProps) => {
  const { toast } = useToast();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    if (booking) {
      generateQRCode();
    }
  }, [booking]);

  const generateQRCode = async () => {
    if (!booking) return;

    try {
      const ticketUrl = `${window.location.origin}/ticket/${booking._id}`;
      const qrCodeDataUrl = await QRCode.toDataURL(ticketUrl, {
        width: 150,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

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

  if (!booking) return null;

  const handlePrint = () => {
    // Create a temporary iframe for printing
    const printContent = generateTicketHTML();
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";

    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(printContent);
      doc.close();

      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();

      // Remove iframe after printing
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }
  };

  const loadHtml2PdfScript = () => {
    return new Promise((resolve, reject) => {
      // Check if html2pdf is already loaded
      if (typeof window !== "undefined" && (window as any).html2pdf) {
        resolve((window as any).html2pdf);
        return;
      }

      // Create script element
      const script = document.createElement("script");
      script.src =
        "https://raw.githack.com/eKoopmans/html2pdf/master/dist/html2pdf.bundle.min.js";
      script.onload = () => resolve((window as any).html2pdf);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const handleDownload = async () => {
    try {
      // Load html2pdf library
      const html2pdf = await loadHtml2PdfScript();

      // Create a temporary div with the ticket content
      const element = document.createElement("div");
      element.innerHTML = generateTicketHTML();

      // PDF options
      const opt = {
        margin: 0.5,
        filename: `parking-ticket-${booking._id}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      // Generate and download PDF
      html2pdf().set(opt).from(element).save();

      toast({
        title: "PDF Downloaded",
        description: "Your parking ticket has been downloaded as a PDF file.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Download Failed",
        description:
          "Failed to generate PDF. Please try the print option instead.",
        variant: "destructive",
      });
    }
  };

  const generateTicketHTML = () => {
    const statusConfig = {
      upcoming: { color: "#dbeafe", textColor: "#1e40af" },
      ongoing: { color: "#dcfce7", textColor: "#166534" },
      past: { color: "#f3f4f6", textColor: "#374151" },
    };

    const config = statusConfig[booking.timeStatus];

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6;">
        <div style="text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px;">
          <div style="font-size: 24px; font-weight: bold; color: #3b82f6; margin-bottom: 10px;">ParkAccess</div>
          <h2 style="margin: 10px 0;">Parking E-Ticket</h2>
          <p style="margin: 5px 0;">Booking ID: ${booking._id}</p>
          <div style="margin: 10px 0;">
            <span style="display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; background: ${
              config.color
            }; color: ${config.textColor};">
              ${booking.timeStatus}
            </span>
          </div>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">${booking.parkingLot.name}</h3>
          <p style="margin: 0 0 20px 0; color: #6b7280;">${
            booking.parkingLot.location
          }</p>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
            <div>
              <div style="font-weight: bold; color: #374151; margin-bottom: 5px;">Date</div>
              <div style="color: #6b7280;">${format(
                new Date(booking.startTime),
                "EEEE, MMMM d, yyyy"
              )}</div>
            </div>
            <div>
              <div style="font-weight: bold; color: #374151; margin-bottom: 5px;">Time</div>
              <div style="color: #6b7280;">${format(
                new Date(booking.startTime),
                "h:mm a"
              )} - ${format(new Date(booking.endTime), "h:mm a")}</div>
            </div>
            <div>
              <div style="font-weight: bold; color: #374151; margin-bottom: 5px;">Parking Spot</div>
              <div style="color: #6b7280;">Spot ${booking.spotNumber}</div>
            </div>
            <div>
              <div style="font-weight: bold; color: #374151; margin-bottom: 5px;">Status</div>
              <div style="display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; background: ${
                config.color
              }; color: ${config.textColor};">${booking.timeStatus}</div>
            </div>
          </div>

          <h4 style="margin: 20px 0 10px 0;">Vehicle Information</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
            <div>
              <div style="font-weight: bold; color: #374151; margin-bottom: 5px;">License Plate</div>
              <div style="color: #6b7280;">${
                booking.carDetails.licensePlate
              }</div>
            </div>
            <div>
              <div style="font-weight: bold; color: #374151; margin-bottom: 5px;">Vehicle</div>
              <div style="color: #6b7280;">${booking.carDetails.carModel}</div>
            </div>
            <div>
              <div style="font-weight: bold; color: #374151; margin-bottom: 5px;">Color</div>
              <div style="color: #6b7280;">${booking.carDetails.carColor}</div>
            </div>
            <div>
              <div style="font-weight: bold; color: #374151; margin-bottom: 5px;">Amount Paid</div>
              <div style="color: #6b7280;">₦${(
                booking.payment.amount / 100
              ).toFixed(2)}</div>
            </div>
          </div>

          <div style="text-align: center; margin: 20px 0;">
            <div style="font-weight: bold; color: #374151; margin-bottom: 10px;">Scan QR Code for Ticket Details</div>
            <img src="${qrCodeUrl}" alt="QR Code" style="max-width: 150px; height: auto; border: 1px solid #e5e7eb; padding: 10px; background: white;" />
          </div>
        </div>

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
          <p>This is your official parking ticket. Please keep this with you during your parking session.</p>
          <p>Generated on ${format(new Date(), "PPpp")}</p>
        </div>
      </div>
    `;
  };

  const duration = Math.round(
    (new Date(booking.endTime).getTime() -
      new Date(booking.startTime).getTime()) /
      (1000 * 60 * 60)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Parking E-Ticket
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="text-center border-b pb-4">
            <h2 className="text-2xl font-bold text-blue-600">ParkAccess</h2>
            <p className="text-gray-600">Booking ID: {booking._id}</p>
            <div className="mt-2 flex justify-center">
              {getStatusBadge(booking.timeStatus)}
            </div>
          </div>

          {/* Main Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {booking.parkingLot.name}
              </CardTitle>
              <p className="text-gray-600">{booking.parkingLot.location}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-gray-600">
                      {format(
                        new Date(booking.startTime),
                        "EEEE, MMMM d, yyyy"
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-gray-600">
                      {format(new Date(booking.startTime), "h:mm a")} -{" "}
                      {format(new Date(booking.endTime), "h:mm a")}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="font-medium">Parking Spot</p>
                  <p className="text-gray-600">Spot {booking.spotNumber}</p>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">License Plate</p>
                  <p className="text-gray-600 font-mono">
                    {booking.carDetails.licensePlate}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Vehicle</p>
                  <p className="text-gray-600">{booking.carDetails.carModel}</p>
                </div>
                <div>
                  <p className="font-medium">Color</p>
                  <p className="text-gray-600">{booking.carDetails.carColor}</p>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">Amount Paid</p>
                    <p className="text-gray-600">
                      ₦{(booking.payment.amount / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          <div className="text-center">
            <h3 className="font-medium mb-3">
              Scan QR Code for Ticket Details
            </h3>
            {qrCodeUrl ? (
              <div className="flex justify-center">
                <img
                  src={qrCodeUrl}
                  alt="Ticket QR Code"
                  className="w-32 h-32 border-2 border-gray-200 rounded-lg p-2 bg-white"
                />
              </div>
            ) : (
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 mx-auto flex items-center justify-center text-gray-400 text-sm">
                Generating QR...
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Show this QR code for quick entry/exit verification
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handlePrint} variant="outline" className="flex-1">
              <Printer className="h-4 w-4 mr-2" />
              Print Ticket
            </Button>
            <Button onClick={handleDownload} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>

          <div className="text-center text-xs text-gray-500 pt-4 border-t">
            <p>This is your official parking ticket.</p>
            <p>Please keep this with you during your parking session.</p>
            <p>Generated on {format(new Date(), "PPpp")}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ETicket;
