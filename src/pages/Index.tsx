
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, CreditCard, ArrowRight, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MainLayout from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';

const Index = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [entryTime, setEntryTime] = useState('');
  const [exitTime, setExitTime] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/parking-lots?location=${encodeURIComponent(location)}&date=${encodeURIComponent(date)}&entryTime=${encodeURIComponent(entryTime)}&exitTime=${encodeURIComponent(exitTime)}`);
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-parking-primary to-parking-secondary text-white pt-16 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center md:text-left md:w-3/5">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Find and Reserve Parking in Seconds
            </h1>
            <p className="mt-4 text-lg md:text-xl opacity-90 max-w-2xl">
              Skip the stress of finding parking spots. PARKACCESS helps you find and book parking spaces across Ilorin city with just a few clicks.
            </p>
            <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center md:justify-start">
              <Button 
                onClick={() => navigate('/parking-lots')}
                size="lg" 
                className="bg-white text-parking-primary hover:bg-gray-100 px-6"
              >
                Find Parking
              </Button>
              <Button 
                onClick={() => navigate('/how-it-works')}
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                How It Works
              </Button>
            </div>
          </div>
        </div>
        
        {/* Search Card */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Card className="absolute left-0 right-0 -bottom-24 rounded-xl shadow-xl overflow-hidden">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label htmlFor="location" className="parking-label flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Location
                  </label>
                  <Input 
                    id="location"
                    type="text" 
                    placeholder="Enter address or landmark"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="parking-input"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="date" className="parking-label flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Date
                  </label>
                  <Input 
                    id="date"
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="parking-input"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="entryTime" className="parking-label flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Entry Time
                  </label>
                  <Input 
                    id="entryTime"
                    type="time" 
                    value={entryTime}
                    onChange={(e) => setEntryTime(e.target.value)}
                    className="parking-input"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="exitTime" className="parking-label flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Exit Time
                  </label>
                  <Input 
                    id="exitTime"
                    type="time" 
                    value={exitTime}
                    onChange={(e) => setExitTime(e.target.value)}
                    className="parking-input"
                    required
                  />
                </div>
                
                <div className="md:col-span-4 mt-2">
                  <Button type="submit" className="w-full bg-parking-secondary hover:bg-parking-primary h-12">
                    <Search className="mr-2 h-5 w-5" />
                    Search Available Parking
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 h-full w-1/2 opacity-10 pointer-events-none">
          <div className="absolute inset-0 pattern-dots pattern-blue-500 pattern-size-4 pattern-opacity-20"></div>
        </div>
      </section>
      
      {/* Features Section (with spacing to account for the search card) */}
      <section className="pt-32 pb-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-parking-dark">How PARKACCESS Works</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform makes finding and reserving parking spaces simple, efficient, and stress-free.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-8 w-8 text-parking-secondary" />
                </div>
                <h3 className="text-xl font-bold text-parking-dark mb-2">Search & Compare</h3>
                <p className="text-gray-600">
                  Enter your location and time to find available parking spots near you. Compare prices and amenities to find your perfect spot.
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 2 */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="h-8 w-8 text-parking-secondary" />
                </div>
                <h3 className="text-xl font-bold text-parking-dark mb-2">Book & Pay Online</h3>
                <p className="text-gray-600">
                  Reserve your spot instantly with our secure payment system. Support for multiple payment methods including cards and mobile money.
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 3 */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-8 w-8 text-parking-secondary" />
                </div>
                <h3 className="text-xl font-bold text-parking-dark mb-2">Park Hassle-Free</h3>
                <p className="text-gray-600">
                  Show your digital parking pass upon arrival. No more circling blocks or struggling to find a spot during peak hours.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              onClick={() => navigate('/how-it-works')} 
              variant="outline" 
              className="text-parking-secondary border-parking-secondary hover:bg-parking-secondary hover:text-white"
            >
              Learn More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-parking-secondary">500+</p>
              <p className="text-gray-600 mt-2">Parking Spots</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-parking-secondary">20+</p>
              <p className="text-gray-600 mt-2">Locations</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-parking-secondary">10K+</p>
              <p className="text-gray-600 mt-2">Happy Users</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-parking-secondary">98%</p>
              <p className="text-gray-600 mt-2">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-parking-dark">What Our Users Say</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                <div>
                  <h4 className="font-bold">Sarah J.</h4>
                  <p className="text-sm text-gray-500">Regular User</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "PARKACCESS has completely changed how I park in the city. I used to spend 20+ minutes looking for parking, but now I book ahead and just drive straight to my spot."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                <div>
                  <h4 className="font-bold">Michael T.</h4>
                  <p className="text-sm text-gray-500">Business Owner</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "As a business owner with a small parking lot, PARKACCESS helps me generate additional revenue during off-hours. The platform is incredibly easy to manage."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                <div>
                  <h4 className="font-bold">Aisha M.</h4>
                  <p className="text-sm text-gray-500">Student</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "As a student, I love that I can find affordable parking near campus. The app shows me all available options sorted by price, making it easy to stay within my budget."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-parking-primary to-parking-secondary text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Park Smarter?</h2>
          <p className="mt-4 text-xl opacity-90 max-w-2xl mx-auto">
            Join thousands of drivers who have already simplified their parking experience with PARKACCESS.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/sign-up')}
              size="lg" 
              className="bg-white text-parking-primary hover:bg-gray-100"
            >
              Sign Up Now
            </Button>
            <Button 
              onClick={() => navigate('/parking-lots')}
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              Find Parking
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
