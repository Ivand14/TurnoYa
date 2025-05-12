
import { useState } from "react";
import { format, startOfWeek, addDays, isSameMonth, isSameDay, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Day } from "@/types";

interface CalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export const Calendar = ({ selectedDate, onSelectDate }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();

  const daysOfWeek = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">
          {format(currentMonth, "MMMM yyyy", { locale: es })}
        </h2>
        <div className="flex gap-1">
          <Button
            onClick={prevMonth}
            variant="outline"
            size="icon"
            className="h-8 w-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <Button
            onClick={nextMonth}
            variant="outline" 
            size="icon"
            className="h-8 w-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    );
  };

  const renderDaysOfWeek = () => {
    return (
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const generateDays = (): Day[] => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });

    const days: Day[] = [];
    let day = startDate;

    while (day <= monthEnd || days.length % 7 !== 0) {
      days.push({
        date: new Date(day),
        isToday: isSameDay(day, today),
        isCurrentMonth: isSameMonth(day, monthStart),
        isSelected: isSameDay(day, selectedDate),
      });
      day = addDays(day, 1);
    }

    return days;
  };

  const renderDays = () => {
    const days = generateDays();

    return (
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => (
          <Button
            key={idx}
            onClick={() => onSelectDate(day.date)}
            variant="ghost"
            size="sm"
            className={`h-10 ${
              !day.isCurrentMonth ? "text-gray-300" : 
              day.isSelected ? "bg-booking-primary text-white hover:bg-booking-primary/90" : 
              day.isToday ? "bg-booking-primary/10 text-booking-primary" : ""
            }`}
            disabled={!day.isCurrentMonth}
          >
            {format(day.date, "d")}
          </Button>
        ))}
      </div>
    );
  };

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      {renderHeader()}
      {renderDaysOfWeek()}
      {renderDays()}
    </div>
  );
};
