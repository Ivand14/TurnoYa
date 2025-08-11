import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Employee } from "@/types/dashboard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Service, ServiceSchedule, ServiceBlackoutDate } from "@/types";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Calendar, X, Settings, Save, Tag } from "lucide-react";
import { parse } from "date-fns";
import { PREDEFINED_CATEGORIES } from "@/types/servicesTypes";

interface EditableFormProps {
  service: Service;
  employeesAvailable: Employee[];
  onUpdateService: (service: Service) => void;
  loading: boolean;
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

const EditableForm: React.FC<EditableFormProps> = ({
  service,
  employeesAvailable,
  onUpdateService,
  loading,
}) => {
  const [editedService, setEditedService] = useState<Service>(service);
  const [schedule, setSchedule] = useState<ServiceSchedule[]>(
    service.schedule || []
  );
  const [blackoutDates, setBlackoutDates] = useState<ServiceBlackoutDate[]>(
    service.blackoutDates || []
  );
  const [newBlackoutDate, setNewBlackoutDate] = useState({
    date: "",
    reason: "",
  });
  const [newCategory, setNewCategory] = useState<string>("");
  const [customCategory, setCustomCategory] = useState<string>("");
  const [showCustomCategory, setShowCustomCategory] = useState<boolean>(false);

  useEffect(() => {
    setEditedService(service);
    setSchedule(service.schedule || []);
    setBlackoutDates(service.blackoutDates || []);
  }, [service]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setEditedService((prev) => ({
      ...prev,
      [name]:
        name === "duration" ||
        name === "price" ||
        name === "capacity" ||
        name === "paymentPercentage"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleEmployeeToggle = (employeeId: string, checked: boolean) => {
    setEditedService((prev) => ({
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

  const handleCategorySelect = (categoryId: string) => {
    const category = PREDEFINED_CATEGORIES.find((cat) => cat.id === categoryId);
    setNewCategory(category?.name);
    setShowCustomCategory(false);
    setCustomCategory("");
  };

  const selectedCategory = PREDEFINED_CATEGORIES.find(
    (cat) => cat.name === newCategory
  );

  const handleCustomCategorySubmit = () => {
    if (!customCategory.trim()) {
      toast.error("Ingresa un nombre para la categoría");
      return;
    }

    setNewCategory(customCategory.trim());
    setShowCustomCategory(false);
    setCustomCategory("");
    toast.success("Categoría personalizada creada");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editedService.name_service) {
      toast.error("El nombre del servicio es requerido");
      return;
    }

    if (editedService.duration <= 0) {
      toast.error("La duración debe ser mayor a 0");
      return;
    }

    if (editedService.price < 0) {
      toast.error("El precio no puede ser negativo");
      return;
    }

    if (
      editedService.requiresSpecificEmployee &&
      editedService.allowedEmployeeIds.length === 0
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

    const updatedService: Service = {
      ...editedService,
      schedule: schedule,
      blackoutDates: blackoutDates,
      category: newCategory,
    };

    onUpdateService(updatedService);
  };

  console.log(newCategory);

  const activeEmployees =
    employeesAvailable?.filter((emp) => emp.status === "active") || [];
  const activeDaysCount = schedule.length;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <form
        onSubmit={handleSubmit}
        className="md:flex-wrap md:flex-col md:gap-6"
      >
        {/* Basic Info */}
        <div className="space-y-4">
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
                  Cambia o asinga una nueva categoria
                </p>
              </div>
            </div>

            {newCategory && (
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
                          Categoría: {newCategory}
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
                          Categoría personalizada: {newCategory}
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
                    onClick={() => setNewCategory("")}
                    className="ml-auto text-green-600 hover:text-green-700 hover:bg-green-100"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {!newCategory && (
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
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="space-y-2 mt-10">
              <Label className="text-sm font-medium text-gray-700">
                Nombre del servicio
              </Label>
              <Input
                name="name_service"
                placeholder="Ej: Corte de cabello premium"
                value={editedService.name_service}
                onChange={handleChange}
                className="border-2 border-gray-200 bg-gray-50 rounded-2xl px-6 py-4 resize-none focus:border-blue-400 focus:ring-blue-200 focus:bg-white transition-all duration-300 text-base"
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
                value={editedService.description || ""}
                onChange={handleChange}
                rows={3}
                className="border-2 border-gray-200 bg-gray-50 rounded-2xl px-6 py-4 resize-none focus:border-blue-400 focus:ring-blue-200 focus:bg-white transition-all duration-300 text-base"
              />
            </div>
          </div>
        </div>

        {/* Schedule Configuration */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 mt-10">
          <div className="flex items-center gap-3 mb-4 md:flex-row flex-col text-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <div className="w-full">
              <h3 className="font-semibold text-gray-900">
                Horarios de atención
              </h3>
              <p className="text-sm text-gray-500">
                Configura los días y horarios para este servicio
              </p>
            </div>
          </div>

          <div className="space-y-3 ">
            {DAYS_OF_WEEK.map((day) => {
              const daySchedule = schedule.find((s) => s.dayOfWeek === day.id);
              const isActive = !!daySchedule;

              return (
                <div
                  key={day.id}
                  className={`rounded-xl border-2 transition-all duration-300 ${
                    isActive
                      ? "border-blue-200 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="p-3">
                    <div className="flex items-center gap-3 ">
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <Checkbox
                          checked={isActive}
                          onCheckedChange={(checked) =>
                            toggleDayActive(day.id, checked as boolean)
                          }
                          className="border-2"
                        />
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 ${day.color} rounded-full`}
                          />
                          <span className="font-medium text-sm">
                            {day.name}
                          </span>
                        </div>
                      </div>

                      {isActive && (
                        <div className="flex items-center gap-3 flex-1 sm:flex-row flex-col">
                          <div className="flex items-center gap-1 md:flex-row flex-col">
                            <Label className="text-xs text-blue-700">
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
                              className="w-24 border-0 bg-white rounded-lg px-2 py-1 text-xs"
                            />
                          </div>
                          <div className="flex items-center gap-1 md:flex-row flex-col">
                            <Label className="text-xs text-blue-700">
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
                              className="w-24 border-0 bg-white rounded-lg px-2 py-1 text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pricing & Duration */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 mt-10">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Duración (min)
              </Label>
              <Input
                name="duration"
                type="number"
                min="1"
                value={editedService.duration}
                onChange={handleChange}
                className="border-0 bg-gray-200 rounded-xl px-4 py-3"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Precio ($)
              </Label>
              <Input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={editedService.price}
                onChange={handleChange}
                className="border-0 bg-gray-200 rounded-xl px-4 py-3"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                % Adelanto
              </Label>
              <Input
                name="paymentPercentage"
                type="number"
                min="0"
                max="100"
                value={editedService.paymentPercentage}
                onChange={handleChange}
                className="border-0 bg-gray-200 rounded-xl px-4 py-3"
                disabled={!editedService.requiresDeposit}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Capacidad
              </Label>
              <Input
                name="capacity"
                type="number"
                min="0"
                value={editedService.capacity}
                onChange={handleChange}
                className="border-0 bg-gray-200 rounded-xl px-4 py-3"
              />
            </div>
          </div>
        </div>

        {/* Switches */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl mt-10 shadow-xl hover:shadow-2xl">
            <div>
              <h3 className="font-medium text-gray-900">Cobrar seña</h3>
              <p className="text-sm text-gray-600">
                Requiere pago adelantado al reservar
              </p>
            </div>
            <Switch
              checked={editedService.requiresDeposit}
              onCheckedChange={(checked) =>
                setEditedService((prev) => ({
                  ...prev,
                  requiresDeposit: checked,
                }))
              }
            />
          </div>
        </div>

        {/* Blackout Dates */}
        <div className="bg-white shadow-xl hover:shadow-2xl mt-10 mb-10 rounded-2xl p-6">
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
            <div className="flex gap-3 md:flex-row flex-col">
              <Input
                type="date"
                value={newBlackoutDate.date}
                onChange={(e) =>
                  setNewBlackoutDate((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
                className="border-0 bg-gray-200 rounded-xl px-4 py-3"
                min={new Date().toISOString().split("T")[0]}
              />
              {/* <Input
              placeholder="Motivo (opcional)"
              value={newBlackoutDate.reason}
              onChange={(e) =>
                setNewBlackoutDate((prev) => ({
                  ...prev,
                  reason: e.target.value,
                }))
              }
              className="border-0 bg-white rounded-xl px-4 py-3 flex-1"
            /> */}
              <Button
                type="button"
                onClick={addBlackoutDate}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 rounded-xl"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {blackoutDates.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-600 mb-3">
                  Fechas bloqueadas para este servicio:
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
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      {blackout.reason && (
                        <p className="text-sm text-red-600">
                          {blackout.reason}
                        </p>
                      )}
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

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={activeDaysCount === 0 || loading}
          className="mt-10 w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl font-semibold"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </form>
    </div>
  );
};

export default EditableForm;
