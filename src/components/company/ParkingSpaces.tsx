
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Plus, Car, Pencil, Trash2, Info } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Mock parking lot data
const parkingLots = [
  {
    id: 'PL-001',
    name: 'Unity Road Complex',
    location: '15 Unity Road, Ilorin',
    totalSpots: 50,
    availableSpots: 12,
    hourlyRate: 500,
    dailyRate: 3000,
    images: ['/placeholder.svg'],
  },
  {
    id: 'PL-002',
    name: 'Central Market Parking',
    location: '8 Market Street, Ilorin',
    totalSpots: 30,
    availableSpots: 5,
    hourlyRate: 300,
    dailyRate: 2000,
    images: ['/placeholder.svg'],
  },
];

const ParkingSpaces = () => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [parkingLotData, setParkingLotData] = useState({
    name: '',
    location: '',
    totalSpots: '',
    hourlyRate: '',
    dailyRate: '',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParkingLotData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddParkingLot = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would make an API call to add a new parking lot
    toast({
      title: "Parking Lot Added",
      description: "Your new parking lot has been successfully added.",
    });
    setIsAddDialogOpen(false);
    // Reset form
    setParkingLotData({
      name: '',
      location: '',
      totalSpots: '',
      hourlyRate: '',
      dailyRate: '',
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Parking Spaces</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Parking Lot
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Parking Lot</DialogTitle>
              <DialogDescription>
                Enter the details of your new parking lot. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleAddParkingLot}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Parking Lot Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={parkingLotData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Unity Road Complex"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={parkingLotData.location}
                    onChange={handleInputChange}
                    placeholder="Full address"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="totalSpots">Total Spots</Label>
                  <Input
                    id="totalSpots"
                    name="totalSpots"
                    type="number"
                    value={parkingLotData.totalSpots}
                    onChange={handleInputChange}
                    placeholder="e.g. 50"
                    min="1"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Hourly Rate (₦)</Label>
                    <Input
                      id="hourlyRate"
                      name="hourlyRate"
                      type="number"
                      value={parkingLotData.hourlyRate}
                      onChange={handleInputChange}
                      placeholder="e.g. 500"
                      min="0"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dailyRate">Daily Rate (₦)</Label>
                    <Input
                      id="dailyRate"
                      name="dailyRate"
                      type="number"
                      value={parkingLotData.dailyRate}
                      onChange={handleInputChange}
                      placeholder="e.g. 3000"
                      min="0"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="images">Upload Images</Label>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit">Save Parking Lot</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {parkingLots.map((parkingLot) => (
          <Card key={parkingLot.id}>
            <CardContent className="p-0">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={parkingLot.images[0]}
                  alt={parkingLot.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold">{parkingLot.name}</h3>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {parkingLot.location}
                </p>
                
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-500">Total Spots</p>
                    <p className="font-semibold">{parkingLot.totalSpots}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-500">Available</p>
                    <p className="font-semibold">{parkingLot.availableSpots}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-500">Hourly Rate</p>
                    <p className="font-semibold">₦{parkingLot.hourlyRate}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-500">Daily Rate</p>
                    <p className="font-semibold">₦{parkingLot.dailyRate}</p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between">
                  <Button variant="outline" size="sm">
                    <Info className="h-4 w-4 mr-2" />
                    Details
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {parkingLots.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Car className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-900">No parking lots yet</h3>
            <p className="text-gray-500 mt-2 text-center">
              You haven't added any parking lots yet. Add your first parking lot to start receiving bookings.
            </p>
            <Button
              className="mt-6"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Parking Lot
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ParkingSpaces;
