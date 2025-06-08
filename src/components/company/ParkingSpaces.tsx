import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Trash2, Plus, MapPin, Car } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { getApiBaseUrl } from "@/utils/api";

interface ParkingLot {
  _id: string;
  name: string;
  location: string;
  totalSpots: number;
  availableSpots: number;
  hourlyRate: number;
  images: string[];
  createdAt: string;
}

interface ApiResponse {
  data: ParkingLot[];
  message: string;
}

const ParkingSpaces = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [selectedParkingLot, setSelectedParkingLot] =
    useState<ParkingLot | null>(null);
  const [parkingLotData, setParkingLotData] = useState({
    name: "",
    location: "",
    totalSpots: "",
    hourlyRate: "",
    images: [] as File[],
  });

  // Fetch parking lots on component mount
  useEffect(() => {
    fetchParkingLots();
  }, []);

  const fetchParkingLots = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/parking-lots`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch parking lots");
      }

      const result: ApiResponse = await response.json();

      // Ensure we're setting an array
      if (Array.isArray(result.data)) {
        setParkingLots(result.data);
      } else {
        console.error("API response data is not an array:", result);
        setParkingLots([]);
        toast({
          title: "Error",
          description: "Invalid data format received from server",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching parking lots:", error);
      setParkingLots([]);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to fetch parking lots",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (parkingLot: ParkingLot) => {
    setSelectedParkingLot(parkingLot);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteParkingLot = async () => {
    if (!selectedParkingLot) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const baseUrl = getApiBaseUrl();
      const response = await fetch(
        `${baseUrl}/parking-lots/${selectedParkingLot._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete parking lot");
      }

      toast({
        title: "Success",
        description: "Parking lot deleted successfully",
      });

      setIsDeleteDialogOpen(false);
      fetchParkingLots();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete parking lot",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (parkingLot: ParkingLot) => {
    setSelectedParkingLot(parkingLot);
    setParkingLotData({
      name: parkingLot.name,
      location: parkingLot.location,
      totalSpots: parkingLot.totalSpots.toString(),
      hourlyRate: parkingLot.hourlyRate.toString(),
      images: [],
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateParkingLot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParkingLot) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();

      // Append text fields
      formData.append("name", parkingLotData.name);
      formData.append("location", parkingLotData.location);
      formData.append("totalSpots", parkingLotData.totalSpots);
      formData.append("hourlyRate", parkingLotData.hourlyRate);

      // Append images only if new ones are selected
      if (parkingLotData.images.length > 0) {
        parkingLotData.images.forEach((image) => {
          formData.append("images", image);
        });
      }

      const baseUrl = getApiBaseUrl();
      const response = await fetch(
        `${baseUrl}/parking-lots/${selectedParkingLot._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update parking lot");
      }

      toast({
        title: "Success",
        description: "Parking lot updated successfully",
      });

      setIsEditDialogOpen(false);
      fetchParkingLots();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update parking lot",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParkingLotData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setParkingLotData((prev) => ({
        ...prev,
        images: Array.from(e.target.files || []),
      }));
    }
  };

  const handleAddParkingLot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      // Append text fields
      formData.append("name", parkingLotData.name);
      formData.append("location", parkingLotData.location);
      formData.append("totalSpots", parkingLotData.totalSpots);
      formData.append("hourlyRate", parkingLotData.hourlyRate);

      // Append images
      parkingLotData.images.forEach((image) => {
        formData.append("images", image);
      });

      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/parking-lots`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add parking lot");
      }

      toast({
        title: "Success",
        description: "Parking lot added successfully",
      });

      // Reset form and close dialog
      setParkingLotData({
        name: "",
        location: "",
        totalSpots: "",
        hourlyRate: "",
        images: [],
      });
      setIsAddDialogOpen(false);

      // Refresh parking lots list
      fetchParkingLots();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add parking lot",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/parking-lot/${id}`);
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
                Enter the details of your new parking lot. Click save when
                you're done.
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
                  <Label htmlFor="images">Upload Images</Label>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    required
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Save Parking Lot"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Parking Lot</DialogTitle>
            <DialogDescription>
              Update the details of your parking lot. Click save when you're
              done.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateParkingLot}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Parking Lot Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={parkingLotData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Unity Road Complex"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  name="location"
                  value={parkingLotData.location}
                  onChange={handleInputChange}
                  placeholder="Full address"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-totalSpots">Total Spots</Label>
                <Input
                  id="edit-totalSpots"
                  name="totalSpots"
                  type="number"
                  value={parkingLotData.totalSpots}
                  onChange={handleInputChange}
                  placeholder="e.g. 50"
                  min="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-hourlyRate">Hourly Rate (₦)</Label>
                <Input
                  id="edit-hourlyRate"
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
                <Label htmlFor="edit-images">Update Images (Optional)</Label>
                <Input
                  id="edit-images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Parking Lot"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Parking Lot</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedParkingLot?.name}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteParkingLot}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {parkingLots.map((parkingLot) => (
          <Card key={parkingLot._id}>
            <CardContent className="p-0">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={parkingLot.images[0] || "/placeholder.svg"}
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
                    <p className="font-semibold">
                      ₦{parkingLot.hourlyRate * 24}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(parkingLot._id)}
                  >
                    View Details
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(parkingLot)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteClick(parkingLot)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {parkingLots.length === 0 && !isLoading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Car className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-900">
              No parking lots yet
            </h3>
            <p className="text-gray-500 mt-2 text-center">
              You haven't added any parking lots yet. Add your first parking lot
              to start receiving bookings.
            </p>
            <Button className="mt-6" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Parking Lot
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-parking-primary"></div>
        </div>
      )}
    </div>
  );
};

export default ParkingSpaces;
