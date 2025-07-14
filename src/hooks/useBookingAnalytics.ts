import { useMemo } from "react";
import { Booking } from "@/types";
import { BookingAnalytics } from "@/types/bookings";

export const useBookingAnalytics = (bookings: Booking[]): BookingAnalytics => {
  return useMemo(() => {
    const today = new Date();
    const todayBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.start);
      return bookingDate.toDateString() === today.toDateString();
    });

    const thisWeekBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.start);
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      return bookingDate >= weekStart;
    });

    const statusCounts = bookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: bookings.length,
      today: todayBookings.length,
      thisWeek: thisWeekBookings.length,
      confirmed: statusCounts.confirmed || 0,
      pending: statusCounts.pending || 0,
      cancelled: statusCounts.cancelled || 0,
    };
  }, [bookings]);
};
