import React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema } from "@/utils/validationSchema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import MainLayout from '../layout/MainLayout';
import { Car, Lock, Mail, User } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const UserAuth = () => {
     const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: yupResolver(userSchema),
      });

      const onSubmit = async (data) => {
        console.log(data);
      }

  return (
    <MainLayout>
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-md w-full">
            <div className="text-center mb-6">
              <div className="flex justify-center">
                <Car className="h-12 w-12 text-parking-primary" />
              </div>
              <h2 className="mt-2 text-3xl font-bold text-parking-dark">
                Create Your PARKACCESS Account
              </h2>
              <p className="mt-2 text-gray-600">
                Sign up to start booking parking spaces easily.
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Sign Up</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="firstName"
                          {...register("firstName")}
                          className="pl-10"
                          placeholder="John"
                        />
                      </div>
                      {errors.firstName && (
                        <p className="text-red-500 text-xs">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="lastName"
                          {...register("lastName")}
                          className="pl-10"
                          placeholder="Doe"
                        />
                      </div>
                      {errors.lastName && (
                        <p className="text-red-500 text-xs">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        {...register("email")}
                        className="pl-10"
                        placeholder="johndoe@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        {...register("password")}
                        className="pl-10"
                        placeholder="********"
                      />
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...register("confirmPassword")}
                        className="pl-10"
                        placeholder="********"
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full bg-parking-secondary hover:bg-parking-primary h-11"
                    //   disabled={loading}
                    >
                      {/* {loading ? "Creating Account..." : "Sign Up"} */}
                      Sign Up
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-parking-secondary hover:text-parking-primary font-medium"
                  >
                    Log in
                  </Link>
                </p>
              </CardFooter>
            </Card>
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By signing up, you agree to our{" "}
                <Link
                  to="/terms"
                  className="text-parking-secondary hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-parking-secondary hover:underline"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </MainLayout>
  )
}

export default UserAuth