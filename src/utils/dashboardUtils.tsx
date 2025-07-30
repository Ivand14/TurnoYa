import { DashboardStats, Employee } from "@/types/dashboard";

import { Booking, Service } from "@/types";
import { useServicesContext } from "@/context/apisContext/servicesContext";

// Get service corresponding to a booking
export const getServiceForBooking = async (booking: Booking) => {
  const { fetchGetServices, services } = useServicesContext();
  await fetchGetServices(booking.businessId);
  return services.find((service: Service) => service.id === booking.serviceId);
};

// Calculate dashboard statistics
export const getDashboardStats = (
  bookings: Booking[],
  employees: Employee[]
): DashboardStats => {
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(
    (b) => b.status === "confirmed"
  ).length;
  const completedBookings = bookings.filter((b) => b.status === "completed").length;

  const pendingBookings = bookings.filter((b) => b.status === "pending").length;

  return { totalBookings, confirmedBookings, completedBookings, pendingBookings };
};
