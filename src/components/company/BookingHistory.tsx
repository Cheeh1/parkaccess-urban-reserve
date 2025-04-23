
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, CreditCard, Filter, Search, FileText, User, Car } from 'lucide-react';

// Mock booking data
const bookings = [
  {
    id: 'BK-001',
    customerName: 'John Doe',
    carPlate: 'ABC-123',
    parkingLot: 'Unity Road Complex',
    spotId: 'A-15',
    date: '2025-04-15',
    startTime: '09:00',
    endTime: '14:00',
    amount: 2500,
    status: 'completed',
  },
  {
    id: 'BK-002',
    customerName: 'Jane Smith',
    carPlate: 'XYZ-789',
    parkingLot: 'Unity Road Complex',
    spotId: 'B-22',
    date: '2025-04-18',
    startTime: '10:30',
    endTime: '12:30',
    amount: 1000,
    status: 'completed',
  },
  {
    id: 'BK-003',
    customerName: 'Michael Johnson',
    carPlate: 'DEF-456',
    parkingLot: 'Unity Road Complex',
    spotId: 'C-08',
    date: '2025-04-21',
    startTime: '13:00',
    endTime: '17:00',
    amount: 2000,
    status: 'active',
  },
  {
    id: 'BK-004',
    customerName: 'Sarah Wilson',
    carPlate: 'GHI-789',
    parkingLot: 'Unity Road Complex',
    spotId: 'A-05',
    date: '2025-04-23',
    startTime: '08:00',
    endTime: '18:00',
    amount: 5000,
    status: 'upcoming',
  },
];

const BookingHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.carPlate.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesFilter = filterStatus ? booking.status === filterStatus : true;
    
    return matchesSearch && matchesFilter;
  });
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Booking History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by booking ID, name, or car plate"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant={filterStatus === null ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(null)}
              >
                All
              </Button>
              <Button 
                variant={filterStatus === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("active")}
              >
                Active
              </Button>
              <Button 
                variant={filterStatus === "upcoming" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("upcoming")}
              >
                Upcoming
              </Button>
              <Button 
                variant={filterStatus === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("completed")}
              >
                Completed
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Booking ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Car Plate</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Location & Spot</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Date & Time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{booking.id}</td>
                    <td className="py-3 px-4 flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      {booking.customerName}
                    </td>
                    <td className="py-3 px-4 flex items-center gap-2">
                      <Car className="h-4 w-4 text-gray-400" />
                      {booking.carPlate}
                    </td>
                    <td className="py-3 px-4">{booking.parkingLot}, Spot {booking.spotId}</td>
                    <td className="py-3 px-4">
                      {new Date(booking.date).toLocaleDateString()}<br />
                      <span className="text-sm text-gray-500">
                        {booking.startTime} - {booking.endTime}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">₦{booking.amount}</td>
                    <td className="py-3 px-4">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
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
          
          {filteredBookings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No bookings found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingHistory;
