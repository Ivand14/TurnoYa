import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Edite from "../ui/editable";
import { Employee } from "@/types/dashboard";
import { Label } from "@/components/ui/label";
import React from "react";
import { Service } from "@/types";
import { Switch } from "@/components/ui/switch";
import { TrashButton } from "../ui/trash";

interface ServiceListProps {
  services: Service[];
  employees: Employee[];
  onDelete: (serviceId: string) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({
  services,
  employees,
  onDelete
}) => {
  const getEmployeeNames = (employeeIds?: string[]): string => {
    if (!employeeIds || employeeIds.length === 0) return "Todos los empleados";

    const names = employeeIds
      .map((id) => employees.find((emp) => emp.id === id)?.name)
      .filter(Boolean);

    return names.length > 0 ? names.join(", ") : "Empleados no encontrados";
  };

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


  return (
    <Card>
      <CardHeader>
        <CardTitle>Servicios Registrados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between p-4 border rounded-md bg-card hover:bg-accent/50"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
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

                  {service.capacity && service.capacity > 0 ? (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Users className="h-3 w-3" />
                      Capacidad fija: {service.capacity}
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <UserCheck className="h-3 w-3" />
                      Basado en empleados
                    </Badge>
                  )}

                  {service.requiresSpecificEmployee && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <UserCheck className="h-3 w-3" />
                      Empleados específicos
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">
                  {service.description || "Sin descripción"}
                </p>

                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>Duración: {service.duration} min</span>
                  <span>Precio: ${service.price.toFixed(2)}</span>
                </div>

                {service.requiresSpecificEmployee && (
                  <div className="text-xs text-muted-foreground">
                    <strong>Empleados autorizados:</strong>{" "}
                    {getEmployeeNames(service.allowedEmployeeIds)}
                  </div>
                )}
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
                <div className="flex items-center space-x-2">
                  <Edite
                    service={service}
                    employeesAvailable = {employees}
                  />
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
