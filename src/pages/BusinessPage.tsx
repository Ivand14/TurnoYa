// import {  } from "@/context/login.state";

// import { Booking, Business, Service, TimeSlot } from "@/types";
// import { Navigate, useParams } from "react-router-dom";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { mockBookings, mockBusinesses, mockScheduleSettings, mockServices } from "@/data/mockData";

// import { Badge } from "@/components/ui/badge";
// import { BookingForm } from "@/components/BookingForm";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/Calendar";
// import { Footer } from "@/components/Footer";
// import { Navbar } from "@/components/Navbar";
// import { Separator } from "@/components/ui/separator";
// import { ServiceCard } from "@/components/ServiceCard";
// import { TimeSlotGrid } from "@/components/TimeSlotGrid";
// import { es } from "date-fns/locale";
// import { format } from "date-fns";
// import { toast } from "sonner";
// import { useState } from "react";

// interface BookingFormData {
//   name: string;
//   email: string;
//   phone: string;
//   notes?: string;
// }

// const BusinessPage = () => {
//   const { businessId } = useParams();

//   const [selectedDate, setSelectedDate] = useState<Date>(new Date());
//   const [selectedService, setSelectedService] = useState<Service | null>(null);
//   const [selectedSlot, setSelectedSlot] = useState<{start: Date, end: Date} | null>(null);
//   const [bookingFormOpen, setBookingFormOpen] = useState(false);
  

  
//   // Si no existe el negocio, redirigir
//   if (!businessId) {
//     return <Navigate to="/businesses" />;
//   }
  
//   // Obtener configuración de horarios del negocio
//   const scheduleSettings = mockScheduleSettings.find(s => s.businessId === businessId);
  
//   if (!scheduleSettings) {
//     return <div>Error: No se encontraron las configuraciones de horario para este negocio.</div>;
//   }
  
//   // Obtener horarios reservados para la fecha seleccionada
//   const getBookedTimeSlotsForDate = (date: Date): TimeSlot[] => {
//     const dateString = format(date, "yyyy-MM-dd");
    
//     return mockBookings
//       .filter(booking => 
//         booking.businessId === businessId && 
//         booking.date === dateString &&
//         booking.status !== 'cancelled'
//       )
//       .map(booking => ({
//         id: booking.id,
//         start: booking.start,
//         end: booking.end,
//         available: false
//       }));
//   };
  
//   // Manejar la selección de servicio
//   const handleSelectService = (serviceId: string) => {
//     const service = services.find(s => s.id === serviceId);
//     if (service) {
//       setSelectedService(service);
//       // Reset del slot seleccionado cuando se cambia el servicio
//       setSelectedSlot(null);
//     }
//   };
  
//   // Manejar la selección de horario
//   const handleSelectTimeSlot = (start: Date, end: Date) => {
//     setSelectedSlot({ start, end });
    
//     if (selectedService) {
//       setBookingFormOpen(true);
//     } else {
//       toast.error("Por favor, seleccione un servicio primero");
//     }
//   };
  
//   // Crear una reserva
//   const handleCreateBooking = (formData: BookingFormData) => {
//     const newBooking: Booking = {
//       id: `booking-${Date.now()}`,
//       businessId: business.id,
//       serviceId: selectedService?.id || "",
//       userId: currentUser?.id || "guest",
//       userName: formData.name,
//       userEmail: formData.email,
//       userPhone: formData.phone,
//       date: selectedDate.toISOString().split('T')[0],
//       start: selectedSlot?.start.toISOString() || "",
//       end: selectedSlot?.end.toISOString() || "",
//       status: 'confirmed',
//       paymentStatus: 'pending',
//       notes: formData.notes
//     };
    
//     // En una app real, esto enviaría la reserva a la API
//     console.log("Nueva reserva:", newBooking);
    
//     toast.success("¡Reserva creada con éxito!");
//     setBookingFormOpen(false);
//     setSelectedSlot(null);
//   };

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Navbar  />
      
//       <main className="flex-1">
//         {/* Cabecera del negocio */}
//         <div className="bg-gray-100 py-8">
//           <div className="container mx-auto px-4">
//             <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
//               <div className="w-24 h-24 bg-white rounded-lg overflow-hidden shadow-sm flex-shrink-0">
//                 {business.logo && (
//                   <img src={business.logo} alt={business.name} className="w-full h-full object-cover" />
//                 )}
//               </div>
              
//               <div className="text-center md:text-left">
//                 <h1 className="text-3xl font-bold mb-2">{business.name}</h1>
                
//                 <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
//                   {business.type === 'barbershop' && (
//                     <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Barbería</Badge>
//                   )}
//                   {business.type === 'beauty' && (
//                     <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-200">Centro de Belleza</Badge>
//                   )}
//                   {business.type === 'sports' && (
//                     <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Centro Deportivo</Badge>
//                   )}
//                 </div>
                
//                 <p className="text-gray-600 mb-3">{business.description}</p>
                
//                 <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600">
//                   {business.address && (
//                     <div className="flex items-center">
//                       <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                       </svg>
//                       {business.address}
//                     </div>
//                   )}
                  
//                   {business.phone && (
//                     <div className="flex items-center">
//                       <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                       </svg>
//                       {business.phone}
//                     </div>
//                   )}
                  
//                   <div className="flex items-center">
//                     <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                     </svg>
//                     {business.email}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {/* Contenido principal */}
//         <div className="container mx-auto px-4 py-8">
//           <Tabs defaultValue="booking" className="w-full">
//             <TabsList className="mb-6">
//               <TabsTrigger value="booking">Reservar</TabsTrigger>
//               <TabsTrigger value="info">Información</TabsTrigger>
//             </TabsList>
            
//             <TabsContent value="booking">
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                 {/* Listado de servicios */}
//                 <div className="lg:col-span-1">
//                   <h2 className="text-xl font-semibold mb-4">Servicios</h2>
                  
//                   <div className="space-y-4">
//                     {services.map(service => (
//                       <ServiceCard 
//                         key={service.id} 
//                         service={service}
//                         onReserve={handleSelectService}
//                       />
//                     ))}
//                   </div>
//                 </div>
                
//                 {/* Selección de fecha y hora */}
//                 <div className="lg:col-span-2">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <h2 className="text-xl font-semibold mb-4">Seleccionar Fecha</h2>
//                       <Calendar 
//                         selectedDate={selectedDate} 
//                         onSelectDate={(date) => {
//                           setSelectedDate(date);
//                           setSelectedSlot(null);
//                         }}
//                       />
//                     </div>
                    
//                     <div>
//                       <h2 className="text-xl font-semibold mb-4">
//                         {selectedService ? `Horarios para ${selectedService.name}` : "Seleccione un servicio"}
//                       </h2>
                      
//                       {selectedService ? (
//                         <TimeSlotGrid 
//                           date={selectedDate}
//                           workHours={scheduleSettings.workHours}
//                           slotDuration={selectedService.duration}
//                           breakBetweenSlots={scheduleSettings.breakBetweenSlots}
//                           bookedSlots={getBookedTimeSlotsForDate(selectedDate)}
//                           onSelectSlot={handleSelectTimeSlot}
//                         />
//                       ) : (
//                         <div className="bg-gray-50 p-8 rounded-lg text-center">
//                           <p className="text-gray-500">
//                             Por favor, seleccione un servicio para ver los horarios disponibles
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
                  
//                   {/* Resumen de la reserva */}
//                   {selectedService && selectedSlot && (
//                     <div className="mt-8 p-6 bg-gray-50 rounded-lg">
//                       <h2 className="text-xl font-semibold mb-4">Resumen de Reserva</h2>
                      
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <h3 className="text-sm font-medium text-gray-500 mb-1">Servicio:</h3>
//                           <p className="font-medium">{selectedService.name}</p>
//                         </div>
                        
//                         <div>
//                           <h3 className="text-sm font-medium text-gray-500 mb-1">Precio:</h3>
//                           <p className="font-medium">${selectedService.price}</p>
//                         </div>
                        
//                         <div>
//                           <h3 className="text-sm font-medium text-gray-500 mb-1">Duración:</h3>
//                           <p className="font-medium">{selectedService.duration} minutos</p>
//                         </div>
                        
//                         <div>
//                           <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha y hora:</h3>
//                           <p className="font-medium">
//                             {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}, {" "}
//                             {format(selectedSlot.start, "HH:mm")} - {format(selectedSlot.end, "HH:mm")}
//                           </p>
//                         </div>
//                       </div>
                      
//                       <Button className="mt-4 w-full" onClick={() => setBookingFormOpen(true)}>
//                         Confirmar Reserva
//                       </Button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </TabsContent>
            
//             <TabsContent value="info">
//               <div className="max-w-3xl mx-auto">
//                 <h2 className="text-2xl font-semibold mb-4">Acerca de {business.name}</h2>
//                 <p className="text-gray-600 mb-6">
//                   {business.description}
//                 </p>
                
//                 <Separator className="my-6" />
                
//                 <h3 className="text-xl font-semibold mb-4">Horarios de Atención</h3>
//                 <div className="bg-gray-50 p-4 rounded-lg mb-6">
//                   <div className="grid grid-cols-2 gap-2">
//                     <p className="text-gray-600">Lunes - Viernes:</p>
//                     <p className="font-medium">
//                       {scheduleSettings.workHours.start} - {scheduleSettings.workHours.end}
//                     </p>
                    
//                     <p className="text-gray-600">Sábado:</p>
//                     <p className="font-medium">
//                       {scheduleSettings.workDays.includes(6) 
//                         ? `${scheduleSettings.workHours.start} - ${scheduleSettings.workHours.end}` 
//                         : "Cerrado"}
//                     </p>
                    
//                     <p className="text-gray-600">Domingo:</p>
//                     <p className="font-medium">
//                       {scheduleSettings.workDays.includes(0) 
//                         ? `${scheduleSettings.workHours.start} - ${scheduleSettings.workHours.end}` 
//                         : "Cerrado"}
//                     </p>
//                   </div>
//                 </div>
                
//                 <Separator className="my-6" />
                
//                 <h3 className="text-xl font-semibold mb-4">Contacto</h3>
//                 <div className="space-y-3">
//                   {business.address && (
//                     <div className="flex items-start">
//                       <svg className="w-5 h-5 mr-3 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                       </svg>
//                       <div>
//                         <h4 className="font-medium">Dirección</h4>
//                         <p className="text-gray-600">{business.address}</p>
//                       </div>
//                     </div>
//                   )}
                  
//                   {business.phone && (
//                     <div className="flex items-start">
//                       <svg className="w-5 h-5 mr-3 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                       </svg>
//                       <div>
//                         <h4 className="font-medium">Teléfono</h4>
//                         <p className="text-gray-600">{business.phone}</p>
//                       </div>
//                     </div>
//                   )}
                  
//                   <div className="flex items-start">
//                     <svg className="w-5 h-5 mr-3 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                     </svg>
//                     <div>
//                       <h4 className="font-medium">Email</h4>
//                       <p className="text-gray-600">{business.email}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </div>
        
//         {/* Formulario de reserva */}
//         {selectedService && (
//           <BookingForm
//             service={selectedService}
//             selectedDate={selectedDate}
//             selectedSlot={selectedSlot}
//             open={bookingFormOpen}
//             onClose={() => setBookingFormOpen(false)}
//             onSubmit={handleCreateBooking}
//           />
//         )}
//       </main>
      
//       <Footer />
//     </div>
//   );
// };

// export default BusinessPage;
