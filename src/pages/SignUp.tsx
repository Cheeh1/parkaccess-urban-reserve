
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Car, Lock, Mail, User, Building } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const SignUpTypeModal = ({ open, onSelect }) => (
  <Dialog open={open}>
    <DialogContent className="max-w-sm">
      <DialogHeader>
        <DialogTitle>Select Account Type</DialogTitle>
        <DialogDescription>
          Choose if you're signing up as a user or a company.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-4 mt-4">
        <Button
          className="w-full h-12 flex items-center justify-center gap-2 bg-parking-primary hover:bg-parking-secondary"
          onClick={() => onSelect('user')}
        >
          <User />
          User Account
        </Button>
        <Button
          className="w-full h-12 flex items-center justify-center gap-2 bg-parking-secondary hover:bg-parking-primary"
          onClick={() => onSelect('company')}
        >
          <Building />
          Company Account
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

const CompanySignUpForm = ({ onSubmit, loading, errors, values, onChange }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="companyName">Company Name</Label>
      <div className="relative">
        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          id="companyName"
          type="text"
          value={values.companyName}
          onChange={e => onChange('companyName', e.target.value)}
          className="pl-10"
          placeholder="Acme Corp"
        />
      </div>
      {errors.companyName && <p className="text-red-500 text-xs">{errors.companyName}</p>}
    </div>
    <div className="space-y-2">
      <Label htmlFor="companyEmail">Company Email</Label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          id="companyEmail"
          type="email"
          value={values.companyEmail}
          onChange={e => onChange('companyEmail', e.target.value)}
          className="pl-10"
          placeholder="info@company.com"
        />
      </div>
      {errors.companyEmail && <p className="text-red-500 text-xs">{errors.companyEmail}</p>}
    </div>
    <div className="space-y-2">
      <Label htmlFor="companyPassword">Password</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          id="companyPassword"
          type="password"
          value={values.companyPassword}
          onChange={e => onChange('companyPassword', e.target.value)}
          className="pl-10"
          placeholder="********"
        />
      </div>
      {errors.companyPassword && <p className="text-red-500 text-xs">{errors.companyPassword}</p>}
    </div>
    <div className="pt-2">
      <Button type="submit" className="w-full bg-parking-secondary hover:bg-parking-primary h-11" disabled={loading}>
        {loading ? 'Creating Company Account...' : 'Sign Up as Company'}
      </Button>
    </div>
  </form>
);

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // --- State for selecting account type ---
  const [modalOpen, setModalOpen] = useState(true);
  const [selectedType, setSelectedType] = useState<'user' | 'company' | null>(null);

  // --- User sign up state ---
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    companyName?: string;
    companyEmail?: string;
    companyPassword?: string;
  }>({});

  // --- Company sign up state ---
  const [companyValues, setCompanyValues] = useState({
    companyName: '',
    companyEmail: '',
    companyPassword: '',
  });

  // Show modal on mount
  useEffect(() => {
    setModalOpen(true);
  }, []);

  const validateUserForm = () => {
    const newErrors: {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCompanyForm = () => {
    const newErrors: {
      companyName?: string;
      companyEmail?: string;
      companyPassword?: string;
    } = {};
    if (!companyValues.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!companyValues.companyEmail.trim()) {
      newErrors.companyEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(companyValues.companyEmail)) {
      newErrors.companyEmail = 'Email is invalid';
    }
    if (!companyValues.companyPassword) {
      newErrors.companyPassword = 'Password is required';
    } else if (companyValues.companyPassword.length < 8) {
      newErrors.companyPassword = 'Password must be at least 8 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUserSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUserForm()) return;
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Account created successfully",
        description: "Welcome to PARKACCESS! You can now log in with your credentials.",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error creating account",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompanySignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCompanyForm()) return;
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Company account created",
        description: "Welcome to PARKACCESS for Companies! You can now log in.",
      });
      navigate('/company-login');
    } catch (error) {
      toast({
        title: "Error creating company account",
        description: "There was an error creating your company account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!selectedType) {
    return (
      <SignUpTypeModal
        open={modalOpen}
        onSelect={type => {
          setSelectedType(type);
          setModalOpen(false);
        }}
      />
    );
  }

  // User Account Sign-Up Form (existing)
  if (selectedType === 'user') {
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
                <form onSubmit={handleUserSignUp} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="firstName"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="pl-10"
                          placeholder="John"
                        />
                      </div>
                      {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="lastName"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="pl-10"
                          placeholder="Doe"
                        />
                      </div>
                      {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        placeholder="johndoe@example.com"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        placeholder="********"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10"
                        placeholder="********"
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
                  </div>
                  <div className="pt-2">
                    <Button type="submit" className="w-full bg-parking-secondary hover:bg-parking-primary h-11" disabled={loading}>
                      {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-parking-secondary hover:text-parking-primary font-medium">
                    Log in
                  </Link>
                </p>
              </CardFooter>
            </Card>
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By signing up, you agree to our{' '}
                <Link to="/terms" className="text-parking-secondary hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-parking-secondary hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Company Account Sign-Up Form
  if (selectedType === 'company') {
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
                Create a company account to manage your parking lots and reservations.
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Company Sign Up</CardTitle>
              </CardHeader>
              <CardContent>
                <CompanySignUpForm
                  onSubmit={handleCompanySignUp}
                  loading={loading}
                  errors={errors}
                  values={companyValues}
                  onChange={(field, value) => setCompanyValues(cv => ({ ...cv, [field]: value }))}
                />
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-gray-600">
                  Already have a company account?{' '}
                  <Link to="/company-login" className="text-parking-secondary hover:text-parking-primary font-medium">
                    Log in
                  </Link>
                </p>
              </CardFooter>
            </Card>
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By signing up, you agree to our{' '}
                <Link to="/terms" className="text-parking-secondary hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-parking-secondary hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return null;
};

export default SignUp;
