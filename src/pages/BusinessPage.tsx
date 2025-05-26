import {} from "@/context/login.state";

import {
  Booking,
  Business,
  ScheduleSettings,
  Service,
  TimeSlot
} from "@/types";
import { Navigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllBusiness, getBusinessId } from "@/apis/business_apis";
import {
  mockBookings,
  mockBusinesses,
  mockScheduleSettings,
  mockServices
} from "@/data/mockData";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { BookingForm } from "@/components/BookingForm";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/Calendar";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Schedule } from "@/types/dashboard";
import { Separator } from "@/components/ui/separator";
import { ServiceCard } from "@/components/ServiceCard";
import { TimeSlotGrid } from "@/components/TimeSlotGrid";
import { current_user } from "@/context/currentUser";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { get_all_businessHrs } from "@/apis/employee_schedule.apis";
import { get_services } from "@/apis/services.api";
import { toast } from "sonner";

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

const BusinessPage = () => {
  const { businessId } = useParams();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [bookingFormOpen, setBookingFormOpen] = useState(false);
  const [dataBusiness, setDataBusiness] = useState<Business | null>(null);
  const [businessSchedules, setBusinessSchedules] = useState<Schedule[]>([]);
  const [scheduleSettings, setScheduleSettings] = useState<ScheduleSettings>({
    businessId: "",
    workDays: [],
    workHours: { start: "09:00", end: "17:00" },
    slotDuration: 30,
    breakBetweenSlots: 5
  });
  const [loading, setLoading] = useState(true);
  const { user } = current_user();
  const [schedulesHrs, setSchedulesHrs] = useState<Schedule[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const scheduleData = businessSchedules.filter(
    (s) => s.businessId === businessId
  );


  const scheduleInfo = () => {

    const days_business = [];
    const workDays = [];
    scheduleData.map((sch) => {
      days_business.push(sch.day);
    });

    for (let index = 0; index < days_business.length; index++) {
      const day = days_business[index];
      workDays.push(day - 1);
    }

    setScheduleSettings({
      businessId: businessId || "",
      workDays: workDays,
      workHours: { start: "09:00", end: "17:00" },
      slotDuration: 30,
      breakBetweenSlots: 5
    });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const responseBusiness = await getBusinessId(businessId);
      const business = responseBusiness?.data?.details.business_data;
      const business_schedule =
        responseBusiness?.data?.details.business_schedules;
      const businessHrsResponse = await get_all_businessHrs(businessId);
      if (business) {
        setDataBusiness(business);
        setBusinessSchedules(business_schedule);
        setSchedulesHrs(businessHrsResponse.data.details);
      }
      const businessServices = await get_services(businessId);
      setServices(businessServices.data.details);
    } catch (error) {
      console.error("Error fetching business:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!businessId) return;
    fetchData();
  }, [businessId]);

  // Si no existe el negocio, redirigir
  if (!businessId) {
    return <Navigate to="/businesses" />;
  }

  console.log(dataBusiness)

  if (!scheduleSettings) {
    return (
      <div>
        Error: No se encontraron las configuraciones de horario para este
        negocio.
      </div>
    );
  }

  // Obtener horarios reservados para la fecha seleccionada
  const getBookedTimeSlotsForDate = (date: Date): TimeSlot[] => {
    const dateString = format(date, "yyyy-MM-dd");

    return mockBookings
      .filter(
        (booking) =>
          booking.businessId === businessId &&
          booking.date === dateString &&
          booking.status !== "cancelled"
      )
      .map((booking) => ({
        id: booking.id,
        start: booking.start,
        end: booking.end,
        available: false
      }));
  };

  // Manejar la selección de servicio
  const handleSelectService = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    console.log(service)
    if (service) {
      setSelectedService(service);
      // Reset del slot seleccionado cuando se cambia el servicio
      setSelectedSlot(null);
    }
  };

  console.log(selectedService)

  // Manejar la selección de horario
  const handleSelectTimeSlot = (start: Date, end: Date) => {
    setSelectedSlot({ start, end });

    if (selectedService) {
      setBookingFormOpen(true);
    } else {
      toast.error("Por favor, seleccione un servicio primero");
    }
  };

  // Crear una reserva
  const handleCreateBooking = (formData: BookingFormData) => {
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      businessId: businessId,
      serviceId: selectedService?.id || "",
      userId: user?.id || "guest",
      userName: formData.name,
      userEmail: formData.email,
      userPhone: formData.phone,
      date: selectedDate.toISOString().split("T")[0],
      start: selectedSlot?.start.toISOString() || "",
      end: selectedSlot?.end.toISOString() || "",
      status: "confirmed",
      paymentStatus: "pending",
      notes: formData.notes
    };

    //En una app real, esto enviaría la reserva a la API
    console.log("Nueva reserva:", newBooking);

    toast.success("¡Reserva creada con éxito!");
    setBookingFormOpen(false);
    setSelectedSlot(null);
  };

  return (
    <div className="flex flex-col min-h-screen" key={businessId}>
      <Navbar />

      <main className="flex-1">
        {/* Cabecera del negocio */}
        <div className="bg-gray-100 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-24 h-24 bg-white rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                {dataBusiness?.logo && (
                  <img
                    src={dataBusiness.logo}
                    alt={dataBusiness.company_name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">
                  {dataBusiness?.company_name}
                </h1>

                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
                  {dataBusiness?.company_type === "barbershop" && (
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                      Barbería
                    </Badge>
                  )}
                  {dataBusiness?.company_type === "beauty" && (
                    <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-200">
                      Centro de Belleza
                    </Badge>
                  )}
                  {dataBusiness?.company_type === "sports" && (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                      Centro Deportivo
                    </Badge>
                  )}
                </div>

                <p className="text-gray-600 mb-3">
                  {dataBusiness?.description}
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600">
                  {dataBusiness?.address && (
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {dataBusiness.address}
                    </div>
                  )}

                  {dataBusiness?.phone && (
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {dataBusiness.phone}
                    </div>
                  )}

                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {dataBusiness?.email}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="booking" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="booking">Reservar</TabsTrigger>
              <TabsTrigger value="info">Información</TabsTrigger>
            </TabsList>

            <TabsContent value="booking">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Listado de servicios */}
                <div className="lg:col-span-1">
                  <h2 className="text-xl font-semibold mb-4">Servicios</h2>

                  <div className="space-y-4">
                    {services.map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        onReserve={handleSelectService}
                      />
                    ))}
                  </div>
                </div>

                {/* Selección de fecha y hora */}
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">
                        Seleccionar Fecha
                      </h2>
                      <Calendar
                        selectedDate={selectedDate}
                        onSelectDate={(date) => {
                          setSelectedDate(date);
                          setSelectedSlot(null);
                        }}
                      />
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold mb-4">
                        {selectedService
                          ? `Horarios para ${selectedService.name_service}`
                          : "Seleccione un servicio"}
                      </h2>

                      {selectedService ? (
                        <TimeSlotGrid
                          date={selectedDate}
                          workHours={scheduleSettings?.workHours}
                          slotDuration={selectedService.duration}
                          breakBetweenSlots={
                            scheduleSettings?.breakBetweenSlots
                          }
                          bookedSlots={getBookedTimeSlotsForDate(selectedDate)}
                          onSelectSlot={handleSelectTimeSlot}
                        />
                      ) : (
                        <div className="bg-gray-50 p-8 rounded-lg text-center">
                          <p className="text-gray-500">
                            Por favor, seleccione un servicio para ver los
                            horarios disponibles
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Resumen de la reserva */}
                  {selectedService && selectedSlot && (
                    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                      <h2 className="text-xl font-semibold mb-4">
                        Resumen de Reserva
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">
                            Servicio:
                          </h3>
                          <p className="font-medium">{selectedService.name_service}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">
                            Precio:
                          </h3>
                          <p className="font-medium">
                            ${selectedService.price}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">
                            Duración:
                          </h3>
                          <p className="font-medium">
                            {selectedService.duration} minutos
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">
                            Fecha y hora:
                          </h3>
                          <p className="font-medium">
                            {format(selectedDate, "EEEE, d 'de' MMMM", {
                              locale: es
                            })}
                            , {format(selectedSlot.start, "HH:mm")} -{" "}
                            {format(selectedSlot.end, "HH:mm")}
                          </p>
                        </div>
                      </div>

                      <Button
                        className="mt-4 w-full"
                        onClick={() => setBookingFormOpen(true)}
                      >
                        Confirmar Reserva
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="info">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4">
                  Acerca de {dataBusiness?.company_name}
                </h2>
                <p className="text-gray-600 mb-6">
                  {dataBusiness?.description}
                </p>

                <Separator className="my-6" />

                <h3 className="text-xl font-semibold mb-4">
                  Horarios de Atención
                </h3>
                {schedulesHrs.map((sch) => (
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="grid grid-cols-2 gap-2">
                      <p className="text-gray-600">{sch.day}</p>
                      <p className="font-medium">
                        {sch.startTime} - {sch.endTime}
                      </p>
                    </div>
                  </div>
                ))}

                <Separator className="my-6" />

                <h3 className="text-xl font-semibold mb-4">Contacto</h3>
                <div className="space-y-3">
                  {dataBusiness?.address && (
                    <div className="flex items-start">
                      <svg
                        className="w-5 h-5 mr-3 text-gray-500 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <div>
                        <h4 className="font-medium">Dirección</h4>
                        <p className="text-gray-600">{dataBusiness.address}</p>
                      </div>
                    </div>
                  )}

                  {dataBusiness?.phone && (
                    <div className="flex items-start">
                      <svg
                        className="w-5 h-5 mr-3 text-gray-500 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <div>
                        <h4 className="font-medium">Teléfono</h4>
                        <p className="text-gray-600">{dataBusiness.phone}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 mr-3 text-gray-500 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <h4 className="font-medium">Email</h4>
                      <p className="text-gray-600">{dataBusiness?.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Formulario de reserva */}
        {selectedService && (
          <BookingForm
            service={selectedService}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            open={bookingFormOpen}
            onClose={() => setBookingFormOpen(false)}
            onSubmit={handleCreateBooking}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BusinessPage;
