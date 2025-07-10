import { Calendar as CalendarIcon, Clock, Plus, Edit3 } from "lucide-react";
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
    onEdit?.(newSchedule.id, newSchedule);
  };

  const days = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/25">
          <Clock className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Horarios de Atención
        </h1>
        <p className="text-gray-500 mt-2">
          Configura los horarios de tu negocio
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <div className="space-y-8">
          {/* Time Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Day Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Día de la semana
              </label>
              <div className="relative">
                <select
                  className="w-full border-0 bg-gray-50 rounded-xl px-4 py-3 text-lg appearance-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 cursor-pointer"
                  value={newSchedule.day}
                  onChange={(e) => onChange("day", e.target.value)}
                >
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Start Time */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Hora de inicio
              </label>
              <Input
                type="time"
                value={newSchedule.startTime}
                onChange={(e) => onChange("startTime", e.target.value)}
                className="border-0 bg-gray-50 rounded-xl px-4 py-3 text-lg text-center font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>

            {/* End Time */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Hora de fin
              </label>
              <Input
                type="time"
                value={newSchedule.endTime}
                onChange={(e) => onChange("endTime", e.target.value)}
                className="border-0 bg-gray-50 rounded-xl px-4 py-3 text-lg text-center font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button
              onClick={() => onSubmit(newSchedule, businessId)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nuevo Horario
            </Button>

            {onEdit && (
              <Button
                onClick={handleEdit}
                variant="outline"
                className="border-2 border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 px-8 py-3 rounded-2xl font-semibold transition-all duration-300 hover:bg-blue-50 flex items-center gap-2"
              >
                <Edit3 className="w-5 h-5" />
                Actualizar Horario
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleForm;
