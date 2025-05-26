import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Booking } from "@/types";
import { BookingCard } from "@/components/BookingCard";
import React from "react";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { getServiceForBooking } from "@/utils/dashboardUtils";

interface DailyBookingsProps {
  selectedDate: Date;
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
}

const DailyBookings: React.FC<DailyBookingsProps> = ({
  selectedDate,
  bookings,
  onCancelBooking
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Reservas para{" "}
          {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="text-center py-10">
            <p className="text-gray-500">No hay reservas para esta fecha</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyBookings;
