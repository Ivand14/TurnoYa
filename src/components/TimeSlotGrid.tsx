
import { format, parse, addMinutes } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { TimeSlot } from "@/types";

interface TimeSlotGridProps {
  date: Date;
  workHours: {
    start: string;
    end: string;
  };
  slotDuration: number;
  breakBetweenSlots: number;
  bookedSlots?: TimeSlot[];
  onSelectSlot: (start: Date, end: Date) => void;
}

export const TimeSlotGrid = ({ 
  date,
  workHours,
  slotDuration,
  breakBetweenSlots,
  bookedSlots = [],
  onSelectSlot
}: TimeSlotGridProps) => {
  const dateString = format(date, "yyyy-MM-dd");
  const startTime = parse(`${dateString} ${workHours.start}`, "yyyy-MM-dd HH:mm", new Date());
  const endTime = parse(`${dateString} ${workHours.end}`, "yyyy-MM-dd HH:mm", new Date());

  const generateTimeSlots = () => {
    const slots = [];
    let currentTime = startTime;
    
    while (currentTime < endTime) {
      const slotEndTime = addMinutes(currentTime, slotDuration);
      
      // Check if slot is available (not booked)
      const isBooked = bookedSlots.some(slot => {
        const slotStart = new Date(slot.start);
        const slotEnd = new Date(slot.end);
        return (
          (currentTime >= slotStart && currentTime < slotEnd) || 
          (slotEndTime > slotStart && slotEndTime <= slotEnd) ||
          (currentTime <= slotStart && slotEndTime >= slotEnd)
        );
      });

      slots.push({
        start: new Date(currentTime),
        end: new Date(slotEndTime),
        isBooked
      });
      
      // Add break between slots
      currentTime = addMinutes(slotEndTime, breakBetweenSlots);
    }
    
    return slots;
  };

  const slots = generateTimeSlots();

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 p-4">
      <h2 className="col-span-full text-lg font-semibold mb-2">
        {format(date, "EEEE, d 'de' MMMM", { locale: es })}
      </h2>
      {slots.map((slot, index) => (
        <Button
          key={index}
          onClick={() => !slot.isBooked && onSelectSlot(slot.start, slot.end)}
          variant={slot.isBooked ? "outline" : "default"}
          className={`text-sm ${
            slot.isBooked 
              ? "bg-gray-100 text-gray-500 hover:bg-gray-100 cursor-not-allowed" 
              : ""
          }`}
          disabled={slot.isBooked}
        >
          {format(slot.start, "HH:mm")}
        </Button>
      ))}
    </div>
  );
};
