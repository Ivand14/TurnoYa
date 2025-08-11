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
  Tag,
} from "lucide-react";
import { parse } from "date-fns";
import { PREDEFINED_CATEGORIES } from "@/types/servicesTypes";

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
    category: "",
  });

  const [schedule, setSchedule] = useState<ServiceSchedule[]>([]);
  const [blackoutDates, setBlackoutDates] = useState<ServiceBlackoutDate[]>([]);
  const [newBlackoutDate, setNewBlackoutDate] = useState({
    date: "",
    reason: "",
  });
  const [customCategory, setCustomCategory] = useState<string>("");
  const [showCustomCategory, setShowCustomCategory] = useState<boolean>(false);

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

  const handleCategorySelect = (categoryId: string) => {
    const category = PREDEFINED_CATEGORIES.find((cat) => cat.id === categoryId);
    setNewService((prev) => ({
      ...prev,
      category: category?.name || categoryId,
    }));
    setShowCustomCategory(false);
    setCustomCategory("");
  };

  const handleCustomCategorySubmit = () => {
    if (!customCategory.trim()) {
      toast.error("Ingresa un nombre para la categoría");
      return;
    }

    setNewService((prev) => ({
      ...prev,
      category: customCategory.trim(),
    }));
    setShowCustomCategory(false);
    setCustomCategory("");
    toast.success("Categoría personalizada creada");
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

    if (!newService.category) {
      toast.error("Selecciona una categoría para el servicio");
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
      category: newService?.category || "",
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
      category: "",
    });
    setSchedule([]);
    setBlackoutDates([]);
    setCustomCategory("");
    setShowCustomCategory(false);

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

  const selectedCategory = PREDEFINED_CATEGORIES.find(
    (cat) => cat.name === newService.category
  );

  return (
    <div className="max-w-2xl mx-auto mb-20">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Category Selection */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Categoría del servicio
              </h3>
              <p className="text-sm text-gray-500">
                Organiza tus servicios por categorías
              </p>
            </div>
          </div>

          {newService.category && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-3">
                {selectedCategory ? (
                  <>
                    <div
                      className={`w-8 h-8 ${selectedCategory.color} rounded-lg flex items-center justify-center`}
                    >
                      <selectedCategory.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="font-medium text-green-800">
                        Categoría: {newService.category}
                      </span>
                      <p className="text-xs text-green-600 mt-1">
                        {selectedCategory.description}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                      <Tag className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="font-medium text-green-800">
                        Categoría personalizada: {newService.category}
                      </span>
                      <p className="text-xs text-green-600 mt-1">
                        Categoría creada por ti
                      </p>
                    </div>
                  </>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setNewService((prev) => ({ ...prev, category: "" }))
                  }
                  className="ml-auto text-green-600 hover:text-green-700 hover:bg-green-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {!newService.category && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {PREDEFINED_CATEGORIES.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleCategorySelect(category.id)}
                      className="group p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all duration-200 text-left"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                        >
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 group-hover:text-purple-700 transition-colors">
                            {category.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 pt-4">
                {!showCustomCategory ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCustomCategory(true)}
                    className="w-full border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50 text-gray-600 hover:text-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Crear categoría personalizada
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <Input
                        placeholder="Nombre de la categoría personalizada"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className="border-0 bg-gray-50 rounded-xl px-4 py-3 flex-1"
                      />
                      <Button
                        type="button"
                        onClick={handleCustomCategorySubmit}
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 rounded-xl"
                      >
                        Crear
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowCustomCategory(false);
                          setCustomCategory("");
                        }}
                        className="px-6 rounded-xl"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

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
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300  ">
          <div className="flex items-center gap-3 mb-6 md:flex-row flex-col md:items-center ">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 md:text-left text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Días de atención personalizados
              </h3>
              <p className="text-sm text-gray-500">
                Configura los días y horarios específicos para este servicio
              </p>
            </div>
            {activeDaysCount > 0 && (
              <div className="text-right sm:text-left md:text-center md:w-full sm:w-full">
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
                        <div className="flex flex-col md:flex-row gap-4 w-full">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                            <Label className="text-sm text-blue-700 font-medium min-w-[60px]">
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
                              className="w-full max-w-[140px] border border-blue-200 bg-white rounded-lg px-3 py-2 text-sm font-medium text-blue-900 shadow-sm"
                            />
                          </div>

                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                            <Label className="text-sm text-blue-700 font-medium min-w-[60px]">
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
                              className="w-full max-w-[140px] border border-blue-200 bg-white rounded-lg px-3 py-2 text-sm font-medium text-blue-900 shadow-sm"
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
          <div className="flex items-center gap-3 mb-6 md:flex-row flex-col text-center md:text-left">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="w-full">
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
            <div className="flex gap-3 sm:flex-row flex-col">
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
                    Cantidad de turnos que se pueden reservar al mismo tiempo
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

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={activeDaysCount === 0 || !newService.category}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {!newService.category
            ? "Selecciona una categoría primero"
            : activeDaysCount === 0
            ? "Configura al menos un día de atención"
            : "Crear Servicio Personalizado"}
        </Button>
      </form>
    </div>
  );
};

export default ServiceForm;
