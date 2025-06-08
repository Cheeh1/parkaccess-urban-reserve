import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Clock,
  CreditCard,
  Filter,
  Search,
  FileText,
  User,
  Car,
  CalendarIcon,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import { timeSlotApi } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface CompanyBooking {
  bookingId: string;
  customer: {
    name: string;
    email: string;
  };
  parkingLot: {
    name: string;
    location: string;
  };
  spotNumber: number;
  dateTime: {
    startTime: string;
    endTime: string;
    duration: number;
  };
  carDetails: {
    licensePlate: string;
    carModel: string;
    carColor: string;
  };
  payment: {
    status: string;
    amount: number;
    reference: string;
    paidAt: string | null;
  };
  status: string;
  timeStatus: "active" | "upcoming" | "completed";
  createdAt: string;
}

type FilterType = "active" | "upcoming" | "completed" | null;

const BookingHistory = () => {
  const [bookings, setBookings] = useState<CompanyBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<CompanyBooking[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterType>(null);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);
  const { toast } = useToast();

  // Fetch booking history
  const fetchBookingHistory = async (filters?: {
    timeFilter?: "active" | "upcoming" | "completed";
    startDate?: string;
    endDate?: string;
  }) => {
    try {
      setLoading(true);
      const response = await timeSlotApi.getCompanyHistory(filters);
      setBookings(response.data || []);
    } catch (error) {
      console.error("Error fetching booking history:", error);
      toast({
        title: "Error",
        description: "Failed to fetch booking history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchBookingHistory();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...bookings];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (booking) =>
          booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.customer.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          booking.carDetails.licensePlate
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          booking.parkingLot.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, searchQuery]);

  // Handle status filter
  const handleStatusFilter = async (status: FilterType) => {
    setFilterStatus(status);
    const filters = status ? { timeFilter: status } : undefined;
    await fetchBookingHistory(filters);
  };

  // Handle date range filter
  const handleDateRangeFilter = async () => {
    if (!startDate || !endDate) {
      toast({
        title: "Invalid Date Range",
        description: "Please select both start and end dates",
        variant: "destructive",
      });
      return;
    }

    const filters = {
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
    };

    await fetchBookingHistory(filters);
  };

  // Clear date filters
  const clearDateFilters = async () => {
    setStartDate(undefined);
    setEndDate(undefined);
    await fetchBookingHistory();
  };

  // Export booking data
  const exportBookings = () => {
    if (filteredBookings.length === 0) {
      toast({
        title: "No Data to Export",
        description: "There are no bookings to export",
        variant: "destructive",
      });
      return;
    }

    const csvData = filteredBookings.map((booking) => ({
      "Booking ID": booking.bookingId || "N/A",
      "Customer Name": booking?.customer?.name || "N/A",
      "Customer Email": booking?.customer?.email || "N/A",
      "Car Plate": booking?.carDetails?.licensePlate || "N/A",
      "Car Model": booking?.carDetails?.carModel || "N/A",
      "Car Color": booking?.carDetails?.carColor || "N/A",
      "Parking Lot": booking?.parkingLot?.name || "N/A",
      Location: booking?.parkingLot?.location || "N/A",
      "Spot Number": booking?.spotNumber || "N/A",
      "Start Time": booking?.dateTime?.startTime
        ? format(new Date(booking.dateTime.startTime), "PPpp")
        : "N/A",
      "End Time": booking?.dateTime?.endTime
        ? format(new Date(booking.dateTime.endTime), "PPpp")
        : "N/A",
      Duration: booking?.dateTime?.duration
        ? `${booking.dateTime.duration} hours`
        : "N/A",
      Amount: booking?.payment?.amount
        ? `₦${(booking.payment.amount / 100).toFixed(2)}`
        : "N/A",
      Status: booking?.timeStatus || "N/A",
      "Payment Status": booking?.payment?.status || "N/A",
      "Payment Reference": booking?.payment?.reference || "N/A",
      "Booking Date": booking?.createdAt
        ? format(new Date(booking.createdAt), "PPpp")
        : "N/A",
    }));

    const csv = [
      Object.keys(csvData[0] || {}).join(","),
      ...csvData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute(
      "download",
      `booking-history-${format(new Date(), "yyyy-MM-dd")}.csv`
    );
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      case "unknown":
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-parking-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Booking History</CardTitle>
            <Button onClick={exportBookings} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="space-y-4 mb-6">
            {/* Search */}
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by booking ID, name, car plate, or location"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filterStatus === null ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusFilter(null)}
              >
                All Bookings
              </Button>
              <Button
                variant={filterStatus === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusFilter("active")}
              >
                Active
              </Button>
              <Button
                variant={filterStatus === "upcoming" ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusFilter("upcoming")}
              >
                Upcoming
              </Button>
              <Button
                variant={filterStatus === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusFilter("completed")}
              >
                Completed
              </Button>
            </div>

            {/* Date Range Filter */}
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover
                  open={isStartDateOpen}
                  onOpenChange={setIsStartDateOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[240px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        setStartDate(date);
                        setIsStartDateOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[240px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        setEndDate(date);
                        setIsEndDateOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button
                onClick={handleDateRangeFilter}
                disabled={!startDate || !endDate}
              >
                Apply Date Filter
              </Button>

              {(startDate || endDate) && (
                <Button onClick={clearDateFilters} variant="outline">
                  Clear Dates
                </Button>
              )}
            </div>
          </div>

          {/* Bookings Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Booking ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Vehicle
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Location & Spot
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Date & Time
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.bookingId || Math.random()}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 font-mono text-sm">
                      {booking.bookingId ? booking.bookingId.slice(-8) : "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium">
                            {booking?.customer?.name || "Unknown"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking?.customer?.email || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium">
                            {booking?.carDetails?.licensePlate || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking?.carDetails?.carModel || "N/A"} (
                            {booking?.carDetails?.carColor || "N/A"})
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">
                          {booking?.parkingLot?.name || "Unknown Lot"}
                        </div>
                        <div className="text-sm text-gray-500">
                          Spot {booking?.spotNumber || "N/A"} •{" "}
                          {booking?.parkingLot?.location || "Unknown Location"}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <div>
                            {booking?.dateTime?.startTime
                              ? format(
                                  new Date(booking.dateTime.startTime),
                                  "PPP"
                                )
                              : "N/A"}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {booking?.dateTime?.startTime &&
                            booking?.dateTime?.endTime
                              ? `${format(
                                  new Date(booking.dateTime.startTime),
                                  "p"
                                )} - ${format(
                                  new Date(booking.dateTime.endTime),
                                  "p"
                                )}`
                              : "Time N/A"}
                          </div>
                          {booking?.dateTime?.duration && (
                            <div className="text-xs text-blue-600">
                              {booking.dateTime.duration} hour
                              {booking.dateTime.duration !== 1 ? "s" : ""}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-400" />
                        <div>
                          <span className="font-medium">
                            {booking?.payment?.amount
                              ? `₦${(booking.payment.amount / 100).toFixed(2)}`
                              : "N/A"}
                          </span>
                          <div className="text-xs text-gray-500">
                            {booking?.payment?.status || "Unknown"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          booking?.timeStatus || "unknown"
                        )}`}
                      >
                        {booking?.timeStatus
                          ? booking.timeStatus.charAt(0).toUpperCase() +
                            booking.timeStatus.slice(1)
                          : "Unknown"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <FileText className="h-4 w-4" />
                        <span className="sr-only">View Receipt</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBookings.length === 0 && !loading && (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No bookings found</p>
              <p className="text-gray-400 text-sm">
                {searchQuery || filterStatus || startDate || endDate
                  ? "Try adjusting your filters"
                  : "Booking history will appear here when customers book parking spaces"}
              </p>
            </div>
          )}

          {/* Summary Stats */}
          {filteredBookings.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {filteredBookings.length}
                  </div>
                  <div className="text-sm text-gray-500">Total Bookings</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    ₦
                    {(
                      filteredBookings.reduce(
                        (sum, booking) => sum + (booking?.payment?.amount || 0),
                        0
                      ) / 100
                    ).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">Total Revenue</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {
                      filteredBookings.filter((b) => b?.timeStatus === "active")
                        .length
                    }
                  </div>
                  <div className="text-sm text-gray-500">Active Now</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {
                      filteredBookings.filter(
                        (b) => b?.timeStatus === "upcoming"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-gray-500">Upcoming</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingHistory;
