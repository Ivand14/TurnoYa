import React from "react";
import { UserCheck, Users, Clock, DollarSign, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Edite from "../ui/editable";
import { Employee } from "@/types/dashboard";
import { Service } from "@/types";
import { TrashButton } from "../ui/trash";

interface ServiceListProps {
  services: Service[];
  employees: Employee[];
  onDelete: (serviceId: string) => void;
  onEdit: (data: Service, serviceId: string) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({
  services,
  employees,
  onDelete,
  onEdit
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/25">
            <Tag className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Servicios
          </h1>
          <p className="text-gray-500 mt-2">Gestiona los servicios de tu negocio</p>
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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/25">
          <Tag className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Servicios Registrados
        </h1>
        <p className="text-gray-500 mt-2">
          {services.length} servicio{services.length !== 1 ? 's' : ''} disponible{services.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Services Grid */}
      <div className="space-y-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="group bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              {/* Service Info */}
              <div className="flex-1 space-y-6">
                {/* Header */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
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
                  </div>

                  {service.description && (
                    <p className="text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  )}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Duración</div>
                      <div className="font-semibold text-gray-900">{service.duration} min</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Precio</div>
                      <div className="font-semibold text-gray-900">${service.price.toFixed(2)}</div>
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
                        {service.capacity > 0 ? `${service.capacity} personas` : "Por empleados"}
                      </div>
                    </div>
                  </div>
                </div>

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

              {/* Actions */}
              <div className="flex items-center gap-3 ml-6">
                <div className="opacity-60 hover:opacity-100 transition-opacity">
                  <Edite
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;