import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import ReservationsSection from "@/components/dashboard/ReservationsSection";
import PaymentSection from "@/components/dashboard/PaymentSection";
import ProfileSection from "@/components/dashboard/ProfileSection";
import { useAuth } from "@/hooks/useAuth";

// Mock payment methods
const paymentMethods = [
  {
    id: "card1",
    type: "Visa",
    number: "•••• •••• •••• 4242",
    expiry: "05/26",
    isDefault: true,
  },
  {
    id: "card2",
    type: "Mastercard",
    number: "•••• •••• •••• 5678",
    expiry: "09/25",
    isDefault: false,
  },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("reservations");
  const { userData, loading, error } = useAuth();

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-parking-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (error || !userData) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12 bg-red-50 rounded-lg">
            <h3 className="text-lg font-medium text-red-900">
              Authentication Error
            </h3>
            <p className="mt-1 text-red-600">
              {error || "Failed to load user data"}
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const user = {
    name: userData.fullName,
    email: userData.email,
    avatarUrl: "",
    joinDate: userData.createdAt,
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <DashboardSidebar
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <div className="w-full md:w-3/4">
            {activeTab === "reservations" && <ReservationsSection />}
            {activeTab === "payment" && (
              <PaymentSection paymentMethods={paymentMethods} />
            )}
            {activeTab === "profile" && <ProfileSection user={user} />}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
