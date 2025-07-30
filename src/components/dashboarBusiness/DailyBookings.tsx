import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Booking } from "@/types";
import { BookingCard } from "@/components/BookingCard";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { getServiceForBooking } from "@/utils/dashboardUtils";
import { Calendar, Clock, Users, Search, Filter, X } from "lucide-react";

interface DailyBookingsProps {
  selectedDate: Date;
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
}

const DailyBookings: React.FC<DailyBookingsProps> = ({
  selectedDate,
  bookings,
  onCancelBooking,
}) => {
  const [services, setServices] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([
    "futbol",
  ]);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);

    const fetchServices = async () => {
      try {
        const results = await Promise.all(
          bookings.map(async (booking) => ({
            id: booking.id,
            service: await getServiceForBooking(booking),
          }))
        );

        const newServices: Record<string, any> = {};
        results.forEach(({ id, service }) => {
          newServices[id] = service;
        });

        setServices(newServices);
      } catch (error) {
        console.error("Error al obtener servicios:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [bookings]);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const current_date = formatDate(selectedDate);
  const filteredBookings = bookings.filter(
    (booking) => booking.date === current_date
  );

  // Get unique service types from all bookings
  const availableServiceTypes = useMemo(() => {
    const types = new Set<string>();
    filteredBookings.forEach((booking) => {
      const service = services[booking.id];
      if (service?.name_service) {
        types.add(service.name_service);
      }
    });
    return Array.from(types).sort();
  }, [filteredBookings, services]);

  // Filter and search bookings
  const processedBookings = useMemo(() => {
    let result = filteredBookings;

    // Filter by search term (name or email)
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      result = result.filter(
        (booking) =>
          booking.userName.toLowerCase().includes(search) ||
          booking.userEmail.toLowerCase().includes(search)
      );
    }

    // Sort by time
    return result.sort((a, b) => {
      if (a.time && b.time) {
        return a.time.localeCompare(b.time);
      }
      return 0;
    });
  }, [filteredBookings, searchTerm, selectedServiceTypes, services]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedServiceTypes([]);
  };

  const hasActiveFilters = searchTerm.trim() || selectedServiceTypes.length > 0;

  const isToday = formatDate(new Date()) === current_date;
  const isPast =
    new Date(selectedDate) < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isToday ? "bg-blue-50" : isPast ? "bg-gray-50" : "bg-green-50"
              }`}
            >
              <Calendar
                className={`w-6 h-6 ${
                  isToday
                    ? "text-blue-500"
                    : isPast
                    ? "text-gray-400"
                    : "text-green-500"
                }`}
              />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-light text-gray-900 capitalize">
                {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {isToday ? "Hoy" : isPast ? "Fecha pasada" : "Próxima fecha"}
              </p>
            </div>
          </div>

          {filteredBookings.length > 0 && (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {processedBookings.length} de {filteredBookings.length}{" "}
                  reserva
                  {filteredBookings.length !== 1 ? "s" : ""}
                </span>
              </div>
              {processedBookings[0]?.time && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Desde {processedBookings[0].time}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="h-px bg-gradient-to-r from-gray-200 via-gray-100 to-transparent"></div>
      </div>

      {/* Search and Filters Section */}
      {filteredBookings.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
          {/* Search Bar */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre o email del cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
              />
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearAllFilters}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
                Limpiar
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Content Section */}
      <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardContent className="p-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin"></div>
                <p className="text-gray-500 font-light">Cargando reservas...</p>
              </div>
            </div>
          ) : processedBookings.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {processedBookings.map((booking, index) => (
                  <div
                    key={booking.id}
                    className="transform transition-all duration-200 hover:scale-[1.02]"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: "fadeInUp 0.5s ease-out forwards",
                    }}
                  >
                    <BookingCard
                      booking={booking}
                      service={services[booking.id] || null}
                      onCancel={onCancelBooking}
                    />
                  </div>
                ))}
              </div>

              {/* Summary Footer */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>
                    {hasActiveFilters
                      ? "Reservas filtradas"
                      : "Total de reservas para este día"}
                  </span>
                  <span className="font-medium text-gray-700">
                    {processedBookings.length} reserva
                    {processedBookings.length !== 1 ? "s" : ""}
                    {hasActiveFilters && ` de ${filteredBookings.length} total`}
                  </span>
                </div>
              </div>
            </div>
          ) : filteredBookings.length > 0 ? (
            // No results after filtering
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center">
                  <Search className="w-10 h-10 text-gray-300" />
                </div>
              </div>
              <h3 className="text-lg font-light text-gray-600 mb-2">
                No se encontraron reservas
              </h3>
              <p className="text-gray-400 text-center max-w-sm mb-4">
                No hay reservas que coincidan con los filtros aplicados
              </p>
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="text-sm"
              >
                Limpiar filtros
              </Button>
            </div>
          ) : (
            // No bookings for the day
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-10 h-10 text-gray-300" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs text-gray-500">0</span>
                </div>
              </div>
              <h3 className="text-lg font-light text-gray-600 mb-2">
                Sin reservas programadas
              </h3>
              <p className="text-gray-400 text-center max-w-sm">
                No hay reservas programadas para{" "}
                {format(selectedDate, "d 'de' MMMM", { locale: es })}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default DailyBookings;
