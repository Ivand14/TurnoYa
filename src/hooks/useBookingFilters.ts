import { useState, useMemo } from "react";
import { Booking, Service } from "@/types";
import { BookingFilters, SortOption, SortDirection } from "@/types/bookings";

interface UseBookingFiltersProps {
  bookings: Booking[];
  services: Service[];
}

export const useBookingFilters = ({
  bookings,
  services,
}: UseBookingFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>(
    []
  );
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const filters: BookingFilters = {
    searchTerm,
    selectedServiceTypes,
    selectedStatuses,
  };

  // Get unique service types and statuses
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

  const availableStatuses = useMemo(() => {
    const statuses = new Set<string>();
    bookings.forEach((booking) => {
      if (booking.status) {
        statuses.add(booking.status);
      }
    });
    return Array.from(statuses).sort();
  }, [bookings]);

  // Advanced filtering and sorting
  const processedBookings = useMemo(() => {
    let result = bookings;

    // Filter by search term
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      result = result.filter(
        (booking) =>
          booking.userName.toLowerCase().includes(search) ||
          booking.userEmail.toLowerCase().includes(search) ||
          services[booking.serviceId]?.name_service
            ?.toLowerCase()
            .includes(search)
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

    // Filter by statuses
    if (selectedStatuses.length > 0) {
      result = result.filter((booking) =>
        selectedStatuses.includes(booking.status)
      );
    }

    // Sort bookings
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "date":
          comparison =
            new Date(a.start).getTime() - new Date(b.start).getTime();
          break;
        case "service":
          const serviceA = services[a.serviceId]?.name_service || "";
          const serviceB = services[b.serviceId]?.name_service || "";
          comparison = serviceA.localeCompare(serviceB);
          break;
        case "customer":
          comparison = a.userName.localeCompare(b.userName);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [
    bookings,
    searchTerm,
    selectedServiceTypes,
    selectedStatuses,
    services,
    sortBy,
    sortDirection,
  ]);

  const toggleServiceType = (serviceType: string) => {
    setSelectedServiceTypes((prev) =>
      prev.includes(serviceType)
        ? prev.filter((type) => type !== serviceType)
        : [...prev, serviceType]
    );
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedServiceTypes([]);
    setSelectedStatuses([]);
  };

  const hasActiveFilters =
    searchTerm.trim() ||
    selectedServiceTypes.length > 0 ||
    selectedStatuses.length > 0;

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(option);
      setSortDirection("asc");
    }
  };

  return {
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
  };
};
