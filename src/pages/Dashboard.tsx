import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import ReservationsSection from '@/components/dashboard/ReservationsSection';
import PaymentSection from '@/components/dashboard/PaymentSection';
import ProfileSection from '@/components/dashboard/ProfileSection';

// Mock user data
const user = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatarUrl: '',
  joinDate: '2023-06-15',
};

// Mock reservation data
const reservations = [
  {
    id: 'res1',
    parkingLotName: 'Unity Road Parking Complex',
    spotId: 'A-15',
    date: '2025-04-25',
    startTime: '09:00',
    endTime: '12:00',
    totalPrice: 1500,
    status: 'upcoming',
  },
  {
    id: 'res2',
    parkingLotName: 'Central Market Parking',
    spotId: 'C-08',
    date: '2025-04-27',
    startTime: '13:00',
    endTime: '15:00',
    totalPrice: 600,
    status: 'upcoming',
  },
  {
    id: 'res3',
    parkingLotName: 'Stadium Parking Area',
    spotId: 'B-22',
    date: '2025-03-15',
    startTime: '17:00',
    endTime: '20:00',
    totalPrice: 1200,
    status: 'completed',
  },
  {
    id: 'res4',
    parkingLotName: 'Garden City Mall Parking',
    spotId: 'D-05',
    date: '2025-03-05',
    startTime: '10:00',
    endTime: '14:00',
    totalPrice: 2800,
    status: 'completed',
  },
];

// Mock payment methods
const paymentMethods = [
  {
    id: 'card1',
    type: 'Visa',
    number: '•••• •••• •••• 4242',
    expiry: '05/26',
    isDefault: true,
  },
  {
    id: 'card2',
    type: 'Mastercard',
    number: '•••• •••• •••• 5678',
    expiry: '09/25',
    isDefault: false,
  },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('reservations');

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <DashboardSidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="w-full md:w-3/4">
            {activeTab === 'reservations' && (
              <ReservationsSection reservations={reservations} />
            )}
            {activeTab === 'payment' && (
              <PaymentSection paymentMethods={paymentMethods} />
            )}
            {activeTab === 'profile' && (
              <ProfileSection user={user} />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
