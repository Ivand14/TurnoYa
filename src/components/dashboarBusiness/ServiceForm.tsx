import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Employee } from "@/types/dashboard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Service, ServiceSchedule, ServiceBlackoutDate } from "@/types";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Info,
  Percent,
  Plus,
  Clock,
  Calendar,
  X,
  CheckCircle2,
  Settings,
} from "lucide-react";
import { parse } from "date-fns";

interface ServiceFormProps {
  businessId: string;
  employees: Employee[];
  onSubmit: (service: Service) => void;
}

const DAYS_OF_WEEK = [
  { id: 0, name: "Domingo", short: "Dom", color: "bg-red-500" },
  { id: 1, name: "Lunes", short: "Lun", color: "bg-blue-500" },
  { id: 2, name: "Martes", short: "Mar", color: "bg-green-500" },
  { id: 3, name: "Miércoles", short: "Mié", color: "bg-yellow-500" },
  { id: 4, name: "Jueves", short: "Jue", color: "bg-purple-500" },
  { id: 5, name: "Viernes", short: "Vie", color: "bg-pink-500" },
  { id: 6, name: "Sábado", short: "Sáb", color: "bg-indigo-500" },
];

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
    requiresDeposit: false,
    paymentPercentage: 0,
  });

  const [schedule, setSchedule] = useState<ServiceSchedule[]>([]);
  const [blackoutDates, setBlackoutDates] = useState<ServiceBlackoutDate[]>([]);
  const [newBlackoutDate, setNewBlackoutDate] = useState({
    date: "",
    reason: "",
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

  const handleScheduleChange = (
    dayOfWeek: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setSchedule((prev) => {
      const existingSchedule = prev.find((s) => s.dayOfWeek === dayOfWeek);
      if (existingSchedule) {
        return prev.map((s) =>
          s.dayOfWeek === dayOfWeek ? { ...s, [field]: value } : s
        );
      } else {
        return [
          ...prev,
          {
            dayOfWeek,
            startTime: field === "startTime" ? value : "09:00",
            endTime: field === "endTime" ? value : "18:00",
            isActive: true,
          },
        ];
      }
    });
  };

  const toggleDayActive = (dayOfWeek: number, isActive: boolean) => {
    setSchedule((prev) => {
      if (!isActive) {
        return prev.filter((s) => s.dayOfWeek !== dayOfWeek);
      } else {
        const existingSchedule = prev.find((s) => s.dayOfWeek === dayOfWeek);
        if (existingSchedule) {
          return prev.map((s) =>
            s.dayOfWeek === dayOfWeek ? { ...s, isActive: true } : s
          );
        } else {
          return [
            ...prev,
            {
              dayOfWeek,
              startTime: "09:00",
              endTime: "18:00",
              isActive: true,
            },
          ];
        }
      }
    });
  };

  const addBlackoutDate = () => {
    if (!newBlackoutDate.date) {
      toast.error("Selecciona una fecha");
      return;
    }

    const dateExists = blackoutDates.some(
      (d) => d.date === newBlackoutDate.date
    );
    if (dateExists) {
      toast.error("Esta fecha ya está en la lista");
      return;
    }

    setBlackoutDates((prev) => [...prev, { ...newBlackoutDate }]);
    setNewBlackoutDate({ date: "", reason: "" });
    toast.success("Fecha bloqueada agregada");
  };

  const removeBlackoutDate = (date: string) => {
    setBlackoutDates((prev) => prev.filter((d) => d.date !== date));
    toast.success("Fecha desbloqueada");
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

    if (schedule.length === 0) {
      toast.error(
        "Debe configurar al menos un día de atención para este servicio"
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
      requiresDeposit: newService.requiresDeposit,
      paymentPercentage: newService.paymentPercentage,
      schedule: schedule,
      blackoutDates: blackoutDates,
    });

    // Reset form
    setNewService({
      name: "",
      description: "",
      duration: 30,
      price: 0,
      capacity: 0,
      requiresSpecificEmployee: false,
      allowedEmployeeIds: [],
      requiresDeposit: false,
      paymentPercentage: 0,
    });
    setSchedule([]);
    setBlackoutDates([]);

    toast.success("Servicio agregado correctamente");
  };

  const activeEmployees =
    Array.isArray(employees) &&
    employees?.filter((emp) => emp.status === "active");

  const activeDaysCount = schedule.length;
  const getActiveDaysNames = () => {
    return schedule
      .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
      .map((s) => DAYS_OF_WEEK.find((d) => d.id === s.dayOfWeek)?.short)
      .join(", ");
  };

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
          Configura los detalles específicos de tu servicio
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

        {/* Individual Service Schedule Configuration */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                Días de atención personalizados
              </h3>
              <p className="text-sm text-gray-500">
                Configura los días y horarios específicos para este servicio
              </p>
            </div>
            {activeDaysCount > 0 && (
              <div className="text-right">
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    {activeDaysCount} día{activeDaysCount > 1 ? "s" : ""}{" "}
                    configurado{activeDaysCount > 1 ? "s" : ""}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {getActiveDaysNames()}
                </p>
              </div>
            )}
          </div>

          {activeDaysCount === 0 && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-center gap-2 text-amber-800">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Este servicio necesita al menos un día de atención
                </span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {DAYS_OF_WEEK.map((day) => {
              const daySchedule = schedule.find((s) => s.dayOfWeek === day.id);
              const isActive = !!daySchedule;

              return (
                <div
                  key={day.id}
                  className={`rounded-2xl border-2 transition-all duration-300 ${
                    isActive
                      ? "border-blue-200 bg-blue-50 shadow-sm"
                      : "border-gray-100 bg-gray-50 hover:border-gray-200"
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 min-w-[140px]">
                        <Checkbox
                          checked={isActive}
                          onCheckedChange={(checked) =>
                            toggleDayActive(day.id, checked as boolean)
                          }
                          className="border-2 border-gray-300 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-600 data-[state=checked]:border-transparent"
                        />
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 ${day.color} rounded-full`}
                          />
                          <span
                            className={`font-medium transition-colors ${
                              isActive ? "text-blue-900" : "text-gray-700"
                            }`}
                          >
                            {day.name}
                          </span>
                        </div>
                      </div>

                      {isActive && (
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex items-center gap-2">
                            <Label className="text-sm text-blue-700 font-medium">
                              Desde:
                            </Label>
                            <Input
                              type="time"
                              value={daySchedule?.startTime || "09:00"}
                              onChange={(e) =>
                                handleScheduleChange(
                                  day.id,
                                  "startTime",
                                  e.target.value
                                )
                              }
                              className="w-28 border-0 bg-white rounded-lg px-3 py-2 text-sm font-medium text-blue-900 shadow-sm"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-sm text-blue-700 font-medium">
                              Hasta:
                            </Label>
                            <Input
                              type="time"
                              value={daySchedule?.endTime || "18:00"}
                              onChange={(e) =>
                                handleScheduleChange(
                                  day.id,
                                  "endTime",
                                  e.target.value
                                )
                              }
                              className="w-28 border-0 bg-white rounded-lg px-3 py-2 text-sm font-medium text-blue-900 shadow-sm"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {isActive && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <div className="flex items-center gap-2 text-xs text-blue-600">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>
                            Este servicio estará disponible los{" "}
                            {day.name.toLowerCase()}s de{" "}
                            {daySchedule?.startTime} a {daySchedule?.endTime}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {activeDaysCount > 0 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                Resumen de disponibilidad del servicio:
              </h4>
              <div className="space-y-1">
                {schedule
                  .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                  .map((scheduleItem) => {
                    const day = DAYS_OF_WEEK.find(
                      (d) => d.id === scheduleItem.dayOfWeek
                    );
                    return (
                      <div
                        key={scheduleItem.dayOfWeek}
                        className="flex items-center gap-2 text-sm text-blue-800"
                      >
                        <div className={`w-2 h-2 ${day?.color} rounded-full`} />
                        <span className="font-medium">{day?.name}:</span>
                        <span>
                          {scheduleItem.startTime} - {scheduleItem.endTime}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        {/* Blackout Dates - Individual Service */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Fechas no disponibles
              </h3>
              <p className="text-sm text-gray-500">
                Días específicos donde <strong>solo este servicio</strong> no
                estará disponible
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <Input
                type="date"
                value={newBlackoutDate.date}
                onChange={(e) =>
                  setNewBlackoutDate((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
                className="border-0 bg-gray-50 rounded-xl px-4 py-3"
                min={new Date().toISOString().split("T")[0]}
              />
              <Input
                placeholder="Motivo (opcional)"
                value={newBlackoutDate.reason}
                onChange={(e) =>
                  setNewBlackoutDate((prev) => ({
                    ...prev,
                    reason: e.target.value,
                  }))
                }
                className="border-0 bg-gray-50 rounded-xl px-4 py-3 flex-1"
              />
              <Button
                type="button"
                onClick={addBlackoutDate}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 rounded-xl"
              >
                Agregar
              </Button>
            </div>

            {blackoutDates.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-600 mb-3">
                  Fechas donde este servicio específico no estará disponible:
                </p>
                {blackoutDates.map((blackout, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100"
                  >
                    <div>
                      <span className="font-medium text-red-900">
                        {parse(
                          blackout.date,
                          "yyyy-MM-dd",
                          new Date()
                        ).toLocaleDateString("es-ES", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "2-digit",
                        })}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBlackoutDate(blackout.date)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-100"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Deposit Configuration */}
        <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Percent className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Cobrar seña</h3>
              <p className="text-sm text-gray-600">
                Requiere pago adelantado al reservar
              </p>
            </div>
          </div>
          <Switch
            checked={newService.requiresDeposit}
            onCheckedChange={(checked) =>
              setNewService((prev) => ({
                ...prev,
                requiresDeposit: checked,
              }))
            }
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-600"
          />
        </div>

        {/* Pricing & Duration */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="grid grid-cols-2 gap-6">
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
              <Label className="text-sm font-medium text-gray-700 gap-2">
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
                  % Adelanto
                </Label>
                <div className="group relative">
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    Porcentaje a cobrar al reservar
                  </div>
                </div>
              </div>
              <div className="relative">
                <Input
                  name="paymentPercentage"
                  type="number"
                  min="0"
                  max="100"
                  value={newService.paymentPercentage}
                  onChange={handleChange}
                  className={`border-0 rounded-xl px-4 py-3 text-center text-lg font-semibold transition-all duration-200 ${
                    newService.requiresDeposit
                      ? "bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!newService.requiresDeposit}
                />
                <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
          disabled={activeDaysCount === 0}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {activeDaysCount === 0
            ? "Configura al menos un día de atención"
            : "Crear Servicio Personalizado"}
        </Button>
      </form>
    </div>
  );
};

export default ServiceForm;
