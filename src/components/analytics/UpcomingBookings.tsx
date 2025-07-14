import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

import { Service } from "@/types";
import {
  UpcomingBookingsProps,
  ViewMode,
  GroupingMode,
  SortOption,
  SortDirection,
} from "@/types/bookings";
import { getServiceForBooking } from "@/utils/dashboardUtils";

import { useBookingAnalytics } from "@/hooks/useBookingAnalytics";
import { useBookingFilters } from "@/hooks/useBookingFilters";
import { useBookingGrouping } from "@/hooks/useBookingGrouping";

import { BookingAnalyticsCard } from "@/components/analytics/BookingAnalytics";
import { BookingFilters } from "@/components/analytics/BookingFilters";
import { BookingControls } from "@/components/analytics/BookingControls";
import { BookingGroup } from "@/components/analytics/BookingGroup";
import { EmptyState } from "@/components/analytics/EmptyState";
import { BookingResultsFooter } from "@/components/analytics/BookingResultsFooter";
import { useServicesContext } from "@/context/apisContext/servicesContext";

const UpcomingBookings: React.FC<UpcomingBookingsProps> = ({
  bookings,
  onCancelBooking,
}) => {
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [groupingMode, setGroupingMode] = useState<GroupingMode>("day");
  const [isLoading, setIsLoading] = useState(false);
  const { services } = useServicesContext();

  // Load services
  useEffect(() => {
    const loadServices = async () => {
      setIsLoading(true);
      const servicesMap: Service = {};
      for (const booking of bookings) {
        const service = await getServiceForBooking(booking);
        if (service) {
          servicesMap[booking.serviceId] = service;
        }
      }
      setIsLoading(false);
    };
    loadServices();
  }, [bookings]);

  // Custom hooks
  const analytics = useBookingAnalytics(bookings);
  const {
    filters,
    processedBookings,
    availableServiceTypes,
    availableStatuses,
    hasActiveFilters,
    sortBy,
    sortDirection,
    setSearchTerm,
    toggleServiceType,
    toggleStatus,
    clearAllFilters,
    handleSort,
  } = useBookingFilters({ bookings, services });


  const { groupedBookings } = useBookingGrouping({
    bookings: processedBookings,
    services,
    groupingMode,
  });

  // Handlers
  const handleSortChange = (value: string) => {
    const [option, direction] = value.split("-") as [SortOption, SortDirection];
    handleSort(option);
  };

  const toggleFilters = () => setShowFilters(!showFilters);

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <BookingAnalyticsCard analytics={analytics} />

      {/* Controls Section */}
      <motion.div
        className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Filters */}
        <BookingFilters
          searchTerm={filters.searchTerm}
          onSearchChange={setSearchTerm}
          selectedServiceTypes={filters.selectedServiceTypes}
          selectedStatuses={filters.selectedStatuses}
          availableServiceTypes={availableServiceTypes}
          availableStatuses={availableStatuses}
          onToggleServiceType={toggleServiceType}
          onToggleStatus={toggleStatus}
          onClearFilters={clearAllFilters}
          showFilters={showFilters}
          onToggleFilters={toggleFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Controls */}
        <div className="flex justify-end mt-4">
          <BookingControls
            viewMode={viewMode}
            setViewMode={setViewMode}
            groupingMode={groupingMode}
            setGroupingMode={setGroupingMode}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            processedBookings={processedBookings}
          />
        </div>
      </motion.div>

      {/* Results Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                <Users className="w-6 h-6 text-blue-600" />
                Reservas Próximas
                {groupingMode !== "none" && (
                  <Badge variant="outline" className="ml-2">
                    {groupingMode === "day"
                      ? "Agrupado por día"
                      : "Agrupado por servicio"}
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>
                  Mostrando {processedBookings.length} de {bookings.length}{" "}
                  reservas
                </span>
                {/* {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />} */}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {processedBookings.length > 0 ? (
              <div className="space-y-8">
                {groupedBookings.map((group, groupIndex) => (
                  <BookingGroup
                    key={group.key}
                    group={group}
                    services={services}
                    viewMode={viewMode}
                    groupingMode={groupingMode}
                    onCancelBooking={onCancelBooking}
                    groupIndex={groupIndex}
                  />
                ))}

                <BookingResultsFooter
                  processedBookingsCount={processedBookings.length}
                  groupedBookingsCount={groupedBookings.length}
                  groupingMode={groupingMode}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>
            ) : bookings.length > 0 ? (
              <EmptyState type="no-results" onClearFilters={clearAllFilters} />
            ) : (
              <EmptyState type="no-bookings" />
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default UpcomingBookings;
