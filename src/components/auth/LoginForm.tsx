import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, Eye, EyeOff, Lock, Mail } from "lucide-react";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import { useToast } from "@/components/ui/use-toast";
import { loginSchema } from "@/utils/validationSchema";
import { useAuth } from "@/contexts/AuthContext";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      await signIn(data.email, data.password);

      toast({
        title: "Login successful!",
        description: "Welcome back to PARKACCESS.",
      });

      // Check if user was trying to access a protected route before login
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (error: Error | unknown) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description:
          error instanceof Error
            ? error.message
            : "Invalid login credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-md w-full">
      <div className="text-center mb-6">
        <div className="flex justify-center">
          <Car className="h-12 w-12 text-parking-primary" />
        </div>
        <h2 className="mt-2 text-3xl font-bold text-parking-dark">
          Welcome Back to PARKACCESS
        </h2>
        <p className="mt-2 text-gray-600">
          Sign in to access your account and manage your parking reservations.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="pl-10"
                  placeholder="johndoe@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-parking-secondary hover:text-parking-primary"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="pl-10 pr-10"
                  placeholder="********"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full bg-parking-secondary hover:bg-parking-primary h-11"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <SocialLoginButtons />
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/sign-up"
              className="text-parking-secondary hover:text-parking-primary font-medium"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
