  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

  import { Button } from "@/components/ui/button";
  import { Service } from "@/types";
  import { Clock, DollarSign, Users, Star } from "lucide-react";
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

    const handleReserve = (serviceId: string) => {
      onReserve?.(serviceId);
      if (window.innerWidth <= 768) {
        goToCalendar(calendarRef);
      }
    };

    console.log(service);

    // Renderizar servicio individual
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-indigo-200">
        <CardHeader className="p-5 pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                {service.name_service}
              </CardTitle>

              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1.5 text-indigo-500" />
                  <span>{service.duration} min</span>
                </div>

                {service.capacity && service.capacity > 1 && (
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1.5 text-green-500" />
                    <span>Hasta {service.capacity} personas</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end ml-4">
              <div className="flex items-center text-2xl font-bold text-indigo-600 mb-1">
                <DollarSign className="w-5 h-5" />
                <span>{service.price}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-0">
          {service.description && (
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {service.description}
            </p>
          )}

          <Button
            onClick={() => handleReserve(service.id)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200"
          >
            Reservar Cita
          </Button>
        </CardContent>
      </Card>
    );
  };
