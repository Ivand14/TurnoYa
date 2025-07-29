import React from "react";
import {
  UserCheck,
  Users,
  Clock,
  DollarSign,
  Tag,
  Percent,
  CreditCard,
  Calendar,
  CheckCircle2,
  Settings,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Edite from "@/components/ui/editable";
import { Employee } from "@/types/dashboard";
import { Service } from "@/types";
import { TrashButton } from "@/components/ui/trash";
import EditService from "@/components/ui/editable";
import { parse } from "date-fns";

interface ServiceListProps {
  services: Service[];
  employees: Employee[];
  onDelete: (serviceId: string) => void;
  onEdit: (data: Service, serviceId: string) => void;
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

const ServiceList: React.FC<ServiceListProps> = ({
  services,
  employees,
  onDelete,
  onEdit,
}) => {
  const getEmployeeNames = (employeeIds?: string[]): string => {
    if (!employeeIds || employeeIds.length === 0) return "Todos los empleados";

    const names = employeeIds
      .map((id) => employees.find((emp) => emp.id === id)?.name)
      .filter(Boolean);

    return names.length > 0 ? names.join(", ") : "Empleados no encontrados";
  };

  const calculateAdvanceAmount = (service: Service) => {
    if (!service.requiresDeposit) return 0;
    return (service.price * service.paymentPercentage) / 100;
  };

  const calculateRemainingAmount = (service: Service) => {
    return service.price - calculateAdvanceAmount(service);
  };

  const formatSchedule = (schedule: any[]) => {
    if (!schedule || schedule.length === 0) return "Sin horarios configurados";

    return schedule
      .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
      .map((s) => {
        const day = DAYS_OF_WEEK.find((d) => d.id === s.dayOfWeek);
        return `${day?.short}: ${s.startTime}-${s.endTime}`;
      })
      .join(" • ");
  };

  const formatBlackoutDates = (blackoutDates: any[]) => {
    if (!blackoutDates || blackoutDates.length === 0) return null;

    return blackoutDates.length;
  };

  if (services.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/25">
            <Tag className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Servicios
          </h1>
          <p className="text-gray-500 mt-2">
            Gestiona los servicios de tu negocio
          </p>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Tag className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay servicios registrados
          </h3>
          <p className="text-gray-500">
            Agrega tu primer servicio para comenzar a recibir reservas
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mb-20">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/25">
          <Tag className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Servicios Registrados
        </h1>
        <p className="text-gray-500 mt-2">
          {services.length} servicio{services.length !== 1 ? "s" : ""}{" "}
          disponible{services.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Services Grid */}
      <div className="space-y-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="group bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-6">
              {/* Service Header */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {service.name_service}
                  </h3>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      service.active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {service.active ? "Activo" : "Inactivo"}
                  </div>
                  {service.requiresDeposit && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 border-green-200"
                    >
                      <Percent className="w-3 h-3 mr-1" />
                      {service.paymentPercentage}% seña
                    </Badge>
                  )}
                </div>

                {service.description && (
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {service.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 ml-6">
                <div className="opacity-60 hover:opacity-100 transition-opacity">
                  <EditService
                    service={service}
                    employeesAvailable={employees}
                    onEdit={onEdit}
                  />
                </div>
                <div className="opacity-60 hover:opacity-100 transition-opacity">
                  <TrashButton
                    id={`service-delete-${service.id}`}
                    onClick={() => onDelete(service.id)}
                  />
                </div>
              </div>
            </div>

            {/* Basic Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Duración</div>
                  <div className="font-semibold text-gray-900">
                    {service.duration} min
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Precio</div>
                  <div className="font-semibold text-gray-900">
                    ${service.price.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                  {service.capacity > 0 ? (
                    <Users className="w-5 h-5 text-purple-600" />
                  ) : (
                    <UserCheck className="w-5 h-5 text-purple-600" />
                  )}
                </div>
                <div>
                  <div className="text-sm text-gray-500">Capacidad</div>
                  <div className="font-semibold text-gray-900">
                    {service.capacity > 0
                      ? `${service.capacity} turnos`
                      : "Basado en empleados"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    service.requiresDeposit ? "bg-green-50" : "bg-gray-50"
                  }`}
                >
                  <CreditCard
                    className={`w-5 h-5 ${
                      service.requiresDeposit
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Pago</div>
                  <div className="font-semibold text-gray-900">
                    {service.requiresDeposit ? "Con seña" : "Al finalizar"}
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Section */}
            {service.schedule && service.schedule.length > 0 && (
              <div className="bg-blue-50 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Settings className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 text-sm">
                      Horarios de atención
                    </h4>
                    <p className="text-xs text-blue-600">
                      {service.schedule.length} día
                      {service.schedule.length > 1 ? "s" : ""} configurado
                      {service.schedule.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {service.schedule
                    .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                    .map((scheduleItem) => {
                      const day = DAYS_OF_WEEK.find(
                        (d) => d.id === scheduleItem.dayOfWeek
                      );
                      return (
                        <div
                          key={scheduleItem.dayOfWeek}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div
                            className={`w-2 h-2 ${day?.color} rounded-full`}
                          />
                          <span className="font-medium text-blue-800 min-w-[80px]">
                            {day?.name}:
                          </span>
                          <span className="text-blue-700">
                            {scheduleItem.startTime} - {scheduleItem.endTime}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Blackout Dates */}
            {service.blackoutDates && service.blackoutDates.length > 0 && (
              <div className="bg-red-50 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-900 text-sm">
                      Fechas no disponibles
                    </h4>
                    <p className="text-xs text-red-600">
                      {service.blackoutDates.length} fecha
                      {service.blackoutDates.length > 1 ? "s" : ""} bloqueada
                      {service.blackoutDates.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {service.blackoutDates.slice(0, 3).map((blackout, index) => (
                    <div key={index} className="text-sm text-red-800">
                      <span className="font-medium">
                        {parse(
                          blackout.date,
                          "yyyy-MM-dd",
                          new Date()
                        ).toLocaleDateString("es-ES", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      {blackout.reason && (
                        <span className="text-red-600 ml-2">
                          - {blackout.reason}
                        </span>
                      )}
                    </div>
                  ))}
                  {service.blackoutDates.length > 3 && (
                    <div className="text-xs text-red-600">
                      +{service.blackoutDates.length - 3} más...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Payment Information */}
            {service.requiresDeposit && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 mb-6 border border-green-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">
                      Modalidad de pago
                    </h4>
                    <p className="text-xs text-gray-600">
                      Requiere adelanto para reservar
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="flex items-center gap-1 text-green-700 mb-1">
                      <DollarSign className="w-3 h-3" />
                      <span className="font-medium">Al reservar</span>
                    </div>
                    <div className="text-lg font-bold text-green-800">
                      ${calculateAdvanceAmount(service).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {service.paymentPercentage}% del total
                    </div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="flex items-center gap-1 text-gray-700 mb-1">
                      <DollarSign className="w-3 h-3" />
                      <span className="font-medium">Al finalizar</span>
                    </div>
                    <div className="text-lg font-bold text-gray-800">
                      ${calculateRemainingAmount(service).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">Saldo restante</div>
                  </div>
                </div>
              </div>
            )}

            {/* Employee Assignment */}
            {service.requiresSpecificEmployee && (
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <UserCheck className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Empleados autorizados
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {getEmployeeNames(service.allowedEmployeeIds)}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;
