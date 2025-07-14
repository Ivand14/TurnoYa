import { Booking, Service } from "@/types";

export type ViewMode = "grid" | "list";
export type SortOption = "date" | "service" | "customer" | "status";
export type SortDirection = "asc" | "desc";
export type GroupingMode = "day" | "service" | "none";

export interface BookingGroup {
  key: string;
  title: string;
  subtitle?: string;
  bookings: Booking[];
  icon: React.ReactNode;
  color: string;
}

export interface BookingAnalytics {
  total: number;
  today: number;
  thisWeek: number;
  confirmed: number;
  pending: number;
  cancelled: number;
}

export interface BookingFilters {
  searchTerm: string;
  selectedServiceTypes: string[];
  selectedStatuses: string[];
}

export interface UpcomingBookingsProps {
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
}
