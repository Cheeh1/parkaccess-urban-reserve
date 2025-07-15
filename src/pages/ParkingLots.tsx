import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import ParkingSearch from "@/components/parking/ParkingSearch";
import ParkingFilters from "@/components/parking/ParkingFilters";
import ParkingLotsList from "@/components/parking/ParkingLotsList";
import FilterToggleButton from "@/components/parking/FilterToggleButton";
import { useParkingLots } from "@/hooks/useParkingLots";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Building2 } from "lucide-react";

interface ParkingLot {
  _id: string;
  name: string;
  location: string;
  totalSpots: number;
  hourlyRate: number;
  images: string[];
  createdBy: {
    _id: string;
    fullName: string;
    email: string;
  };
  createdAt: string;
}

const ParkingLots = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [date, setDate] = useState(searchParams.get("date") || "");
  const [entryTime, setEntryTime] = useState(
    searchParams.get("entryTime") || ""
  );
  const [exitTime, setExitTime] = useState(searchParams.get("exitTime") || "");
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedParkingLot, setSelectedParkingLot] =
    useState<ParkingLot | null>(null);
  const [searchTrigger, setSearchTrigger] = useState(0);

  useEffect(() => {
    setQuery(searchParams.get("query") || "");
    setDate(searchParams.get("date") || "");
    setEntryTime(searchParams.get("entryTime") || "");
    setExitTime(searchParams.get("exitTime") || "");
    setSearchTrigger((prev) => prev + 1);
  }, [searchParams]);

  const searchParamsObject = useMemo(
    () => ({
      query,
      date,
      entryTime,
      exitTime,
      minPrice,
      maxPrice,
      trigger: searchTrigger,
    }),
    [query, date, entryTime, exitTime, minPrice, maxPrice, searchTrigger]
  );

  const { parkingLots, loading, error } = useParkingLots(searchParamsObject);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTrigger((prev) => prev + 1);
    navigate(
      `/parking-lots?query=${encodeURIComponent(
        query
      )}&date=${encodeURIComponent(date)}&entryTime=${encodeURIComponent(
        entryTime
      )}&exitTime=${encodeURIComponent(exitTime)}`
    );
  };

  const handleBookNow = (parkingLot: ParkingLot) => {
    navigate(`/book/${parkingLot._id}`);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ParkingSearch
          query={query}
          setQuery={setQuery}
          date={date}
          setDate={setDate}
          entryTime={entryTime}
          setEntryTime={setEntryTime}
          exitTime={exitTime}
          setExitTime={setExitTime}
          handleSearch={handleSearch}
        />

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <FilterToggleButton
            isFilterOpen={isFilterOpen}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          />

          <div
            className={`lg:w-1/4 ${isFilterOpen ? "block" : "hidden"} lg:block`}
          >
            <ParkingFilters
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
            />
          </div>

          <div className="lg:w-3/4">
            <h2 className="text-2xl font-bold mb-4">Available Parking Lots</h2>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-parking-primary"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-4">{error}</div>
            ) : parkingLots.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No parking lots found matching your criteria
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parkingLots.map((lot) => (
                  <div
                    key={lot._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedParkingLot(lot)}
                  >
                    <div className="aspect-video relative">
                      <img
                        src={lot.images[0] || "/placeholder.svg"}
                        alt={lot.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">{lot.name}</h3>
                      <p className="text-gray-600 flex items-center mb-2">
                        <MapPin className="h-4 w-4 mr-2" />
                        {lot.location}
                      </p>
                      <p className="text-gray-600 flex items-center mb-4">
                        <Clock className="h-4 w-4 mr-2" />₦{lot.hourlyRate}/hour
                      </p>
                      <Button
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookNow(lot);
                        }}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={!!selectedParkingLot}
        onOpenChange={() => setSelectedParkingLot(null)}
      >
        <DialogContent className="max-w-2xl">
          {selectedParkingLot && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedParkingLot.name}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-video relative">
                  <img
                    src={selectedParkingLot.images[0] || "/placeholder.svg"}
                    alt={selectedParkingLot.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Location</h3>
                    <p className="text-gray-600 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {selectedParkingLot.location}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Pricing</h3>
                    <p className="text-gray-600 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />₦
                      {selectedParkingLot.hourlyRate}/hour
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Capacity</h3>
                    <p className="text-gray-600 flex items-center">
                      <Building2 className="h-4 w-4 mr-2" />
                      {selectedParkingLot.totalSpots} total spots
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Provider</h3>
                    <p className="text-gray-600">
                      {selectedParkingLot.createdBy.fullName}
                    </p>
                  </div>
                  <Button
                    className="w-full mt-4"
                    onClick={() => handleBookNow(selectedParkingLot)}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default ParkingLots;
