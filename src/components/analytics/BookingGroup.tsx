import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { BookingCard } from "@/components/BookingCard";
import { BookingGroup as BookingGroupType, ViewMode } from "@/types/bookings";
import { Service } from "@/types";

interface BookingGroupProps {
  group: BookingGroupType;
  services: Service[];
  viewMode: ViewMode;
  groupingMode: string;
  onCancelBooking: (bookingId: string) => void;
  groupIndex: number;
}

export const BookingGroup: React.FC<BookingGroupProps> = ({
  group,
  services,
  viewMode,
  groupingMode,
  onCancelBooking,
  groupIndex,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: groupIndex * 0.1 }}
      className="space-y-4"
    >
      {/* Group Header */}
      {groupingMode !== "none" && (
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div
            className={`w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center ${group.color}`}
          >
            {group.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 capitalize">
              {group.title}
            </h3>
            {group.subtitle && (
              <p className="text-sm text-gray-500">{group.subtitle}</p>
            )}
          </div>
          <Badge variant="outline" className="text-xs">
            {group.bookings.length} reserva
            {group.bookings.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      )}

      {/* Group Bookings */}
      <div
        className={`grid gap-6 ${
          viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
        }`}
      >
        <AnimatePresence>
          {group.bookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="transform transition-all duration-200 hover:scale-[1.02]"
            >
              <BookingCard
                booking={booking}
                service={services[booking.serviceId]}
                onCancel={onCancelBooking}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
