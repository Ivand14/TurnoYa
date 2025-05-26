import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Booking } from "@/types";
import { BookingCard } from "@/components/BookingCard";
import React from "react";
import { getServiceForBooking } from "@/utils/dashboardUtils";

interface UpcomingBookingsProps {
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
}

const UpcomingBookings: React.FC<UpcomingBookingsProps> = ({
  bookings,
  onCancelBooking
}) => {
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
                service={getServiceForBooking(booking)}
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
