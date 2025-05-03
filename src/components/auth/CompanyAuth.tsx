import React from 'react'
import MainLayout from '../layout/MainLayout'
import { Building } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { CompanySignUpForm } from './CompanySignUpForm';
import { Link } from 'react-router-dom';

const CompanyAuth = () => {
  return (
    <MainLayout>
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="flex justify-center">
            <Building className="h-12 w-12 text-parking-secondary" />
          </div>
          <h2 className="mt-2 text-3xl font-bold text-parking-dark">
            Company Sign Up
          </h2>
          <p className="mt-2 text-gray-600">
            Create a company account to manage your parking lots and
            reservations.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Company Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <CompanySignUpForm />
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Already have a company account?{" "}
              <Link
                to="/company-login"
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

export default CompanyAuth