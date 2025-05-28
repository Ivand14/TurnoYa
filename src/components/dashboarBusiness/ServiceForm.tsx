import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Employee } from "@/types/dashboard";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Service } from "@/types";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ServiceFormProps {
  businessId: string;
  employees: Employee[];
  onSubmit: (service: Omit<Service, "id">) => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  businessId,
  employees,
  onSubmit
}) => {
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    duration: 30,
    price: 0,
    capacity: 0, // 0 significa usar capacidad basada en empleados
    requiresSpecificEmployee: false,
    allowedEmployeeIds: [] as string[]
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setNewService((prev) => ({
      ...prev,
      [name]:
        name === "duration" || name === "price" || name === "capacity"
          ? parseFloat(value) || 0
          : value
    }));
  };

  const handleEmployeeToggle = (employeeId: string, checked: boolean) => {
    setNewService((prev) => ({
      ...prev,
      allowedEmployeeIds: checked
        ? [...prev.allowedEmployeeIds, employeeId]
        : prev.allowedEmployeeIds.filter((id) => id !== employeeId)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newService.name) {
      toast.error("El nombre del servicio es requerido");
      return;
    }

    if (newService.duration <= 0) {
      toast.error("La duración debe ser mayor a 0");
      return;
    }

    if (newService.price < 0) {
      toast.error("El precio no puede ser negativo");
      return;
    }

    if (
      newService.requiresSpecificEmployee &&
      newService.allowedEmployeeIds.length === 0
    ) {
      toast.error(
        "Debe seleccionar al menos un empleado si requiere empleado específico"
      );
      return;
    }

    onSubmit({
      businessId,
      name_service: newService.name,
      description: newService.description,
      duration: newService.duration,
      price: newService.price,
      capacity: newService.capacity > 0 ? newService.capacity : undefined,
      requiresSpecificEmployee: newService.requiresSpecificEmployee,
      allowedEmployeeIds: newService.requiresSpecificEmployee
        ? newService.allowedEmployeeIds
        : undefined,
      active: true
    });

    // Reset form
    setNewService({
      name: "",
      description: "",
      duration: 30,
      price: 0,
      capacity: 0,
      requiresSpecificEmployee: false,
      allowedEmployeeIds: []
    });

    toast.success("Servicio agregado correctamente");
  };

  const activeEmployees = employees.filter((emp) => emp.status === "active");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agregar Nuevo Servicio</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre del Servicio *</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ej: Corte de cabello"
              value={newService.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe el servicio"
              value={newService.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="duration">Duración (minutos) *</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min="1"
                placeholder="30"
                value={newService.duration}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">Precio *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={newService.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
            <HoverCard>
                <HoverCardTrigger className="flex space-x-3 items-center">
                  <Label htmlFor="capacity">Cantidad de Turnos</Label>
                  <InfoCircledIcon/>
                </HoverCardTrigger>
                <HoverCardContent className="border-black">
                  <p className="text-sm">Si dejas la cantidad de turnos en 0, debes asignar turnos dependiendo la cantidad de empelados</p>
                </HoverCardContent>
              </HoverCard>
                            
              <Input
                id="capacity"
                name="capacity"
                type="number"
                min="0"
                placeholder="0"
                value={newService.capacity}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Configuración de empleados */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center space-x-2">
              <Switch
                id="requiresSpecificEmployee"
                checked={newService.requiresSpecificEmployee}
                onCheckedChange={(checked) =>
                  setNewService((prev) => ({
                    ...prev,
                    requiresSpecificEmployee: checked,
                    allowedEmployeeIds: checked ? prev.allowedEmployeeIds : []
                  }))
                }
              />
              <Label htmlFor="requiresSpecificEmployee">
                Requiere empleados específicos
              </Label>
            </div>

            {newService.requiresSpecificEmployee && (
              <div className="grid gap-2">
                <Label>Empleados que pueden realizar este servicio:</Label>
                <div className="grid grid-cols-2 gap-2">
                  {activeEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`employee-${employee.id}`}
                        checked={newService.allowedEmployeeIds.includes(
                          employee.id
                        )}
                        onCheckedChange={(checked) =>
                          handleEmployeeToggle(employee.id, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`employee-${employee.id}`}
                        className="text-sm"
                      >
                        {employee.name} - {employee.position}
                      </Label>
                    </div>
                  ))}
                </div>
                {activeEmployees.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No hay empleados activos. Agrega empleados primero.
                  </p>
                )}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full">
            Agregar Servicio
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ServiceForm;
