import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { Schedule } from "@/types/dashboard";
import { useScheduleContext } from "@/context/apisContext/scheduleContext";
import { useEffect, useRef } from "react";

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



  return (
    <>
      {schedulesHrs.length > 0 && (
        <Card className="mb-6">
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
                  {Array.isArray(schedulesHrs) && schedulesHrs.length > 0 ? (
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
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setNewSchedule(schedule)}
                              >
                                Editar
                              </Button>
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
                      <TableCell colSpan={4} className="text-center py-10">
                        <p className="text-gray-500">
                          No hay horarios de atención configurados
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ScheduleList;
