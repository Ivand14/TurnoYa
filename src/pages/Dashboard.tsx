import {} from "@/context/login.state";

import { Booking } from "@/types";
import { useEffect, useMemo, useState } from "react";

import { Footer } from "@/components/Footer";
import { Logged } from "@/context/logged";
import { Navbar } from "@/components/Navbar";
import { Navigate } from "react-router-dom";
import { current_user } from "@/context/currentUser";
import { toast } from "sonner";
import { useBookingContext } from "@/context/apisContext/bookingContext";
import { useServicesContext } from "@/context/apisContext/servicesContext";
import DashboardBody from "@/components/dashboardBody";

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const { user } = current_user();
  const { isLogged } = Logged();
  const { fetchGetUserBooking, booking, userBooking, fetchDeleteBooking } =
    useBookingContext();
  const { servicesUser } = useServicesContext();

  if (!isLogged || !user || user.rol !== "user") {
    return <Navigate to="/login" />;
  }

  const fetchData = async () => {
    const now = new Date();

    // Dividir en próximas y pasadas
    const upcoming = userBooking.filter(
      (bookings) => new Date(bookings.start) > now
    );
    const past = userBooking.filter(
      (bookings) => new Date(bookings.start) <= now
    );

    // Ordenar por fecha
    upcoming.sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );
    past.sort(
      (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()
    );

    setUpcomingBookings(upcoming);
    setPastBookings(past);
  };

  useEffect(() => {
    if (user?.id) {
      fetchGetUserBooking(user.id).catch((error) => {
        console.error("Error fetching bookings:", error);
      });
    }
  }, [user?.id]);

  useEffect(() => {
    if (userBooking.length) {
      fetchData();
    }
  }, [userBooking, booking]);

  // Filtrar reservas para la fecha seleccionada
  const bookingsForSelectedDate = useMemo(() => {
    return userBooking.filter((booking) => {
      const bookingDate = new Date(booking.start);
      return (
        bookingDate.getDate() === selectedDate.getDate() &&
        bookingDate.getMonth() === selectedDate.getMonth() &&
        bookingDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  }, [userBooking, selectedDate]);

  // Cancelar reserva
  const handleCancelBooking = async (bookingId: string) => {
    try {
      await fetchDeleteBooking(bookingId);
      setUpcomingBookings((prev) => prev.filter((b) => b.id !== bookingId));
      setPastBookings((prev) => prev.filter((b) => b.id !== bookingId));
      toast.success("Reserva cancelada");
    } catch (error) {
      console.error("Error canceling booking:", error);
      toast.error("Hubo un error al cancelar la reserva.");
    }
  };

  // Resumen de estadísticas
  const getDashboardStats = () => {
    const totalBookings = booking.length;
    const confirmedBookings = booking.filter(
      (b) => b.status === "confirmed"
    ).length;
    const pendingBookings = booking.filter(
      (b) => b.status === "pending"
    ).length;
    const cancelledBookings = booking.filter(
      (b) => b.status === "cancelled"
    ).length;

    return {
      totalBookings,
      confirmedBookings,
      pendingBookings,
      cancelledBookings,
    };
  };

  const stats = useMemo(() => getDashboardStats(), [booking]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <DashboardBody
        upcomingBookings={upcomingBookings}
        pastBookings={pastBookings}
        stats={() => stats}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        servicesUser={servicesUser}
        bookingsForSelectedDate={bookingsForSelectedDate}
        handleCancelBooking={handleCancelBooking}
      />

      <Footer />
    </div>
  );
};

export default Dashboard;
