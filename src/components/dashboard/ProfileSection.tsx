
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProfileSectionProps {
  user: {
    name: string;
    email: string;
    avatarUrl: string;
    joinDate: string;
  }
}

const ProfileSection = ({ user }: ProfileSectionProps) => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
    {/* Personal Information */}
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">First Name</label>
              <input 
                type="text" 
                defaultValue={user.name.split(" ")[0]} 
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Last Name</label>
              <input 
                type="text" 
                defaultValue={user.name.split(" ").slice(1).join(" ")} 
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <input 
              type="email" 
              defaultValue={user.email} 
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <input 
              type="tel" 
              defaultValue="+234 801 234 5678" 
              className="w-full p-2 border rounded-md"
            />
          </div>
          <Button type="button">Save Changes</Button>
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
        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Password</label>
            <input 
              type="password" 
              className="w-full p-2 border rounded-md" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <input 
              type="password" 
              className="w-full p-2 border rounded-md" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm New Password</label>
            <input 
              type="password" 
              className="w-full p-2 border rounded-md" 
            />
          </div>
          <Button type="button">Update Password</Button>
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
              <p className="text-sm text-gray-500">Receive booking confirmations and updates</p>
            </div>
            <div>
              <input type="checkbox" defaultChecked className="toggle toggle-primary" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">SMS Notifications</h4>
              <p className="text-sm text-gray-500">Receive text message alerts</p>
            </div>
            <div>
              <input type="checkbox" className="toggle toggle-primary" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Marketing Communications</h4>
              <p className="text-sm text-gray-500">Receive news and promotional offers</p>
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

export default ProfileSection;
