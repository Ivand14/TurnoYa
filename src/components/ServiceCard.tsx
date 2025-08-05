import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Service } from "@/types";
import { useRef } from "react";

interface ServiceCardProps {
  service: Service;
  onReserve?: (serviceId: string) => void;
  goToCalendar: (ref: React.RefObject<HTMLDivElement>) => void;
}

export const ServiceCard = ({
  service,
  onReserve,
  goToCalendar,
}: ServiceCardProps) => {
  const calendarRef = useRef<HTMLDivElement>(null);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-2 flex flex-row justify-between items-center">
        <div>
          <CardTitle className="text-lg">{service.name_service}</CardTitle>
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {service.duration} minutos
          </div>
        </div>
        <div className="text-xl font-bold text-booking-primary">
          ${service.price}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-gray-600 mb-3">{service.description}</p>
        <Button
          onClick={() => {
            onReserve?.(service.id);
            if (window.innerWidth <= 768) {
              goToCalendar(calendarRef); // solo se ejecuta en mobile o tablets
            }
          }}
          className="w-full"
        >
          Reservar
        </Button>
      </CardContent>
    </Card>
  );
};
