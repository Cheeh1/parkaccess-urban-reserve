import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import CompanyProfile from "@/components/company/CompanyProfile";
import BookingHistory from "@/components/company/BookingHistory";
import ParkingSpaces from "@/components/company/ParkingSpaces";
import { useAuth } from "@/contexts/AuthContext";
import { analyticsApi } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

interface AnalyticsSummary {
  currentMonth: {
    revenue: {
      total: number;
      growthPercentage: number;
      previousMonth: number;
    };
    bookings: {
      total: number;
      growthPercentage: number;
      previousMonth: number;
    };
    customers: {
      total: number;
      newCustomers: number;
      returningCustomers: number;
    };
  };
  occupancy: {
    currentOccupancy: number;
    totalSpots: number;
    occupiedSpots: number;
    availableSpots: number;
    occupancyPercentage: number;
  };
}

interface RevenueChartData {
  month: string;
  revenue: number;
  bookings: number;
}

const COLORS = ["#0088FE", "#ECEFF1"];

const CompanyDashboard = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsSummary | null>(
    null
  );
  const [revenueChartData, setRevenueChartData] = useState<RevenueChartData[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      // Fetch summary data
      const summaryResponse = await analyticsApi.getSummary({
        month: currentMonth,
        year: currentYear,
      });

      // Fetch revenue chart data
      const chartResponse = await analyticsApi.getRevenueChart({
        months: 6,
        year: currentYear,
      });

      setAnalyticsData(summaryResponse.data);
      setRevenueChartData(chartResponse.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-parking-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-500">Authentication required</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const company = {
    name:
      profile?.company_name ||
      user?.company_name ||
      user?.fullName ||
      "Company",
    email: profile?.email || user?.email || "",
    phone: "+234 812 345 6789", // These fields might need to be added to the API response
    address: "15 Unity Road, Ilorin, Nigeria",
    logo: "",
    joinDate: new Date().toISOString(), // Default to current date
  };

  // Prepare occupancy data for pie chart
  const occupancyData = analyticsData
    ? [
        { name: "Occupied", value: analyticsData.occupancy.occupiedSpots },
        { name: "Available", value: analyticsData.occupancy.availableSpots },
      ]
    : [];

  // Transform revenue data for charts (convert from kobo to naira)
  const transformedRevenueData = revenueChartData.map((item) => ({
    ...item,
    amount: item.revenue / 100, // Convert from kobo to naira
  }));

  const transformedBookingData = revenueChartData.map((item) => ({
    name: item.month,
    bookings: item.bookings,
  }));

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Company Dashboard
          </h1>
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

        <Tabs
          defaultValue="analytics"
          className="space-y-6"
          onValueChange={setActiveTab}
        >
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
                  <div className="text-2xl font-bold">
                    ₦
                    {analyticsData
                      ? (
                          analyticsData.currentMonth.revenue.total / 100
                        ).toLocaleString()
                      : "0"}
                  </div>
                  <p
                    className={`text-xs flex items-center ${
                      analyticsData &&
                      analyticsData.currentMonth.revenue.growthPercentage >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    <span>
                      {analyticsData &&
                      analyticsData.currentMonth.revenue.growthPercentage >= 0
                        ? "↑"
                        : "↓"}{" "}
                      {analyticsData
                        ? Math.abs(
                            analyticsData.currentMonth.revenue.growthPercentage
                          ).toFixed(1)
                        : "0"}
                      % from last month
                    </span>
                  </p>

                  <div className="h-[100px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={transformedRevenueData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="month"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          formatter={(value) => [
                            `₦${Number(value).toLocaleString()}`,
                            "Revenue",
                          ]}
                        />
                        <Bar
                          dataKey="amount"
                          fill="#9b87f5"
                          radius={[4, 4, 0, 0]}
                        />
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
                  <div className="text-2xl font-bold">
                    {analyticsData
                      ? analyticsData.currentMonth.bookings.total
                      : "0"}
                  </div>
                  <p
                    className={`text-xs flex items-center ${
                      analyticsData &&
                      analyticsData.currentMonth.bookings.growthPercentage >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    <span>
                      {analyticsData &&
                      analyticsData.currentMonth.bookings.growthPercentage >= 0
                        ? "↑"
                        : "↓"}{" "}
                      {analyticsData
                        ? Math.abs(
                            analyticsData.currentMonth.bookings.growthPercentage
                          ).toFixed(1)
                        : "0"}
                      % from last month
                    </span>
                  </p>

                  <div className="h-[100px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={transformedBookingData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="name"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="bookings"
                          stroke="#1EAEDB"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
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
                  <div className="text-2xl font-bold">
                    {analyticsData
                      ? analyticsData.occupancy.occupancyPercentage
                      : "0"}
                    %
                  </div>
                  <p className="text-xs text-gray-500 flex items-center">
                    <span>
                      {analyticsData
                        ? analyticsData.occupancy.availableSpots
                        : "0"}{" "}
                      spaces available
                    </span>
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
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
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
                      data={transformedRevenueData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [
                          `₦${Number(value).toLocaleString()}`,
                          "Revenue",
                        ]}
                      />
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
