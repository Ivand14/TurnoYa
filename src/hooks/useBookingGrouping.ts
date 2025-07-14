import { useMemo } from "react";
import { Booking, Service } from "@/types";
import { BookingGroup, GroupingMode } from "@/types/bookings";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarDays, Briefcase, Users } from "lucide-react";
import { createElement } from "react";

interface UseBookingGroupingProps {
  bookings: Booking[];
  services: Service[];
  groupingMode: GroupingMode;
}

export const useBookingGrouping = ({
  bookings,
  services,
  groupingMode,
}: UseBookingGroupingProps) => {
  const groupedBookings = useMemo(() => {
    if (groupingMode === "none") {
      return [
        {
          key: "all",
          title: "Todas las reservas",
          bookings: bookings,
          icon: createElement(Users, { className: "w-5 h-5" }),
          color: "text-blue-600",
        },
      ];
    }

    const groups: Record<string, BookingGroup> = {};

    bookings.forEach((booking) => {
      let groupKey: string;
      let groupTitle: string;
      let groupSubtitle: string | undefined;
      let groupIcon: any;
      let groupColor: string;

      if (groupingMode === "day") {
        const bookingDate = new Date(booking.start);
        groupKey = format(bookingDate, "yyyy-MM-dd");
        groupTitle = format(bookingDate, "EEEE, d 'de' MMMM", { locale: es });
        groupSubtitle = format(bookingDate, "yyyy");
        (groupIcon = createElement(CalendarDays, { className: "w-5 h-5" })),
          (groupColor = "text-purple-600");
      } else {
        const service = services.find((sr) => sr.id === booking.serviceId);

        groupKey = booking.serviceId;
        groupTitle = service?.name_service || "Servicio desconocido";
        groupSubtitle = `$${service?.price || 0} • ${
          service?.duration || 0
        } min`;
        groupIcon = createElement(Briefcase, { className: "w-5 h-5" });
        groupColor = "text-green-600";
      }

      if (!groups[groupKey]) {
        groups[groupKey] = {
          key: groupKey,
          title: groupTitle,
          subtitle: groupSubtitle,
          bookings: [],
          icon: groupIcon,
          color: groupColor,
        };
      }

      groups[groupKey].bookings.push(booking);
    });

    // Sort groups
    const sortedGroups = Object.values(groups).sort((a, b) => {
      if (groupingMode === "day") {
        return a.key.localeCompare(b.key);
      } else {
        return a.title.localeCompare(b.title);
      }
    });

    return sortedGroups;
  }, [bookings, groupingMode, services]);

  return { groupedBookings };
};
