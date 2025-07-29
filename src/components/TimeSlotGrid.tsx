import { Booking, ScheduleSettings, Service, TimeSlot } from "@/types";
import { Calendar, Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Employee, Schedule } from "@/types/dashboard";
import { addDays, addMinutes, format, getDay, parse } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { calculateSlotCapacity } from "@/utils/calculateSlotCapacity";
import { es } from "date-fns/locale";
import { useEffect } from "react";

interface TimeSlotGridProps {
  date: Date;
  workHours: {
    start: string;
    end: string;
  };
  slotDuration: number;
  breakBetweenSlots: number;
  defaultCapacity: number;
  selectedService?: Service;
  bookedSlots?: Booking[];
  scheduleSettings?: ScheduleSettings;
  employees?: Employee[];
  employeeSchedules?: Schedule[];
  onSelectSlot: (start: Date, end: Date) => void;
}

export const TimeSlotGrid = ({
  date,
  workHours,
  slotDuration,
  breakBetweenSlots,
  defaultCapacity,
  selectedService,
  bookedSlots = [],
  scheduleSettings,
  employees = [],
  employeeSchedules = [],
  onSelectSlot,
}: TimeSlotGridProps) => {
  const weekDay = getDay(date);

  const worksHours = selectedService.schedule
    .filter((s) => s.dayOfWeek === weekDay)
    .map((s) => {
      return {
        end: s.endTime,
        start: s.startTime,
      };
    });

  const dateString = format(date, "yyyy-MM-dd");

  const generateTimeSlots = () => {
    const slots = [];

    worksHours.forEach((wh) => {
      let start = parse(
        `${dateString} ${wh.start}`,
        "yyyy-MM-dd HH:mm",
        new Date()
      );
      let end = parse(
        `${dateString} ${wh.end}`,
        "yyyy-MM-dd HH:mm",
        new Date()
      );

      if (end < start) {
        end = addDays(end, 1);
      }

      let currentTime = start;

      while (currentTime < end) {
        const slotEndTime = addMinutes(currentTime, slotDuration);
        const timeStart = format(currentTime, "HH:mm");
        const timeEnd = format(slotEndTime, "HH:mm");

        let slotCapacity: number;

        if (scheduleSettings && employees.length > 0) {
          slotCapacity = calculateSlotCapacity({
            date,
            timeStart,
            timeEnd,
            service: selectedService,
            scheduleSettings,
            employees,
            employeeSchedules,
            bookedSlots,
          });
        } else {
          slotCapacity =
            selectedService?.capacity ||
            selectedService.allowedEmployeeIds?.length ||
            defaultCapacity;
        }

        const currentBookings = bookedSlots.filter((booking) => {
          if (booking.date !== dateString || booking.status === "cancelled") {
            return false;
          }

          const bookingStart = new Date(booking.start);
          const bookingEnd = new Date(booking.end);

          return (
            (currentTime >= bookingStart && currentTime < bookingEnd) ||
            (slotEndTime > bookingStart && slotEndTime <= bookingEnd) ||
            (currentTime <= bookingStart && slotEndTime >= bookingEnd)
          );
        }).length;

        const availableSlots = Math.max(0, slotCapacity - currentBookings);
        const isFullyBooked = availableSlots <= 0;

        slots.push({
          start: new Date(currentTime),
          end: new Date(slotEndTime),
          isFullyBooked,
          availableSlots,
          totalCapacity: slotCapacity,
          currentBookings,
        });

        currentTime = addMinutes(slotEndTime, breakBetweenSlots);
      }
    });

    return slots;
  };

  const slots = generateTimeSlots();

  const isBlackoutDate = scheduleSettings?.blackoutDates?.some(
    (b) => b.date === format(date, "yyyy-MM-dd")
  );

  if (isBlackoutDate) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">
              No hay horarios disponibles
            </p>
            <p className="text-gray-400 text-sm">
              El negocio no atiende este día.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">
              {format(date, "EEEE, d 'de' MMMM", { locale: es })}
            </h3>
          </div>
        </div>

        {/* Time slots grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {slots.map((slot, index) => {
            const isAvailable = !slot.isFullyBooked;
            const capacityPercentage =
              slot["totalCapacity"] > 0 &&
              (slot["availableSlots"] / slot["totalCapacity"]) * 100;
            return (
              <div key={index} className="relative group">
                <Button
                  onClick={() =>
                    isAvailable && onSelectSlot(slot.start, slot.end)
                  }
                  variant={isAvailable ? "outline" : "secondary"}
                  disabled={!isAvailable}
                  className={`
                    w-20 h-auto p-3 flex flex-col  items-center space-y-2 transition-all duration-200 border-2
                    ${
                      isAvailable
                        ? "border-primary/20 hover:border-primary hover:bg-primary/5 hover:shadow-md"
                        : "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                    }
                    ${
                      capacityPercentage <= 50 && capacityPercentage > 25
                        ? "border-orange-200 bg-orange-50"
                        : ""
                    }
                  `}
                >
                  {/* Time display */}
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-gray-500" />
                    <span className="font-mono text-sm font-medium">
                      {format(slot["start"], "HH:mm")}
                    </span>
                  </div>

                  {/* Capacity badge */}
                  {slot["totalCapacity"] > 1 && (
                    <Badge
                      variant={
                        slot["isFullyBooked"]
                          ? "destructive"
                          : capacityPercentage <= 25
                          ? "secondary"
                          : "default"
                      }
                      className="text-xs px-2 py-0.5 min-w-0"
                    >
                      <Users className="h-2.5 w-2.5 mr-1" />
                      {slot["availableSlots"]}/{slot["totalCapacity"]}
                    </Badge>
                  )}

                  {/* No employees badge */}
                  {slot["totalCapacity"] === 0 && (
                    <Badge
                      variant="destructive"
                      className="text-xs px-2 py-0.5"
                    >
                      Sin personal
                    </Badge>
                  )}

                  {/* Status indicator */}
                  {isAvailable && (
                    <div className="flex items-center space-x-1 text-xs text-green-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>Disponible</span>
                    </div>
                  )}

                  {slot["isFullyBooked"] && (
                    <div className="flex items-center space-x-1 text-xs text-red-600">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      <span>Completo</span>
                    </div>
                  )}
                </Button>

                {/* Hover tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                  {format(slot.start, "HH:mm")} - {format(slot.end, "HH:mm")}
                  {slot["totalCapacity"] > 1 && (
                    <div className="mt-1">
                      Capacidad: {slot["availableSlots"]}/
                      {slot["totalCapacity"]}
                    </div>
                  )}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {slots.length === 0 && (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">
              No hay horarios disponibles
            </p>
            <p className="text-gray-400 text-sm">
              Intenta seleccionar otra fecha o contacta al negocio directamente.
            </p>
          </div>
        )}

        {/* Legend */}
        {Object.entries(slots).length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border-2 border-primary/20 bg-white rounded"></div>
                <span>Disponible</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border-2 border-orange-200 bg-orange-50 rounded"></div>
                <span>Pocos cupos</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border-2 border-gray-200 bg-gray-50 rounded"></div>
                <span>Completo</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
