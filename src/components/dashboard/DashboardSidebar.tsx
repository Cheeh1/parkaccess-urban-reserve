
import React from "react";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, CreditCard, Settings, LogOut } from "lucide-react";

interface DashboardSidebarProps {
  user: {
    name: string;
    email: string;
    avatarUrl: string;
    joinDate: string;
  };
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardSidebar = ({ user, activeTab, setActiveTab }: DashboardSidebarProps) => {
  return (
    <div className="w-full md:w-1/4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="text-2xl bg-parking-primary text-white">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <h2 className="mt-4 text-xl font-bold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-500 mt-2">Member since {new Date(user.joinDate).toLocaleDateString()}</p>
        </div>
        <nav className="mt-8 space-y-1">
          <Button 
            variant={activeTab === 'reservations' ? 'default' : 'ghost'} 
            className="w-full justify-start"
            onClick={() => setActiveTab('reservations')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            My Reservations
          </Button>
          <Button 
            variant={activeTab === 'payment' ? 'default' : 'ghost'} 
            className="w-full justify-start"
            onClick={() => setActiveTab('payment')}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Payment Methods
          </Button>
          <Button 
            variant={activeTab === 'profile' ? 'default' : 'ghost'} 
            className="w-full justify-start"
            onClick={() => setActiveTab('profile')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Account Settings
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => {
              // Handle logout
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </nav>
      </div>
    </div>
  );
};

export default DashboardSidebar;
