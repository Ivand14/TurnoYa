import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import React from "react";
import { Schedule } from "@/types/dashboard";

interface ScheduleListProps {
  schedules: Schedule[];
  schedulesHrs: Schedule[];
  onDelete: (scheduleId: string) => void;
  onEdit?: (schedule: Schedule) => void;
}

const ScheduleList: React.FC<ScheduleListProps> = ({
  schedules,
  schedulesHrs,
  onDelete,
  onEdit,
}) => {
  // Split schedules into business hours and employee schedules
  // const businessSchedule = schedules.filter((s) => s.isBusinessHours);
  // const employeeSchedules = schedules.filter((s) => !s.isBusinessHours);
  // const businessScheduleHrs = schedulesHrs.filter((s) => s.isBusinessHours);
  const keys = schedules.find((sch) => sch.id === sch.id)
  console.log(keys)
  return (
    <>
      {/* Business Hours */}
      {schedules.length > 0 && (
        <Card className="mb-6" >
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Horarios de Atención
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Día</TableHead>
                    <TableHead>Hora de inicio</TableHead>
                    <TableHead>Hora de fin</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedulesHrs.length > 0 ? (
                    schedulesHrs.map((schedule) => (
                      <TableRow key={schedule.id} className="bg-muted/20">
                        <TableCell>
                          <strong>{schedule.day}</strong>
                        </TableCell>
                        <TableCell>{schedule.startTime}</TableCell>
                        <TableCell>{schedule.endTime}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {onEdit && (
                              <div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onEdit(schedule)}
                                >
                                  Editar
                                </Button>
                              </div>
                            )}
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => onDelete(schedule.id)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <div className="text-center py-10">
                          <p className="text-gray-500">
                            No hay horarios de atencion configurados
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Employee Schedules */}
      <Card>
        <CardHeader>
          <CardTitle>Horarios de Empleados</CardTitle>
        </CardHeader>
        <CardContent>
          {schedules.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empleado</TableHead>
                    <TableHead>Día</TableHead>
                    <TableHead>Hora de inicio</TableHead>
                    <TableHead>Hora de fin</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(schedules) && schedules?.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>{schedule.employee}</TableCell>
                      <TableCell>{schedule.day}</TableCell>
                      <TableCell>{schedule.startTime}</TableCell>
                      <TableCell>{schedule.endTime}</TableCell>

                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(schedule.id)}
                        >
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">
                No hay horarios de empleados configurados
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default ScheduleList;
