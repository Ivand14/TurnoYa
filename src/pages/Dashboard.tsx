import {  } from "@/context/login.state";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addDays, endOfWeek, format, parseISO, startOfWeek } from "date-fns";
import { mockBookings, mockServices } from "@/data/mockData";
import { useEffect, useState } from "react";

import { Booking } from "@/types";
import { BookingCard } from "@/components/BookingCard";
import { Calendar } from "@/components/Calendar";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Navigate } from "react-router-dom";
import { current_user } from "@/context/currentUser";
import { es } from "date-fns/locale";
import { toast } from "sonner";

const Dashboard = () => {

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const { setIsLogged, isLogged,user,setUser } = current_user();
  // Redirigir si no hay usuario logueado
  if (!isLogged) {
    return <Navigate to="/login" />;
  }

  // Filtrar reservas según el tipo de usuario
  useEffect(() => {
    if (!isLogged) return; // 🔹 Evita ejecutar el código si no hay usuario
  
    const now = new Date();
    // let filteredBookings: Booking[] = [];
  
    // if (currentUser.role === "business") {
    //   filteredBookings = mockBookings.filter(booking => booking.businessId === currentUser.businessId);
    // } else if (currentUser.role === "customer") {
    //   filteredBookings = mockBookings.filter(booking => booking.userId === currentUser.id);
    // } else if (currentUser.role === "admin") {
    //   filteredBookings = mockBookings;
    // }
  
    // Dividir en próximas y pasadas
    // const upcoming = filteredBookings.filter(booking => new Date(booking.start) > now);
    // const past = filteredBookings.filter(booking => new Date(booking.start) <= now);
  
    // Ordenar por fecha
    // upcoming.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    // past.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());
  
    // setBookings(filteredBookings);
    // setUpcomingBookings(upcoming);
    // setPastBookings(past);
  }, [isLogged]); // 🔹 useEffect solo se ejecutará cuando `currentUser` cambie
  

  // Filtrar reservas para la fecha seleccionada
  const bookingsForSelectedDate = bookings.filter(booking => {
    const bookingDate = new Date(booking.start);
    return (
      bookingDate.getDate() === selectedDate.getDate() &&
      bookingDate.getMonth() === selectedDate.getMonth() &&
      bookingDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  // Cancelar reserva
  const handleCancelBooking = (bookingId: string) => {
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' } 
          : booking
      )
    );
    
    // Actualizar también en upcoming/past
    setUpcomingBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' } 
          : booking
      )
    );
    
    setPastBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' } 
          : booking
      )
    );
    
    toast.success("Reserva cancelada correctamente");
  };

  // Encontrar servicio correspondiente a una reserva
  const getServiceForBooking = (booking: Booking) => {
    return mockServices.find(service => service.id === booking.serviceId);
  };

  // Resumen de estadísticas
  const getDashboardStats = () => {
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
    
    return { totalBookings, confirmedBookings, pendingBookings, cancelledBookings };
  };

  const stats = getDashboardStats();

  // Función para obtener la semana actual
  const getCurrentWeek = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Lunes
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 }); // Domingo
    
    const days = [];
    let day = start;
    
    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }
    
    return days;
  };

  const weekDays = getCurrentWeek();


  return (
    <div className="flex flex-col min-h-screen">
      <Navbar  />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard de {user.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Estadísticas */}
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Reservas Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalBookings}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Reservas Confirmadas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-booking-accent">{stats.confirmedBookings}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Reservas Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-booking-warning">{stats.pendingBookings}</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendario y vista diaria */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Calendario</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>
                  Reservas para {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bookingsForSelectedDate.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bookingsForSelectedDate.map(booking => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        service={getServiceForBooking(booking)}
                        onCancel={handleCancelBooking}
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
          </div>
        </div>
        
        {/* Listado de reservas */}
        <div className="mt-8">
          <Tabs defaultValue="upcoming">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Mis Reservas</h2>
              <TabsList>
                <TabsTrigger value="upcoming">Próximas</TabsTrigger>
                <TabsTrigger value="past">Pasadas</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="upcoming">
              {upcomingBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingBookings.map(booking => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      service={getServiceForBooking(booking)}
                      onCancel={handleCancelBooking}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No tienes próximas reservas</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past">
              {pastBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastBookings.map(booking => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      service={getServiceForBooking(booking)}
                      onCancel={handleCancelBooking}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No tienes reservas pasadas</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
