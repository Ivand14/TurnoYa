import { DashboardStats, Employee } from "@/types/dashboard";

import { Booking } from "@/types";
import { mockServices } from "@/data/mockData";

// Get service corresponding to a booking
export const getServiceForBooking = (booking: Booking) => {
    return mockServices.find(service => service.id === booking.serviceId);
};

// Calculate dashboard statistics
export const getDashboardStats = (bookings: Booking[], employees: Employee[]): DashboardStats => {
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;

    // Validación segura para evitar errores
    const activeEmployees = Array.isArray(employees)
        ? employees.filter(e => e.status === 'active').length
        : 0;

    return { totalBookings, confirmedBookings, pendingBookings, activeEmployees };
};

