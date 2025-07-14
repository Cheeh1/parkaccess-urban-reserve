import { useState, useEffect } from "react";
import { getApiBaseUrl } from "@/utils/api";

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

interface SearchParams {
  location?: string;
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  date?: string;
  entryTime?: string;
  exitTime?: string;
  trigger: number;
}

export const useParkingLots = (searchParams: SearchParams) => {
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParkingLots = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();

        if (searchParams.location)
          queryParams.append("location", searchParams.location);
        if (searchParams.name) queryParams.append("name", searchParams.name);
        if (searchParams.minPrice)
          queryParams.append("minPrice", searchParams.minPrice.toString());
        if (searchParams.maxPrice)
          queryParams.append("maxPrice", searchParams.maxPrice.toString());
        if (searchParams.date) queryParams.append("date", searchParams.date);
        if (searchParams.entryTime)
          queryParams.append("entryTime", searchParams.entryTime);
        if (searchParams.exitTime)
          queryParams.append("exitTime", searchParams.exitTime);

        const baseUrl = getApiBaseUrl();
        const endpoint = queryParams.toString()
          ? `${baseUrl}/parking-lots/search?${queryParams.toString()}`
          : `${baseUrl}/parking-lots`;

        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error("Failed to fetch parking lots");
        }

        const result = await response.json();
        setParkingLots(result.data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setParkingLots([]);
      } finally {
        setLoading(false);
      }
    };

    if (searchParams.trigger >= 0) {
      fetchParkingLots();
    }
  }, [searchParams.trigger]);

  return { parkingLots, loading, error };
};
