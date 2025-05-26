import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Employee } from "@/types/dashboard";
import { Input } from "@/components/ui/input";
import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface ScheduleFormProps {
  newSchedule: {
    employeeId?: string;
    day: string;
    startTime: string;
    endTime: string;
    isBusinessHours?: boolean;
  };
  activeEmployees: Employee[];
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({
  newSchedule,
  activeEmployees,
  onChange,
  onSubmit
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {newSchedule.isBusinessHours ? (
            <>
              <Clock className="mr-2 h-5 w-5" />
              Editar Horarios de Atención
            </>
          ) : (
            <>
              <CalendarIcon className="mr-2 h-5 w-5" />
              Crear Nuevo Horario
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {!newSchedule.isBusinessHours && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Empleado*
              </label>
              <select
                className="w-full h-10 px-3 rounded-md border"
                value={newSchedule.employeeId}
                onChange={(e) => onChange("employeeId", e.target.value)}
              >
                <option value="">Seleccione un empleado</option>
                {activeEmployees.length > 0 && activeEmployees?.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Día*</label>
            <select
              className="w-full h-10 px-3 rounded-md border"
              value={newSchedule.day}
              onChange={(e) => onChange("day", e.target.value)}
            >
              {[
                "Lunes",
                "Martes",
                "Miércoles",
                "Jueves",
                "Viernes",
                "Sábado",
                "Domingo"
              ].map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Hora de inicio*
            </label>
            <Input
              type="time"
              value={newSchedule.startTime}
              onChange={(e) => onChange("startTime", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Hora de fin*
            </label>
            <Input
              type="time"
              value={newSchedule.endTime}
              onChange={(e) => onChange("endTime", e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={onSubmit}>
            {newSchedule.isBusinessHours
              ? "Actualizar Horario"
              : "Crear Horario"}
          </Button>
          {!newSchedule.isBusinessHours && (
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onChange(
                  "isBusinessHours",
                  newSchedule.isBusinessHours ? "" : "true"
                )
              }
            >
              {newSchedule.isBusinessHours
                ? "Crear Horario de Empleado"
                : "Configurar Horario de Atención"}
            </Button>
          )}
          {newSchedule.isBusinessHours && (
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onChange(
                  "isBusinessHours",
                  newSchedule.isBusinessHours ? "" : "false"
                )
              }
            >
              Volver
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleForm;
