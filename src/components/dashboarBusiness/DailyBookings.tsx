import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Booking } from "@/types";
import { BookingCard } from "@/components/BookingCard";
import { es } from "date-fns/locale";
import { format } from "date-fns";
// import { getServiceForBooking } from "@/utils/dashboardUtils"

interface DailyBookingsProps {
  selectedDate: Date;
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
}

const DailyBookings: React.FC<DailyBookingsProps> = ({
  selectedDate,
  bookings,
  onCancelBooking,
}) => {
  const [services, setServices] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchServices = async () => {
      const newServices: Record<string, any> = {};
      for (const booking of bookings) {
        newServices[booking.id] = await getServiceForBooking(booking);
      }
      setServices(newServices);
    };

    fetchServices();
  }, [bookings]);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const current_date = formatDate(selectedDate);


  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Reservas para{" "}
          {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bookings.filter((booking) => booking.date === current_date).length >
        0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings
              .filter((booking) => booking.date === current_date)
              .map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  service={services[booking.id] || null}
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
