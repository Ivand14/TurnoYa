// import { Booking, Business } from "@/types";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { mockBookings, mockBusinesses, mockServices } from "@/data/mockData";
// import { useEffect, useState } from "react";

// import { BookingCard } from "@/components/BookingCard";
// import { Calendar } from "@/components/Calendar";
// import { Footer } from "@/components/Footer";
// import { Navbar } from "@/components/Navbar";
// import { Navigate } from "react-router-dom";
// import { es } from "date-fns/locale";
// import { format } from "date-fns";
// import { toast } from "sonner";

// const AdminDashboard = () => {

//   const [selectedDate, setSelectedDate] = useState<Date>(new Date());
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [businesses, setBusinesses] = useState<Business[]>([]);
//   const [activeTab, setActiveTab] = useState("overview");

//   // Redirigir si no es un usuario administrador
//   if (!currentUser || currentUser.role !== 'admin') {
//     return <Navigate to="/login" />;
//   }

//   // Obtener datos
//   useEffect(() => {
//     // Para administradores, mostrar todas las reservas
//     setBookings(mockBookings);
//     setBusinesses(mockBusinesses);
//   }, []);

//   // Filtrar reservas para la fecha seleccionada
//   const bookingsForSelectedDate = bookings.filter(booking => {
//     const bookingDate = new Date(booking.start);
//     return (
//       bookingDate.getDate() === selectedDate.getDate() &&
//       bookingDate.getMonth() === selectedDate.getMonth() &&
//       bookingDate.getFullYear() === selectedDate.getFullYear()
//     );
//   });

//   // Encontrar servicio correspondiente a una reserva
//   const getServiceForBooking = (booking: Booking) => {
//     return mockServices.find(service => service.id === booking.serviceId);
//   };

//   // Encontrar negocio correspondiente a una reserva
//   const getBusinessForBooking = (booking: Booking) => {
//     // return mockBusinesses.find(business => business.id === booking.businessId);
//   };

//   // Cambiar estado de negocio
//   const toggleBusinessStatus = (businessId: string) => {
//     // Esta función sería para activar/desactivar negocios
//     toast.success(`Estado del negocio ID ${businessId} actualizado`);
//   };

//   // Resumen de estadísticas
//   const getDashboardStats = () => {
//     const totalBookings = bookings.length;
//     const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
//     const pendingBookings = bookings.filter(b => b.status === 'pending').length;
//     const totalBusinesses = businesses.length;
    
//     return { totalBookings, confirmedBookings, pendingBookings, totalBusinesses };
//   };

//   const stats = getDashboardStats();

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Navbar  />
      
//       <main className="flex-1 container mx-auto px-4 py-8">
//         <h1 className="text-3xl font-bold mb-6">Dashboard de Administración</h1>
        
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="mb-8">
//             <TabsTrigger value="overview">Resumen</TabsTrigger>
//             <TabsTrigger value="businesses">Negocios</TabsTrigger>
//             <TabsTrigger value="bookings">Reservas</TabsTrigger>
//           </TabsList>
          
//           {/* Tab: Resumen */}
//           <TabsContent value="overview" className="space-y-8">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//               <Card>
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-lg">Reservas Totales</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-3xl font-bold">{stats.totalBookings}</p>
//                 </CardContent>
//               </Card>
              
//               <Card>
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-lg">Reservas Confirmadas</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-3xl font-bold text-booking-accent">{stats.confirmedBookings}</p>
//                 </CardContent>
//               </Card>
              
//               <Card>
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-lg">Reservas Pendientes</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-3xl font-bold text-booking-warning">{stats.pendingBookings}</p>
//                 </CardContent>
//               </Card>
              
//               <Card>
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-lg">Negocios Registrados</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-3xl font-bold text-blue-500">{stats.totalBusinesses}</p>
//                 </CardContent>
//               </Card>
//             </div>
            
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               <div className="lg:col-span-1">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Calendario</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
//                   </CardContent>
//                 </Card>
//               </div>
              
//               <div className="lg:col-span-2">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>
//                       Reservas para {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     {bookingsForSelectedDate.length > 0 ? (
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {bookingsForSelectedDate.map(booking => (
//                           <BookingCard
//                             key={booking.id}
//                             booking={booking}
//                             service={getServiceForBooking(booking)}
//                             // business={getBusinessForBooking(booking)}
//                           />
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="text-center py-10">
//                         <p className="text-gray-500">No hay reservas para esta fecha</p>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//           </TabsContent>
          
//           {/* Tab: Negocios */}
//           <TabsContent value="businesses">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Negocios Registrados</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {businesses.length > 0 ? (
//                   <div className="overflow-x-auto">
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead>Nombre</TableHead>
//                           <TableHead>Tipo</TableHead>
//                           <TableHead>Email</TableHead>
//                           <TableHead>Teléfono</TableHead>
//                           <TableHead>Dirección</TableHead>
//                           <TableHead>Acciones</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {businesses.map(business => (
//                           // <TableRow key={business.id}>
//                             {/* <TableCell className="font-medium">{business.name}</TableCell> */}
//                             {/* <TableCell>{business.type}</TableCell> */}
//                             <TableCell>{business.email}</TableCell>
//                             <TableCell>{business.phone || "—"}</TableCell>
//                             <TableCell>{business.address || "—"}</TableCell>
//                             <TableCell>
//                               <button 
//                                 className="text-blue-500 hover:text-blue-700 mr-2"
//                                 // onClick={() => toggleBusinessStatus(business.id)}
//                               >
//                                 Cambiar estado
//                               </button>
//                               <a 
//                                 // href={`/business/${business.id}`} 
//                                 className="text-green-500 hover:text-green-700"
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                               >
//                                 Ver
//                               </a>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </div>
//                 ) : (
//                   <div className="text-center py-10">
//                     <p className="text-gray-500">No hay negocios registrados</p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>
          
//           {/* Tab: Reservas */}
//           <TabsContent value="bookings">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Todas las Reservas</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {bookings.length > 0 ? (
//                   <div className="overflow-x-auto">
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead>ID</TableHead>
//                           <TableHead>Negocio</TableHead>
//                           <TableHead>Cliente</TableHead>
//                           <TableHead>Fecha</TableHead>
//                           <TableHead>Estado</TableHead>
//                           <TableHead>Pago</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {bookings.map(booking => {
//                           const business = getBusinessForBooking(booking);
//                           return (
//                             <TableRow key={booking.id}>
//                               <TableCell className="font-medium">{booking.id.substring(0, 8)}...</TableCell>
//                               <TableCell>{business?.name || "—"}</TableCell>
//                               <TableCell>{booking.userName}</TableCell>
//                               <TableCell>{new Date(booking.start).toLocaleDateString()}</TableCell>
//                               <TableCell>
//                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                   booking.status === 'confirmed' 
//                                     ? 'bg-green-100 text-green-800' 
//                                     : booking.status === 'pending'
//                                     ? 'bg-yellow-100 text-yellow-800'
//                                     : 'bg-red-100 text-red-800'
//                                 }`}>
//                                   {booking.status}
//                                 </span>
//                               </TableCell>
//                               <TableCell>
//                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                   booking.paymentStatus === 'paid' 
//                                     ? 'bg-green-100 text-green-800' 
//                                     : booking.paymentStatus === 'pending'
//                                     ? 'bg-yellow-100 text-yellow-800'
//                                     : 'bg-red-100 text-red-800'
//                                 }`}>
//                                   {booking.paymentStatus}
//                                 </span>
//                               </TableCell>
//                             </TableRow>
//                           );
//                         })}
//                       </TableBody>
//                     </Table>
//                   </div>
//                 ) : (
//                   <div className="text-center py-12 bg-gray-50 rounded-lg">
//                     <p className="text-gray-500">No hay reservas en el sistema</p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </main>
      
//       <Footer />
//     </div>
//   );
// };

// export default AdminDashboard;