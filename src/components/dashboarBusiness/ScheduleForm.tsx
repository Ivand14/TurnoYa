import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Employee, Schedule } from "@/types/dashboard";
import { Input } from "@/components/ui/input";
import React, { useEffect, useRef } from "react";
import { useScheduleContext } from "@/context/apisContext/scheduleContext";

interface ScheduleFormProps {
  activeEmployees: Employee[];
  onChange: (field: string, value: string) => void;
  onSubmit: (sch: Schedule, businessId: string) => void;
  onEdit?: (id: string, schedule: Schedule) => void;
  businessId: string;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({
  onChange,
  onSubmit,
  businessId,
  onEdit,
}) => {
  const { newSchedule } = useScheduleContext();
  const originalSchedule = useRef(newSchedule);

  useEffect(() => {
    originalSchedule.current = newSchedule; 
  }, []);

  const handleEdit = () => {
    onEdit(newSchedule.id,newSchedule)
  }

  

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <>
            <Clock className="mr-2 h-5 w-5" />
            Editar Horarios de Atención
          </>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
                "Domingo",
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
          <Button onClick={() => onSubmit(newSchedule, businessId)}>
            Nuevo Horario
          </Button>
          <Button onClick={handleEdit}>
            Actualizar Horario
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleForm;
