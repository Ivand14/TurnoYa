import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Employee } from "@/types/dashboard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Service } from "@/types";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Info, Plus } from "lucide-react";

interface ServiceFormProps {
  businessId: string;
  employees: Employee[];
  onSubmit: (service: Service) => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  businessId,
  employees,
  onSubmit,
}) => {
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    duration: 30,
    price: 0,
    capacity: 0,
    requiresSpecificEmployee: false,
    allowedEmployeeIds: [] as string[],
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
          : value,
    }));
  };

  const handleEmployeeToggle = (employeeId: string, checked: boolean) => {
    setNewService((prev) => ({
      ...prev,
      allowedEmployeeIds: checked
        ? [...prev.allowedEmployeeIds, employeeId]
        : prev.allowedEmployeeIds.filter((id) => id !== employeeId),
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
      id: `service-${Date.now()}`,
      name_service: newService.name,
      description: newService.description,
      duration: newService.duration,
      price: newService.price,
      capacity: newService.capacity > 0 ? newService.capacity : 0,
      requiresSpecificEmployee: newService.requiresSpecificEmployee,
      allowedEmployeeIds: newService.requiresSpecificEmployee
        ? newService.allowedEmployeeIds
        : [],
      active: true,
    });

    setNewService({
      name: "",
      description: "",
      duration: 30,
      price: 0,
      capacity: 0,
      requiresSpecificEmployee: false,
      allowedEmployeeIds: [],
    });

    toast.success("Servicio agregado correctamente");
  };

  const activeEmployees =
    Array.isArray(employees) &&
    employees?.filter((emp) => emp.status === "active");

  return (
    <div className="max-w-2xl mx-auto mb-20">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/25">
          <Plus className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Nuevo Servicio
        </h1>
        <p className="text-gray-500 mt-2">
          Configura los detalles de tu servicio
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Nombre del servicio
              </Label>
              <Input
                name="name"
                placeholder="Ej: Corte de cabello premium"
                value={newService.name}
                onChange={handleChange}
                className="border-0 bg-gray-50 rounded-xl px-4 py-3 text-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Descripción
              </Label>
              <Textarea
                name="description"
                placeholder="Describe qué incluye este servicio..."
                value={newService.description}
                onChange={handleChange}
                rows={3}
                className="border-0 bg-gray-50 rounded-xl px-4 py-3 resize-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Duration */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Duración
              </Label>
              <div className="relative">
                <Input
                  name="duration"
                  type="number"
                  min="1"
                  value={newService.duration}
                  onChange={handleChange}
                  className="border-0 bg-gray-50 rounded-xl px-4 py-3 text-center text-lg font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  min
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Precio
              </Label>
              <div className="relative">
                <Input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newService.price}
                  onChange={handleChange}
                  className="border-0 bg-gray-50 rounded-xl px-4 py-3 text-center text-lg font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  required
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  $
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium text-gray-700">
                  Turnos
                </Label>
                <div className="group relative">
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    0 = Basado en empleados 
                  </div>
                </div>
              </div>
              <Input
                name="capacity"
                type="number"
                min="0"
                value={newService.capacity}
                onChange={handleChange}
                className="border-0 bg-gray-50 rounded-xl px-4 py-3 text-center text-lg font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Employee Assignment */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Asignación de empleados
              </h3>
              <p className="text-sm text-gray-500">
                Configura qué empleados pueden realizar este servicio
              </p>
            </div>
            <Switch
              checked={newService.requiresSpecificEmployee}
              onCheckedChange={(checked) =>
                setNewService((prev) => ({
                  ...prev,
                  requiresSpecificEmployee: checked,
                  allowedEmployeeIds: checked ? prev.allowedEmployeeIds : [],
                }))
              }
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-600"
            />
          </div>

          {newService.requiresSpecificEmployee && (
            <div className="space-y-3">
              {activeEmployees.length > 0 ? (
                <div className="grid gap-3">
                  {activeEmployees.map((employee) => (
                    <label
                      key={employee.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors duration-200 cursor-pointer group"
                    >
                      <Checkbox
                        checked={newService.allowedEmployeeIds.includes(
                          employee.id
                        )}
                        onCheckedChange={(checked) =>
                          handleEmployeeToggle(employee.id, checked as boolean)
                        }
                        className="border-2 border-gray-300 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-600 data-[state=checked]:border-transparent"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                          {employee.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.position}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <p>No hay empleados activos</p>
                  <p className="text-sm">Agrega empleados primero</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
        >
          Crear Servicio
        </Button>
      </form>
    </div>
  );
};

export default ServiceForm;
