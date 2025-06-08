import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ParkingLotHeader from "./ParkingLotHeader";
import ParkingLotDetails from "./ParkingLotDetails";
import ParkingLocationMap from "./ParkingLocationMap";

interface ParkingLotCardProps {
  id: string;
  name: string;
  address: string;
  price: number;
  availableSpots: number;
  totalSpots: number;
  distance: number;
  spotId: string;
  image: string;
}

const ParkingLotCard = ({
  id,
  name,
  address,
  price,
  availableSpots,
  totalSpots,
  distance,
  spotId,
  image,
}: ParkingLotCardProps) => {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = React.useState(false);

  const handleReserve = () => {
    navigate(`/book/${id}`);
  };

  return (
    <>
      <Card className="overflow-hidden">
        <div className="relative aspect-video">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        <CardContent className="p-6">
          <ParkingLotHeader name={name} address={address} price={price} />

          <ParkingLotDetails
            availableSpots={availableSpots}
            totalSpots={totalSpots}
            distance={distance}
          />

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowDetails(true)}
            >
              View Details
            </Button>
            <Button
              className="flex-1"
              onClick={handleReserve}
              disabled={availableSpots === 0}
            >
              {availableSpots === 0 ? "No Spots Available" : "Book Now"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
          </DialogHeader>
          <div className="h-[300px] mb-4">
            <ParkingLocationMap
              location={{
                name,
                address,
                coordinates: [3.3792, 6.5244], // Default coordinates for Ilorin
              }}
            />
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Location Details</h4>
              <p className="text-muted-foreground">{address}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Availability</h4>
              <p className="text-muted-foreground">
                {availableSpots} spots available out of {totalSpots} total spots
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Pricing</h4>
              <p className="text-muted-foreground">₦{price} per hour</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ParkingLotCard;
