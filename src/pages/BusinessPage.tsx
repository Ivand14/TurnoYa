import {} from "@/context/login.state";

import { Booking, ScheduleSettings, Service, TimeSlot } from "@/types";
import { Navigate, useHref, useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { BookingForm } from "@/components/BookingForm";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/Calendar";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Separator } from "@/components/ui/separator";
import { ServiceCard } from "@/components/ServiceCard";
import { TimeSlotGrid } from "@/components/TimeSlotGrid";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { toast } from "sonner";
import { useCallback } from "react";
import { useBookingContext } from "@/context/apisContext/bookingContext";
import { useBusinessContext } from "@/context/apisContext/businessContext";
import Loading from "@/components/loading";
import { current_user } from "@/context/currentUser";
import { useServicesContext } from "@/context/apisContext/servicesContext";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  Users,
  Calendar as CalendarIcon,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import ServiceCardCategory from "@/components/ServiceCardCategory";
// import ServiceCardCategory from "@/components/ServiceCardCategory";

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  notes?: string;
  paymentAmount: number;
  paymentPercentage: number;
}

const BusinessPage = () => {
  const { businessId } = useParams();
  const { fetchGetBooking, fetchCreateBooking, booking } = useBookingContext();
  const { fetchBusinessById, businessForId } = useBusinessContext();
  const { fetchGetServices, services } = useServicesContext();
  const [bookingId, setBookingId] = useState<string>("");
  const { user } = current_user();
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const slotRef = useRef<HTMLDivElement | null>(null);

  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [bookingFormOpen, setBookingFormOpen] = useState(false);
  const [scheduleSettings, setScheduleSettings] = useState<ScheduleSettings>({
    businessId: "",
    workDays: [],
    workHours: { start: "09:00", end: "17:00" },
    slotDuration: 30,
    breakBetweenSlots: 5,
    days_business: [],
    defaultCapacity: 0,
    capacityMode: "fixed",
  });

  const scheduleInfo = useCallback(async () => {
    const days_business = [];
    const workDays = [];
    const blackoutDates = [];
    let startTime: string = "";
    let endTime: string = "";

    const dayMap: Record<string, number> = {
      dom: 0,
      lun: 1,
      mar: 2,
      mié: 3,
      jue: 4,
      vie: 5,
      sáb: 6,
    };

    services.forEach((sch) => {
      if (selectedService?.id === sch.id) {
        sch.schedule.forEach((day) => {
          days_business.push(day.dayOfWeek);
          startTime = day.startTime;
          endTime = day.endTime;
          workDays.push(day.dayOfWeek);
        });
        sch.blackoutDates.forEach((date) => {
          blackoutDates.push(date);
        });
      }
    });

    days_business.sort((a, b) => (dayMap[a] || 0) - (dayMap[b] || 0));

    setScheduleSettings({
      businessId: businessId || "",
      workDays: workDays,
      workHours: { start: startTime, end: endTime },
      slotDuration: 30,
      breakBetweenSlots: 0,
      days_business: days_business,
      defaultCapacity: 0,
      capacityMode: "fixed",
      blackoutDates: blackoutDates,
    });
  }, [businessId, services, selectedDate, selectedService]);

  useEffect(() => {
    if (!businessId) return;
    fetchBusinessById(businessId);

    const fetchAdditionalData = async () => {
      await fetchGetServices(businessId);
      await fetchGetBooking(businessId);

      setInitialLoading(false);
    };

    fetchAdditionalData();
  }, [businessId, selectedDate]);

  useEffect(() => {
    if (!businessId) return;
    scheduleInfo();
  }, [businessId, services, booking, selectedService]);

  useEffect(() => {
    const paymentCheck = async () => {
      const params = new URLSearchParams(window.location.search);
      const payment_id = params.get("payment_id");
      const paymentStatus = params.get("collection_status");
      const bookingId = params.get("external_reference");

      if (payment_id && paymentStatus === "approved" && bookingId) {
        try {
          const res = await fetch(
            "https://turnosya-backend.onrender.com/status_payment",
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                bookingId: bookingId,
                payment_id,
                payment_status: paymentStatus,
                status: "confirmed",
              }),
            }
          );

          if (!res.ok) {
            throw new Error("No se pudo confirmar la reserva");
          }

          await fetchGetBooking(businessId);

          setBookingFormOpen(false);
          setSelectedSlot(null);

          toast.success("¡Reserva confirmada con éxito!");
        } catch (error) {
          toast.error("Error al confirmar la reserva");
          console.error(error);
        }
      }

      if (paymentStatus === "cancel") {
        toast.error("No se pudo hacer el pago");
      }
    };

    paymentCheck();
  }, []);

  if (!businessId) {
    return <Navigate to="/businesses" />;
  }

  // Obtener horarios reservados para la fecha seleccionada
  const getBookedTimeSlotsForDate = (date: Date): TimeSlot[] => {
    const dateString = format(date, "yyyy-MM-dd");
    const serviceId = selectedService?.id || "";

    return booking
      .filter(
        (booking) =>
          booking.businessId === businessId &&
          booking.serviceId === serviceId &&
          booking.date === dateString &&
          booking.status !== "cancelled"
      )
      .map((booking) => ({
        id: booking.id,
        start: booking.start,
        end: booking.end,
        available: false,
        serviceId: booking.serviceId,
        businessId: booking.businessId,
        date: booking.date,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        userId: booking.userId,
        userName: booking.userName,
        userEmail: booking.userEmail,
        userPhone: booking.userPhone,
        serviceName: selectedService?.name_service || "",
      }));
  };

  // Manejar selección de servicio
  const handleSelectService = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    if (service) {
      setSelectedService(service);
      setSelectedSlot(null);
    }
  };

  // Manejar selección de horario
  const handleSelectTimeSlot = async (start: Date, end: Date) => {
    setSelectedSlot({ start, end });

    if (selectedService) {
      setBookingFormOpen(true);
    } else {
      toast.error("Por favor, seleccione un servicio primero");
    }
  };

  const handleCreateBooking = async (formData: BookingFormData) => {
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      businessId: businessId,
      serviceName: selectedService?.name_service || "",
      serviceId: selectedService?.id || "",
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userPhone: formData.phone,
      date: selectedDate.toISOString().split("T")[0],
      start: selectedSlot?.start.toISOString() || "",
      end: selectedSlot?.end.toISOString() || "",
      status: "pending",
      paymentStatus: "pending",
      notes: formData.notes,
      payment_id: null,
      price: selectedService.price,
      paymentPercentage: formData.paymentPercentage,
      paymentAmount: formData.paymentAmount || 0,
      requiresDeposit: selectedService.requiresDeposit || false,
    };
    setBookingId(newBooking.id);
    await fetchCreateBooking(newBooking);
  };

  const getBusinessTypeInfo = (type: string) => {
    const types = {
      barbershop: {
        label: "Barbería",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        gradient: "from-blue-500 to-cyan-500",
      },
      beauty: {
        label: "Centro de Belleza",
        color: "bg-pink-100 text-pink-800 border-pink-200",
        gradient: "from-pink-500 to-rose-500",
      },
      sports: {
        label: "Centro Deportivo",
        color: "bg-green-100 text-green-800 border-green-200",
        gradient: "from-green-500 to-emerald-500",
      },
      health: {
        label: "Centros de Salud",
        color: "bg-violet-100 text-violet-800 border-violet-200",
        gradient: "from-violet-500 to-violet-700",
      },
      other: {
        label: "Otros",
        color: "bg-purple-100 text-purple-800 border-purple-200",
        gradient: "from-purple-500 to-indigo-500",
      },
    };

    return types[type] || types.other;
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Loading />
      </div>
    );
  }

  const businessType = getBusinessTypeInfo(businessForId?.company_type);

  const goToCalendar = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const servicesWithCat = services.filter((ser) => ser.category);

  console.log(servicesWithCat);

  return (
    <div
      className="flex flex-col min-h-screen bg-gray-50"
      key={businessForId.id}
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${businessType.gradient} opacity-10`}
        ></div>
        <div className="relative bg-white border-b border-gray-200">
          <Navbar />
          <div className="container mx-auto px-6 py-12 mt-20">
            <motion.div
              className="flex flex-col lg:flex-row items-center lg:items-start gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Logo */}
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-32 h-32 bg-white rounded-2xl overflow-hidden shadow-xl border-4 border-white group-hover:shadow-2xl transition-all duration-300">
                  {businessForId?.logo ? (
                    <img
                      src={businessForId.logo}
                      alt={businessForId.company_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${businessType.gradient} flex items-center justify-center`}
                    >
                      <Sparkles className="w-12 h-12 text-white" />
                    </div>
                  )}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </motion.div>

              {/* Business Info */}
              <div className="flex-1 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                    {businessForId?.company_name}
                  </h1>

                  <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                    <Badge
                      className={`${businessType.color} border px-4 py-2 text-sm font-medium`}
                    >
                      {businessType.label}
                    </Badge>
                    {/* <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 px-4 py-2 text-sm font-medium">
                      <Star className="w-4 h-4 mr-1" />
                      4.8 (124 reseñas)
                    </Badge> */}
                  </div>

                  <p className="text-lg text-gray-600 mb-6 max-w-2xl">
                    {businessForId?.description}
                  </p>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {businessForId?.address && (
                      <div className="flex items-center justify-center lg:justify-start text-gray-600">
                        <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
                        <span>{businessForId.address}</span>
                      </div>
                    )}

                    {businessForId?.phone && (
                      <div className="flex items-center justify-center lg:justify-start text-gray-600">
                        <Phone className="w-5 h-5 mr-2 text-indigo-600" />
                        <span>{businessForId.phone}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-center lg:justify-start text-gray-600">
                      <Mail className="w-5 h-5 mr-2 text-indigo-600" />
                      <span>{businessForId?.email}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <main className="flex-grow">
        <div className="container mx-auto px-6 py-8">
          <Tabs defaultValue="booking" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-white shadow-lg border border-gray-200 p-1 rounded-xl">
                <TabsTrigger
                  value="booking"
                  className="px-6 py-3 rounded-lg font-medium data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Reservar Cita
                </TabsTrigger>
                <TabsTrigger
                  value="info"
                  className="px-6 py-3 rounded-lg font-medium data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Información
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="booking">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 w-full">
                {/* Services Section */}
                <motion.div
                  className="xl:col-span-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-24">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Servicios
                      </h2>
                    </div>

                    <div className="space-y-3">
                      <ServiceCardCategory
                        goToCalendar={() => goToCalendar(calendarRef)}
                        service={servicesWithCat}
                        onReserve={handleSelectService}
                      />
                      {services.map((service, index) => (
                        <motion.div
                          key={service.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          {!service.category && (
                            <ServiceCard
                              goToCalendar={() => goToCalendar(calendarRef)}
                              service={service}
                              onReserve={handleSelectService}
                            />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Booking Section */}
                <div className="xl:col-span-2">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Calendar */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <div
                        ref={calendarRef}
                        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
                      >
                        <div className="flex items-center mb-6">
                          <CalendarIcon className="w-6 h-6 text-indigo-600 mr-3" />
                          <h2 className="text-xl font-bold text-gray-900">
                            Seleccionar Fecha
                          </h2>
                        </div>
                        <Calendar
                          goToCalendar={() => goToCalendar(slotRef)}
                          selectedDate={selectedDate}
                          onSelectDate={(date) => {
                            setSelectedDate(date);
                            setSelectedSlot(null);
                          }}
                          scheduleSettings={scheduleSettings}
                        />
                      </div>
                    </motion.div>

                    {/* Time Slots */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <div
                        ref={slotRef}
                        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
                      >
                        <div className="flex items-center mb-6">
                          <Clock className="w-6 h-6 text-indigo-600 mr-3" />
                          <h2 className="text-xl font-bold text-gray-900">
                            {selectedService
                              ? `Horarios para ${selectedService.name_service}`
                              : "Seleccione un servicio"}
                          </h2>
                        </div>

                        {selectedService ? (
                          <div>
                            {selectedService.capacity > 0 && (
                              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                <div className="flex items-center">
                                  <Users className="w-5 h-5 text-blue-600 mr-2" />
                                  <p className="text-sm text-blue-800 font-medium">
                                    <strong>Servicio grupal:</strong> Hasta{" "}
                                    {selectedService.capacity} personas pueden
                                    reservar el mismo horario.
                                  </p>
                                </div>
                              </div>
                            )}

                            <TimeSlotGrid
                              date={selectedDate}
                              workHours={scheduleSettings.workHours}
                              slotDuration={selectedService.duration}
                              breakBetweenSlots={
                                scheduleSettings.breakBetweenSlots
                              }
                              defaultCapacity={scheduleSettings.defaultCapacity}
                              selectedService={selectedService}
                              bookedSlots={getBookedTimeSlotsForDate(
                                selectedDate
                              )}
                              onSelectSlot={handleSelectTimeSlot}
                              scheduleSettings={scheduleSettings}
                            />
                          </div>
                        ) : (
                          <div className="bg-gray-50 p-12 rounded-xl text-center">
                            <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">
                              Por favor, seleccione un servicio para ver los
                              horarios disponibles
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {/* Booking Summary */}
                  {selectedService && selectedSlot && (
                    <motion.div
                      className="mt-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
                        <div className="flex items-center mb-6">
                          <CheckCircle className="w-8 h-8 mr-3" />
                          <h2 className="text-2xl font-bold">
                            Resumen de Reserva
                          </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <h3 className="text-sm font-medium text-indigo-200 mb-2">
                              Servicio:
                            </h3>
                            <p className="font-bold text-lg">
                              {selectedService.name_service}
                            </p>
                          </div>

                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <h3 className="text-sm font-medium text-indigo-200 mb-2">
                              Precio:
                            </h3>
                            <p className="font-bold text-lg">
                              ${selectedService.price}
                            </p>
                          </div>

                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <h3 className="text-sm font-medium text-indigo-200 mb-2">
                              Duración:
                            </h3>
                            <p className="font-bold text-lg">
                              {selectedService.duration} minutos
                            </p>
                          </div>

                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <h3 className="text-sm font-medium text-indigo-200 mb-2">
                              Fecha y hora:
                            </h3>
                            <p className="font-bold text-lg">
                              {format(selectedDate, "EEEE, d 'de' MMMM", {
                                locale: es,
                              })}
                            </p>
                            <p className="font-bold text-lg">
                              {format(selectedSlot.start, "HH:mm")} -{" "}
                              {format(selectedSlot.end, "HH:mm")}
                            </p>
                          </div>
                        </div>

                        <Button
                          className="w-full bg-white text-indigo-600 hover:bg-gray-100 font-bold py-4 text-lg rounded-xl shadow-lg group"
                          onClick={() => setBookingFormOpen(true)}
                        >
                          Confirmar Reserva
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="info" key={businessId}>
              <motion.div
                className="max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Acerca de {businessForId?.company_name}
                  </h2>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    {businessForId?.description}
                  </p>

                  <Separator className="my-8" />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact */}
                    <div>
                      <div className="flex items-center mb-6">
                        <Mail className="w-6 h-6 text-indigo-600 mr-3" />
                        <h3 className="text-xl font-bold text-gray-900">
                          Información de Contacto
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {businessForId?.address && (
                          <div className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <MapPin className="w-6 h-6 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">
                                Dirección
                              </h4>
                              <p className="text-gray-600">
                                {businessForId.address}
                              </p>
                            </div>
                          </div>
                        )}

                        {businessForId?.phone && (
                          <div className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <Phone className="w-6 h-6 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">
                                Teléfono
                              </h4>
                              <p className="text-gray-600">
                                {businessForId.phone}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <Mail className="w-6 h-6 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">
                              Email
                            </h4>
                            <p className="text-gray-600">
                              {businessForId?.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Booking Form */}
        {selectedService && (
          <BookingForm
            service={selectedService}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            open={bookingFormOpen}
            onClose={() => setBookingFormOpen(false)}
            onSubmit={handleCreateBooking}
            businessId={businessId}
            bookingId={bookingId}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BusinessPage;
