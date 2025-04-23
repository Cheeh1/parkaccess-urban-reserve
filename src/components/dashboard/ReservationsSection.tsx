import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Car, Calendar, MapPin, Clock, CreditCard, File, Star } from "lucide-react";

// The reservations prop should be split outside for re-use; we'll keep mock here for component demo
interface Reservation {
  id: string;
  parkingLotName: string;
  spotId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: "upcoming" | "completed";
}

interface ReservationsSectionProps {
  reservations: Reservation[];
}

const ReservationsSection = ({ reservations }: ReservationsSectionProps) => {
  const upcomingReservations = reservations.filter(res => res.status === 'upcoming');
  const pastReservations = reservations.filter(res => res.status === 'completed');

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Reservations</h2>
      <Tabs defaultValue="upcoming">
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          {upcomingReservations.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Car className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No upcoming reservations</h3>
              <p className="mt-1 text-gray-500">You don't have any parking reservations scheduled.</p>
              <div className="mt-6">
                <Button onClick={() => window.location.href = '/parking-lots'}>
                  Find Parking
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingReservations.map((reservation) => (
                <Card key={reservation.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 border-l-4 border-parking-secondary">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{reservation.parkingLotName}</h3>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <MapPin className="h-4 w-4 mr-1" />
                            Spot ID: {reservation.spotId}
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            Upcoming
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-gray-600">{new Date(reservation.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-gray-600">{reservation.startTime} - {reservation.endTime}</span>
                        </div>
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-gray-600">₦{reservation.totalPrice}</span>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center justify-end space-x-4">
                        <Button variant="outline" size="sm" className="border-gray-300">
                          <File className="h-4 w-4 mr-1" />
                          View E-Ticket
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="past">
          {pastReservations.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Clock className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No past reservations</h3>
              <p className="mt-1 text-gray-500">You haven't made any parking reservations yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pastReservations.map((reservation) => (
                <Card key={reservation.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 border-l-4 border-gray-300">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{reservation.parkingLotName}</h3>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <MapPin className="h-4 w-4 mr-1" />
                            Spot ID: {reservation.spotId}
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0">
                          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                            Completed
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-gray-600">{new Date(reservation.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-gray-600">{reservation.startTime} - {reservation.endTime}</span>
                        </div>
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-gray-600">₦{reservation.totalPrice}</span>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center justify-end space-x-4">
                        <Button variant="outline" size="sm" className="border-gray-300">
                          <File className="h-4 w-4 mr-1" />
                          View Receipt
                        </Button>
                        <Button variant="outline" size="sm">
                          <Star className="h-4 w-4 mr-1" />
                          Rate Experience
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReservationsSection;
