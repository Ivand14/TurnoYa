import { Booking, Service } from "@/types";
import { Employee, Schedule, ScheduleSettings } from "@/types/dashboard";
import { format, parse } from "date-fns";

import { es } from "date-fns/locale";

export interface CapacityCalculationParams {
  date: Date;
  timeStart: string;
  timeEnd: string;
  service?: Service;
  scheduleSettings: ScheduleSettings;
  employees: Employee[];
  employeeSchedules: Schedule[];
  bookedSlots: Booking[];
}

export const calculateSlotCapacity = (
  params: CapacityCalculationParams
): number => {
  const {
    date,
    timeStart,
    timeEnd,
    service,
    scheduleSettings,
    employees,
    employeeSchedules,
    bookedSlots
  } = params;

  // Si el servicio tiene una capacidad específica y el modo es 'fixed' o 'hybrid'
  if (service?.capacity && service.capacity > 0) {
    if (
      scheduleSettings.capacityMode === "fixed" ||
      scheduleSettings.capacityMode === "hybrid"
    ) {
      return service.capacity;
    }
  }

  // Obtener el día de la semana (formato español)
  const dayOfWeek = format(date, "EEEE", { locale: es });
  const dayNames: { [key: string]: string } = {
    lunes: "Lunes",
    martes: "Martes",
    miércoles: "Miércoles",
    jueves: "Jueves",
    viernes: "Viernes",
    sábado: "Sábado",
    domingo: "Domingo"
  };

  const normalizedDay = dayNames[dayOfWeek.toLowerCase()] || dayOfWeek;

  // Calcular empleados disponibles para este horario
  let availableEmployees = 0;

  // Si el servicio requiere empleados específicos
  if (service?.requiresSpecificEmployee && service.allowedEmployeeIds) {
    const allowedEmployees = employees.filter(
      (emp) =>
        emp.status === "active" && service.allowedEmployeeIds?.includes(emp.id)
    );

    availableEmployees = allowedEmployees.filter((emp) =>
      isEmployeeAvailable(
        emp.id,
        normalizedDay,
        timeStart,
        timeEnd,
        employeeSchedules
      )
    ).length;
  } else {
    // Todos los empleados activos pueden realizar el servicio
    const activeEmployees = employees.filter((emp) => emp.status === "active");

    availableEmployees = activeEmployees.filter((emp) =>
      isEmployeeAvailable(
        emp.id,
        normalizedDay,
        timeStart,
        timeEnd,
        employeeSchedules
      )
    ).length;
  }

  // Si no hay empleados disponibles, capacidad es 0
  if (availableEmployees === 0) {
    return 0;
  }

  // En modo 'employee-based' o 'hybrid', la capacidad es el número de empleados disponibles
  if (
    scheduleSettings.capacityMode === "employee-based" ||
    scheduleSettings.capacityMode === "hybrid"
  ) {
    return availableEmployees;
  }

  // Fallback a capacidad por defecto
  return scheduleSettings.defaultCapacity;
};

const isEmployeeAvailable = (
  employeeId: string,
  day: string,
  startTime: string,
  endTime: string,
  schedules: Schedule[]
): boolean => {
  // Buscar horarios del empleado para el día específico
  const employeeSchedules = schedules.filter(
    (schedule) => schedule.employeeId === employeeId && schedule.day === day
  );

  // Si no tiene horarios configurados para este día, no está disponible
  if (employeeSchedules.length === 0) {
    return false;
  }

  // Verificar si el horario solicitado está dentro de algún horario del empleado
  return employeeSchedules.some((schedule) => {
    const scheduleStart = parse(schedule.startTime, "HH:mm", new Date());
    const scheduleEnd = parse(schedule.endTime, "HH:mm", new Date());
    const requestedStart = parse(startTime, "HH:mm", new Date());
    const requestedEnd = parse(endTime, "HH:mm", new Date());

    return requestedStart >= scheduleStart && requestedEnd <= scheduleEnd;
  });
};

export const getAvailableEmployees = (
  date: Date,
  timeStart: string,
  timeEnd: string,
  service: Service | undefined,
  employees: Employee[],
  schedules: Schedule[]
): Employee[] => {
  const dayOfWeek = format(date, "EEEE", { locale: es });
  const dayNames: { [key: string]: string } = {
    lunes: "Lunes",
    martes: "Martes",
    miércoles: "Miércoles",
    jueves: "Jueves",
    viernes: "Viernes",
    sábado: "Sábado",
    domingo: "Domingo"
  };

  const normalizedDay = dayNames[dayOfWeek.toLowerCase()] || dayOfWeek;

  let candidateEmployees = employees.filter((emp) => emp.status === "active");

  // Filtrar por empleados específicos del servicio si es necesario
  if (service?.requiresSpecificEmployee && service.allowedEmployeeIds) {
    candidateEmployees = candidateEmployees.filter((emp) =>
      service.allowedEmployeeIds?.includes(emp.id)
    );
  }

  // Filtrar por disponibilidad
  return candidateEmployees.filter((emp) =>
    isEmployeeAvailable(emp.id, normalizedDay, timeStart, timeEnd, schedules)
  );
};
