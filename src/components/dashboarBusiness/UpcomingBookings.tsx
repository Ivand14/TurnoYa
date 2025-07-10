import { Booking, Service } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import React, { useEffect, useState, useMemo } from "react";
import { Search, Filter, X, Calendar, Users } from "lucide-react";

import { BookingCard } from "@/components/BookingCard";
import { getServiceForBooking } from "@/utils/dashboardUtils";
import { useBookingContext } from "@/context/apisContext/bookingContext";

interface UpcomingBookingsProps {
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
}

const UpcomingBookings: React.FC<UpcomingBookingsProps> = ({
  bookings,
  onCancelBooking,
}) => {
  const [services, setServices] = useState<Record<string, Service>>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>(
    []
  );
  const [showFilters, setShowFilters] = useState<boolean>(false);

  useEffect(() => {
    const loadServices = async () => {
      const servicesMap: Record<string, Service> = {};
      for (const booking of bookings) {
        const service = await getServiceForBooking(booking);
        if (service) {
          servicesMap[booking.serviceId] = service;
        }
      }
      setServices(servicesMap);
    };
    loadServices();
  }, [bookings]);

  // Get unique service types from all bookings
  const availableServiceTypes = useMemo(() => {
    const types = new Set<string>();
    bookings.forEach((booking) => {
      const service = services[booking.serviceId];
      if (service?.name_service) {
        types.add(service.name_service);
      }
    });
    return Array.from(types).sort();
  }, [bookings, services]);

  // Filter and search bookings
  const processedBookings = useMemo(() => {
    let result = bookings;

    // Filter by search term (name or email)
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      result = result.filter(
        (booking) =>
          booking.userName.toLowerCase().includes(search) ||
          booking.userEmail.toLowerCase().includes(search)
      );
    }

    // Filter by service types
    if (selectedServiceTypes.length > 0) {
      result = result.filter((booking) => {
        const service = services[booking.serviceId];
        return (
          service?.name_service &&
          selectedServiceTypes.includes(service.name_service)
        );
      });
    }

    // Sort by date and time
    return result.sort((a, b) => {
      const dateA = new Date(a.start);
      const dateB = new Date(b.start);
      return dateA.getTime() - dateB.getTime();
    });
  }, [bookings, searchTerm, selectedServiceTypes, services]);

  const toggleServiceType = (serviceType: string) => {
    setSelectedServiceTypes((prev) =>
      prev.includes(serviceType)
        ? prev.filter((type) => type !== serviceType)
        : [...prev, serviceType]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedServiceTypes([]);
  };

  const hasActiveFilters = searchTerm.trim() || selectedServiceTypes.length > 0;


  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-2xl font-light text-gray-900">
                Próximas Reservas
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Todas las reservas programadas
              </p>
            </div>
          </div>

          {bookings.length > 0 && (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {processedBookings.length} de {bookings.length} reserva
                  {bookings.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="h-px bg-gradient-to-r from-gray-200 via-gray-100 to-transparent"></div>
      </div>

      {/* Search and Filters Section */}
      {bookings.length > 0 && (
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
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 ${
                showFilters ? "bg-gray-50" : ""
              }`}
            >
              <Filter className="w-4 h-4" />
              Filtros
              {selectedServiceTypes.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 px-1.5 py-0.5 text-xs"
                >
                  {selectedServiceTypes.length}
                </Badge>
              )}
            </Button>
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

          {/* Filters */}
          {showFilters && availableServiceTypes.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">
                  Tipo de servicio
                </h4>
                <div className="flex flex-wrap gap-2">
                  {availableServiceTypes.map((serviceType) => (
                    <Button
                      key={serviceType}
                      variant={
                        selectedServiceTypes.includes(serviceType)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => toggleServiceType(serviceType)}
                      className={`text-xs ${
                        selectedServiceTypes.includes(serviceType)
                          ? "bg-blue-500 hover:bg-blue-600 text-white"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {serviceType}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-500">Filtros activos:</span>
              {searchTerm.trim() && (
                <Badge variant="secondary" className="text-xs">
                  Búsqueda: "{searchTerm}"
                </Badge>
              )}
              {selectedServiceTypes.map((type) => (
                <Badge
                  key={type}
                  variant="secondary"
                  className="text-xs flex items-center gap-1"
                >
                  {type}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-gray-700"
                    onClick={() => toggleServiceType(type)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content Section */}
      <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardContent className="p-8">
          {processedBookings.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      service={services[booking.serviceId]}
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
                      : "Total de próximas reservas"}
                  </span>
                  <span className="font-medium text-gray-700">
                    {processedBookings.length} reserva
                    {processedBookings.length !== 1 ? "s" : ""}
                    {hasActiveFilters && ` de ${bookings.length} total`}
                  </span>
                </div>
              </div>
            </div>
          ) : bookings.length > 0 ? (
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
            // No bookings at all
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
                No hay próximas reservas
              </h3>
              <p className="text-gray-400 text-center max-w-sm">
                No tienes reservas programadas en este momento
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

export default UpcomingBookings;
