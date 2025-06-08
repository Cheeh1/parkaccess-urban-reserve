import { useState, useEffect } from "react";
import { getApiBaseUrl } from "@/utils/api";

interface UserData {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

interface AuthResponse {
  success: boolean;
  token: string;
  data: UserData;
}

export const useAuth = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("id");

        if (!token || !userId) {
          throw new Error("No authentication token found");
        }

        const baseUrl = getApiBaseUrl();
        const response = await fetch(`${baseUrl}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data: AuthResponse = await response.json();
        setUserData(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { userData, loading, error };
};
