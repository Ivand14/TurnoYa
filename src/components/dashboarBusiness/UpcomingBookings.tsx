import { Booking, Service } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";

import { BookingCard } from "@/components/BookingCard";
import { getServiceForBooking } from "@/utils/dashboardUtils";

interface UpcomingBookingsProps {
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
}

const UpcomingBookings: React.FC<UpcomingBookingsProps> = ({
  bookings,
  onCancelBooking
}) => {
  const [services, setServices] = useState<Record<string, Service>>({});

  useEffect(() => {
    const loadServices = async () => {
      const servicesMap: Record<string, Service> = {};
      for (const booking of bookings) {
        const service = await getServiceForBooking(booking);
        if (service) {
          servicesMap[booking.serviceId] = service;
        }
      }
      setServices(servicesMap);
    };
    loadServices();
  }, [bookings]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximas Reservas</CardTitle>
      </CardHeader>
      <CardContent>
        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                service={services[booking.serviceId]}
                onCancel={onCancelBooking}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No hay próximas reservas</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingBookings;
