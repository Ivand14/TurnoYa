import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  businessId:string
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  newEmployee,
  onChange,
  onSubmit,
  businessId
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserPlus className="mr-2 h-5 w-5" />
          Agregar Nuevo Empleado
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre*</label>
            <Input
              value={newEmployee.name}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="Nombre completo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email*</label>
            <Input
              type="email"
              value={newEmployee.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <Input
              value={newEmployee.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="6XX-XXX-XXX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cargo*</label>
            <Input
              value={newEmployee.position}
              onChange={(e) => onChange("position", e.target.value)}
              placeholder="Cargo o posición"
            />
          </div>
        </div>
        <Button onClick={() => onSubmit({ ...newEmployee, businessId })}>Agregar Empleado</Button>
      </CardContent>
    </Card>
  );
};

export default EmployeeForm;
