
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import CompanyProfile from '@/components/company/CompanyProfile';
import BookingHistory from '@/components/company/BookingHistory';
import ParkingSpaces from '@/components/company/ParkingSpaces';

// Mock company data
const company = {
  name: "ParkEasy Solutions",
  email: "info@parkeasy.com",
  phone: "+234 812 345 6789",
  address: "15 Unity Road, Ilorin, Nigeria",
  logo: "",
  joinDate: "2023-05-10",
};

// Mock revenue data
const revenueData = [
  { name: 'Jan', amount: 21000 },
  { name: 'Feb', amount: 24000 },
  { name: 'Mar', amount: 18000 },
  { name: 'Apr', amount: 26000 },
  { name: 'May', amount: 30000 },
  { name: 'Jun', amount: 31500 },
  { name: 'Jul', amount: 34000 },
];

// Mock booking data
const bookingData = [
  { name: 'Jan', bookings: 120 },
  { name: 'Feb', bookings: 148 },
  { name: 'Mar', bookings: 110 },
  { name: 'Apr', bookings: 178 },
  { name: 'May', bookings: 190 },
  { name: 'Jun', bookings: 205 },
  { name: 'Jul', bookings: 217 },
];

// Mock occupancy data
const occupancyData = [
  { name: 'Occupied', value: 75 },
  { name: 'Available', value: 25 },
];

const COLORS = ['#0088FE', '#ECEFF1'];

const CompanyDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
          <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src={company.logo} alt={company.name} />
              <AvatarFallback className="bg-parking-primary text-white">
                {company.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{company.name}</p>
              <p className="text-xs text-gray-500">{company.email}</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="parking-spaces">Parking Spaces</TabsTrigger>
            <TabsTrigger value="booking-history">Booking History</TabsTrigger>
            <TabsTrigger value="profile">Company Profile</TabsTrigger>
          </TabsList>

          {/* Analytics Tab Content */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Total Revenue</CardTitle>
                  <CardDescription>This Month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₦34,000</div>
                  <p className="text-xs text-green-500 flex items-center">
                    <span>↑ 8.2% from last month</span>
                  </p>
                  
                  <div className="h-[100px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Bar dataKey="amount" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Total Bookings</CardTitle>
                  <CardDescription>This Month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">217</div>
                  <p className="text-xs text-green-500 flex items-center">
                    <span>↑ 5.9% from last month</span>
                  </p>
                  
                  <div className="h-[100px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={bookingData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="bookings" stroke="#1EAEDB" strokeWidth={2} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Current Occupancy</CardTitle>
                  <CardDescription>Live Status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">75%</div>
                  <p className="text-xs text-gray-500 flex items-center">
                    <span>25% spaces available</span>
                  </p>
                  
                  <div className="h-[100px] mt-4 flex justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={occupancyData}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={45}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {occupancyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={revenueData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="amount" name="Revenue (₦)" fill="#9b87f5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Parking Spaces Tab Content */}
          <TabsContent value="parking-spaces">
            <ParkingSpaces />
          </TabsContent>

          {/* Booking History Tab Content */}
          <TabsContent value="booking-history">
            <BookingHistory />
          </TabsContent>

          {/* Company Profile Tab Content */}
          <TabsContent value="profile">
            <CompanyProfile company={company} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default CompanyDashboard;
