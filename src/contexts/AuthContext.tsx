import { createContext, useContext, useEffect, useState } from "react";
import { UserProfile, UserRole } from "@/types/auth";
import { getApiBaseUrl } from "@/utils/api";

// Custom user type for our backend
interface CustomUser {
  id: string;
  email: string;
  fullName?: string;
  role: UserRole;
  first_name?: string;
  last_name?: string;
  company_name?: string;
}

interface AuthContextType {
  user: CustomUser | null;
  profile: UserProfile | null;
  signUp: (
    email: string,
    password: string,
    userData: Partial<UserProfile>
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (token: string) => {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();

      // Create user object
      const userData: CustomUser = {
        id: data.data._id,
        email: data.data.email,
        fullName: data.data.fullName,
        role: data.data.role as UserRole,
        first_name: data.data.firstName,
        last_name: data.data.lastName,
        company_name: data.data.companyName,
      };

      // Create profile object
      const userProfile: UserProfile = {
        id: data.data._id,
        email: data.data.email,
        first_name: data.data.firstName || "",
        last_name: data.data.lastName || "",
        company_name: data.data.companyName || "",
        role: data.data.role as UserRole,
      };

      setUser(userData);
      setProfile(userProfile);
      return userProfile;
    } catch (error) {
      console.error("Exception fetching profile:", error);
      return null;
    }
  };

  useEffect(() => {
    // Check for existing token on app load
    const initializeAuth = async () => {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (token) {
        try {
          await fetchUserProfile(token);
        } catch (error) {
          // Token might be invalid, clear it
          localStorage.removeItem("token");
          localStorage.removeItem("id");
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    userData: Partial<UserProfile>
  ) => {
    try {
      setLoading(true);

      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: `${userData.first_name || ""} ${
            userData.last_name || ""
          }`.trim(),
          email,
          password,
          role: userData.role || "user",
          firstName: userData.first_name,
          lastName: userData.last_name,
          companyName: userData.company_name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const result = await response.json();

      // Don't auto-login after signup, let them verify email first
      // console.log("Registration successful:", result);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);

      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const result = await response.json();

      // Store token and user ID
      localStorage.setItem("token", result.token);
      localStorage.setItem("id", result.data._id);

      // Create user and profile objects
      const userData: CustomUser = {
        id: result.data._id,
        email: result.data.email,
        fullName: result.data.fullName,
        role: result.data.role as UserRole,
        first_name: result.data.firstName,
        last_name: result.data.lastName,
        company_name: result.data.companyName,
      };

      const userProfile: UserProfile = {
        id: result.data._id,
        email: result.data.email,
        first_name: result.data.firstName || "",
        last_name: result.data.lastName || "",
        company_name: result.data.companyName || "",
        role: result.data.role as UserRole,
      };

      setUser(userData);
      setProfile(userProfile);
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);

      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("id");

      // Clear state
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, signUp, signIn, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
