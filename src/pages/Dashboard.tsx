
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Car, Clock, CreditCard, File, LogOut, MapPin, Settings, Star } from 'lucide-react';

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
  
  // Filter reservations by status
  const upcomingReservations = reservations.filter(res => res.status === 'upcoming');
  const pastReservations = reservations.filter(res => res.status === 'completed');
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <Card>
              <CardContent className="p-6">
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
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="w-full md:w-3/4">
            {/* Reservations Tab */}
            {activeTab === 'reservations' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">My Reservations</h2>
                
                <Tabs defaultValue="upcoming">
                  <TabsList className="mb-4">
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="past">Past</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upcoming">
                    {upcomingReservations.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <Car className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No upcoming reservations</h3>
                        <p className="mt-1 text-gray-500">You don't have any parking reservations scheduled.</p>
                        <div className="mt-6">
                          <Button onClick={() => window.location.href = '/parking-lots'}>
                            Find Parking
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {upcomingReservations.map((reservation) => (
                          <Card key={reservation.id} className="overflow-hidden">
                            <CardContent className="p-0">
                              <div className="p-4 border-l-4 border-parking-secondary">
                                <div className="flex flex-col md:flex-row md:items-center justify-between">
                                  <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{reservation.parkingLotName}</h3>
                                    <div className="mt-1 flex items-center text-sm text-gray-500">
                                      <MapPin className="h-4 w-4 mr-1" />
                                      Spot ID: {reservation.spotId}
                                    </div>
                                  </div>
                                  <div className="mt-4 md:mt-0">
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                      Upcoming
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="flex items-center">
                                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                                    <span className="text-gray-600">{new Date(reservation.date).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                                    <span className="text-gray-600">{reservation.startTime} - {reservation.endTime}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                                    <span className="text-gray-600">₦{reservation.totalPrice}</span>
                                  </div>
                                </div>
                                
                                <div className="mt-6 flex items-center justify-end space-x-4">
                                  <Button variant="outline" size="sm" className="border-gray-300">
                                    <File className="h-4 w-4 mr-1" />
                                    View E-Ticket
                                  </Button>
                                  <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="past">
                    {pastReservations.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <Clock className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No past reservations</h3>
                        <p className="mt-1 text-gray-500">You haven't made any parking reservations yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {pastReservations.map((reservation) => (
                          <Card key={reservation.id} className="overflow-hidden">
                            <CardContent className="p-0">
                              <div className="p-4 border-l-4 border-gray-300">
                                <div className="flex flex-col md:flex-row md:items-center justify-between">
                                  <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{reservation.parkingLotName}</h3>
                                    <div className="mt-1 flex items-center text-sm text-gray-500">
                                      <MapPin className="h-4 w-4 mr-1" />
                                      Spot ID: {reservation.spotId}
                                    </div>
                                  </div>
                                  <div className="mt-4 md:mt-0">
                                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                                      Completed
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="flex items-center">
                                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                                    <span className="text-gray-600">{new Date(reservation.date).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                                    <span className="text-gray-600">{reservation.startTime} - {reservation.endTime}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                                    <span className="text-gray-600">₦{reservation.totalPrice}</span>
                                  </div>
                                </div>
                                
                                <div className="mt-6 flex items-center justify-end space-x-4">
                                  <Button variant="outline" size="sm" className="border-gray-300">
                                    <File className="h-4 w-4 mr-1" />
                                    View Receipt
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Star className="h-4 w-4 mr-1" />
                                    Rate Experience
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )}
            
            {/* Payment Methods Tab */}
            {activeTab === 'payment' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Payment Methods</h2>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Saved Payment Methods</CardTitle>
                    <CardDescription>Manage your saved payment methods</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {paymentMethods.map((method) => (
                      <div 
                        key={method.id} 
                        className="flex items-center justify-between p-4 border rounded-md mb-4"
                      >
                        <div className="flex items-center">
                          {method.type === 'Visa' ? (
                            <div className="h-10 w-16 bg-blue-600 text-white flex items-center justify-center rounded-md mr-3">
                              <span className="font-bold">VISA</span>
                            </div>
                          ) : (
                            <div className="h-10 w-16 bg-red-500 text-white flex items-center justify-center rounded-md mr-3">
                              <span className="font-bold">MC</span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{method.number}</p>
                            <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {method.isDefault && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-4">
                              Default
                            </span>
                          )}
                          <Button variant="ghost" size="sm" className="h-8 text-gray-600">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 text-red-500">
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <Button className="mt-4">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Add Payment Method
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">First Name</label>
                          <input 
                            type="text" 
                            defaultValue="John" 
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Last Name</label>
                          <input 
                            type="text" 
                            defaultValue="Doe" 
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <input 
                          type="email" 
                          defaultValue={user.email} 
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Phone Number</label>
                        <input 
                          type="tel" 
                          defaultValue="+234 801 234 5678" 
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      
                      <Button type="button">Save Changes</Button>
                    </form>
                  </CardContent>
                </Card>
                
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your password</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Current Password</label>
                        <input 
                          type="password" 
                          className="w-full p-2 border rounded-md" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">New Password</label>
                        <input 
                          type="password" 
                          className="w-full p-2 border rounded-md" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Confirm New Password</label>
                        <input 
                          type="password" 
                          className="w-full p-2 border rounded-md" 
                        />
                      </div>
                      
                      <Button type="button">Update Password</Button>
                    </form>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage your notification settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-gray-500">Receive booking confirmations and updates</p>
                        </div>
                        <div>
                          <input type="checkbox" defaultChecked className="toggle toggle-primary" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">SMS Notifications</h4>
                          <p className="text-sm text-gray-500">Receive text message alerts</p>
                        </div>
                        <div>
                          <input type="checkbox" className="toggle toggle-primary" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Marketing Communications</h4>
                          <p className="text-sm text-gray-500">Receive news and promotional offers</p>
                        </div>
                        <div>
                          <input type="checkbox" className="toggle toggle-primary" />
                        </div>
                      </div>
                      
                      <Button type="button">Save Preferences</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
