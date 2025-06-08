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

export const useParkingLot = (id: string) => {
  const [parkingLot, setParkingLot] = useState<ParkingLot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParkingLot = async () => {
      try {
        setLoading(true);
        const baseUrl = getApiBaseUrl();
        const response = await fetch(`${baseUrl}/parking-lots/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch parking lot details");
        }

        const result = await response.json();
        setParkingLot(result.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setParkingLot(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchParkingLot();
    }
  }, [id]);

  return { parkingLot, loading, error };
};
