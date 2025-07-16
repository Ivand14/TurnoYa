import { Button } from "@/components/ui/button";
import { Employee } from "@/types/dashboard";
import React from "react";
import { UserCheck, Mail, Phone, Briefcase, Trash2 } from "lucide-react";

interface EmployeeListProps {
  employees: Employee[];
  onDeleteEmployee: (employeeId: string) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  onDeleteEmployee,
}) => {
  if (employees.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/25">
            <UserCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Empleados
          </h1>
          <p className="text-gray-500 mt-2">Gestiona tu equipo de trabajo</p>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserCheck className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay empleados registrados
          </h3>
          <p className="text-gray-500">
            Agrega tu primer empleado para comenzar a gestionar tu equipo
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="max-w-4xl mx-auto mt-20">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/25">
          <UserCheck className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Empleados Registrados
        </h1>
        <p className="text-gray-500 mt-2">
          {employees?.length} empleado{employees.length !== 1 ? "s" : ""} en tu
          equipo
        </p>
      </div>

      {/* Employees Grid */}
      <div className="space-y-6">
        {Array.isArray(employees) &&
          employees?.map((employee, index) => (
            <div
              key={employee.id || index}
              className="group bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                {/* Employee Info */}
                <div className="flex-1 space-y-6">
                  {/* Header */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-2xl font-semibold text-gray-900">
                        {employee.name}
                      </h3>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          employee.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {employee.status === "active" ? "Activo" : "Inactivo"}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="font-semibold text-gray-900">
                          {employee.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                        <Phone className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Teléfono</div>
                        <div className="font-semibold text-gray-900">
                          {employee.phone || "—"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Cargo</div>
                        <div className="font-semibold text-gray-900">
                          {employee.position}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 ml-6">
                  <div className="opacity-60 hover:opacity-100 transition-opacity">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteEmployee(employee.id)}
                      className="h-10 px-4 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default EmployeeList;
