import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React from "react";
import { Service } from "@/types";
import { TrashButton } from "@/components/ui/trash";

interface ServiceListProps {
  services: Service[];
  onDelete: (serviceId: string) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({
  services,
  onDelete
}) => {
  if (services.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Servicios</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            No hay servicios registrados. Agrega uno nuevo para comenzar.
          </p>
        </CardContent>
      </Card>
    );
  }

  console.log("services",services)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Servicios Registrados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          { Array.isArray(services) && services.length > 0 && services.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between p-3 border rounded-md bg-card hover:bg-accent/50"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{service.name_service}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      service.active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {service.active ? "Activo" : "Inactivo"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {service.description || "Sin descripción"}
                </p>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>Duración: {service.duration} min</span>
                  <span>Precio: ${Math.round(service.price)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center space-x-2">
                  <TrashButton
                    id={`service-status-${service.id}`}
                    onClick={() => onDelete(service.id)}
                  />
                  <Label
                    htmlFor={`service-status-${service.id}`}
                    className="sr-only"
                  >
                    {service.active ? "Desactivar" : "Activar"}
                  </Label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceList;
