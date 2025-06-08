import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { changePasswordSchema } from "@/utils/validationSchema";
import { getApiBaseUrl } from "@/utils/api";

interface ProfileSectionProps {
  user: {
    name: string;
    email: string;
    avatarUrl: string;
    joinDate: string;
  };
}

interface ChangePasswordFormData {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const ProfileSection = ({ user }: ProfileSectionProps) => {
  const { toast } = useToast();
  const { userData } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user.name.split(" ")[0],
    lastName: user.name.split(" ").slice(1).join(" "),
    email: user.email,
    // phone: "+234 801 234 5678",
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    reset: resetPasswordForm,
  } = useForm<ChangePasswordFormData>({
    resolver: yupResolver(changePasswordSchema),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: `${formData.firstName} ${formData.lastName}`,
          // phone: formData.phone,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description:
          error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const onPasswordSubmit = async (data: ChangePasswordFormData) => {
    try {
      const token = localStorage.getItem("token");
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change password");
      }

      toast({
        title: "Password Updated",
        description: "Your password has been successfully changed.",
      });
      resetPasswordForm();
    } catch (error) {
      toast({
        title: "Password Update Failed",
        description:
          error instanceof Error ? error.message : "Failed to change password",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
      {/* Personal Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full p-2 border rounded-md bg-gray-50"
              />
            </div>
            {/* <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div> */}
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
      {/* Change Password */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handlePasswordSubmit(onPasswordSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Password</label>
              <input
                type="password"
                {...registerPassword("oldPassword")}
                className="w-full p-2 border rounded-md"
              />
              {passwordErrors.oldPassword && (
                <p className="text-red-500 text-xs">
                  {passwordErrors.oldPassword.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <input
                type="password"
                {...registerPassword("newPassword")}
                className="w-full p-2 border rounded-md"
              />
              {passwordErrors.newPassword && (
                <p className="text-red-500 text-xs">
                  {passwordErrors.newPassword.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Confirm New Password
              </label>
              <input
                type="password"
                {...registerPassword("confirmPassword")}
                className="w-full p-2 border rounded-md"
              />
              {passwordErrors.confirmPassword && (
                <p className="text-red-500 text-xs">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={isPasswordSubmitting}>
              {isPasswordSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
      {/* Notifications Preferences */}
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
                <p className="text-sm text-gray-500">
                  Receive booking confirmations and updates
                </p>
              </div>
              <div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="toggle toggle-primary"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">SMS Notifications</h4>
                <p className="text-sm text-gray-500">
                  Receive text message alerts
                </p>
              </div>
              <div>
                <input type="checkbox" className="toggle toggle-primary" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Marketing Communications</h4>
                <p className="text-sm text-gray-500">
                  Receive news and promotional offers
                </p>
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
  );
};

export default ProfileSection;
