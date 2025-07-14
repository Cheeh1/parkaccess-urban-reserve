import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Search, MapPin } from "lucide-react";

interface ParkingSearchProps {
  location: string;
  setLocation: (value: string) => void;
  name: string;
  setName: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
  entryTime: string;
  setEntryTime: (value: string) => void;
  exitTime: string;
  setExitTime: (value: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

const ParkingSearch = ({
  location,
  setLocation,
  name,
  setName,
  date,
  setDate,
  entryTime,
  setEntryTime,
  exitTime,
  setExitTime,
  handleSearch,
}: ParkingSearchProps) => {
  return (
    <div className="mb-8">
      <Card>
        <CardContent className="p-6">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-6 gap-4"
          >
            <div className="space-y-1">
              <label className="parking-label flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Location
              </label>
              <Input
                type="text"
                placeholder="Enter address or landmark"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="parking-input"
              />
            </div>

            <div className="space-y-1">
              <label className="parking-label flex items-center gap-1">
                <Search className="h-4 w-4" />
                Parking Lot Name
              </label>
              <Input
                type="text"
                placeholder="Search by parking lot name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="parking-input"
              />
            </div>

            <div className="space-y-1">
              <label className="parking-label flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Date
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="parking-input"
              />
            </div>

            <div className="space-y-1">
              <label className="parking-label flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Entry Time
              </label>
              <Input
                type="time"
                value={entryTime}
                onChange={(e) => setEntryTime(e.target.value)}
                className="parking-input"
              />
            </div>

            <div className="space-y-1">
              <label className="parking-label flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Exit Time
              </label>
              <Input
                type="time"
                value={exitTime}
                onChange={(e) => setExitTime(e.target.value)}
                className="parking-input"
              />
            </div>

            <div className="md:col-span-6">
              <Button
                type="submit"
                className="w-full bg-parking-secondary hover:bg-parking-primary"
              >
                <Search className="mr-2 h-5 w-5" />
                Update Search
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParkingSearch;
