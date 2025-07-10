import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { UserPlus } from "lucide-react";
import { Employee } from "@/types/dashboard";

interface EmployeeFormProps {
  newEmployee: {
    name: string;
    email: string;
    phone: string;
    position: string;
  };
  onChange: (field: string, value: string) => void;
  onSubmit: (newEmployee) => void;
  businessId: string;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  newEmployee,
  onChange,
  onSubmit,
  businessId,
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/25">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Agregar Nuevo Empleado
              </h2>
              <p className="text-gray-500 text-sm">
                Completa la información del empleado
              </p>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Nombre
                <span className="text-red-500">*</span>
              </label>
              <Input
                value={newEmployee.name}
                onChange={(e) => onChange("name", e.target.value)}
                placeholder="Nombre completo"
                className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Email
                <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={newEmployee.email}
                onChange={(e) => onChange("email", e.target.value)}
                placeholder="correo@ejemplo.com"
                className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <Input
                value={newEmployee.phone}
                onChange={(e) => onChange("phone", e.target.value)}
                placeholder="6XX-XXX-XXX"
                className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Cargo
                <span className="text-red-500">*</span>
              </label>
              <Input
                value={newEmployee.position}
                onChange={(e) => onChange("position", e.target.value)}
                placeholder="Cargo o posición"
                className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <Button
            onClick={() => onSubmit({ ...newEmployee, businessId })}
            className="h-12 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/30 transition-all duration-200 transform hover:scale-105"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Agregar Empleado
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;
