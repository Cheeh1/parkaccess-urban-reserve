import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { companySchema } from "@/utils/validationSchema";
import { Building, Lock, Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getApiBaseUrl } from "@/utils/api";

interface CompanyFormData {
  companyName: string;
  companyEmail: string;
  companyPassword: string;
}

export const CompanySignUpForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(companySchema),
  });

  const onSubmit = async (data: CompanyFormData) => {
    try {
      setLoading(true);
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: data.companyName,
          email: data.companyEmail,
          password: data.companyPassword,
          role: "company",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const result = await response.json();

      toast({
        title: "Registration successful!",
        description: "Your company account has been created.",
      });

      localStorage.setItem("token", result.token);
      navigate("/login");
    } catch (error: Error | unknown) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create company account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <div className="relative">
          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="companyName"
            {...register("companyName")}
            className="pl-10"
            placeholder="Acme Corp"
          />
        </div>
        {errors.companyName && (
          <p className="text-red-500 text-xs">{errors.companyName.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="companyEmail">Company Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="companyEmail"
            {...register("companyEmail")}
            className="pl-10"
            placeholder="info@company.com"
          />
        </div>
        {errors.companyEmail && (
          <p className="text-red-500 text-xs">{errors.companyEmail.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="companyPassword">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="companyPassword"
            type="password"
            {...register("companyPassword")}
            className="pl-10"
            placeholder="********"
          />
        </div>
        {errors.companyPassword && (
          <p className="text-red-500 text-xs">
            {errors.companyPassword.message}
          </p>
        )}
      </div>
      <div className="pt-2">
        <Button
          type="submit"
          className="w-full bg-parking-secondary hover:bg-parking-primary h-11"
          disabled={loading}
        >
          {loading ? "Creating Company Account..." : "Sign Up as Company"}
        </Button>
      </div>
    </form>
  );
};
