import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { companySchema } from "@/utils/validationSchema";
import { Building, Lock, Mail } from "lucide-react";

export const CompanySignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(companySchema),
  });

  const onSubmit = async (data) => {
    console.log(data);
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
        //   disabled={loading}
        >
          {/* {loading ? "Creating Company Account..." : "Sign Up as Company"} */}
          Sign Up as Company
        </Button>
      </div>
    </form>
  );
};
