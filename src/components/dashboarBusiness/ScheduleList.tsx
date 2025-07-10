import React from "react";
import { Clock, Edit3, Trash2, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Schedule } from "@/types/dashboard";
import { useScheduleContext } from "@/context/apisContext/scheduleContext";

interface ScheduleListProps {
  schedules: Schedule[];
  schedulesHrs: Schedule[];
  onDelete: (scheduleId: string) => void;
  onEdit?: (id: string, schedule: Schedule) => void;
  businessId: string;
}

const ScheduleList: React.FC<ScheduleListProps> = ({
  schedulesHrs,
  onDelete,
  onEdit,
  businessId,
}) => {
  const { setNewSchedule } = useScheduleContext();

  if (schedulesHrs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/25">
            <Tag className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Horarios de Atención Registrados
          </h1>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay horarios configurados
          </h3>
          <p className="text-gray-500">
            Agrega horarios de atención para que los clientes puedan reservar
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
          <Tag className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Horarios de Atención Registrados
        </h1>
        <p className="text-gray-500 mt-2">
          {schedulesHrs.length} horario{schedulesHrs.length !== 1 ? "s" : ""}{" "}
          configurado{schedulesHrs.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Schedule Grid */}
      <div className="space-y-4">
        {schedulesHrs.map((schedule, index) => (
          <div
            key={schedule.id}
            className="group bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              {/* Schedule Info */}
              <div className="flex items-center gap-8">
                {/* Day */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Día</div>
                    <div className="text-xl font-semibold text-gray-900">
                      {schedule.day}
                    </div>
                  </div>
                </div>

                {/* Time Range */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Inicio</div>
                    <div className="text-lg font-mono font-semibold text-gray-900 bg-gray-50 px-4 py-2 rounded-xl">
                      {schedule.startTime}
                    </div>
                  </div>

                  <div className="w-8 h-px bg-gray-200"></div>

                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Fin</div>
                    <div className="text-lg font-mono font-semibold text-gray-900 bg-gray-50 px-4 py-2 rounded-xl">
                      {schedule.endTime}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {onEdit && (
                  <Button
                    onClick={() => setNewSchedule(schedule)}
                    variant="ghost"
                    size="sm"
                    className="group h-10 w-10 rounded-xl bg-gray-50 p-0 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 opacity-60 hover:opacity-100"
                  >
                    <Edit3 className="h-4 w-4 transition-transform group-hover:scale-110" />
                  </Button>
                )}

                <Button
                  onClick={() => onDelete(schedule.id)}
                  variant="ghost"
                  size="sm"
                  className="group h-10 w-10 rounded-xl bg-gray-50 p-0 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 opacity-60 hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4 transition-transform group-hover:scale-110" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleList;
