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
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;

  // Validación segura para evitar errores
  const activeEmployees = Array.isArray(employees)
    ? employees.filter((e) => e.status === "active").length
    : 0;

  return { totalBookings, confirmedBookings, pendingBookings, activeEmployees };
};
