import { Booking, Service, User } from "@/types";

// Employee type definition
export interface Employee {
  id?: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  status: string;
  businessId: string;
  allowedEmployeeIds?: string[];
}

// Schedule type definition
export interface Schedule {
  id?: string;
  employeeId?: string;
  employee?: string;
  day: string;
  startTime: string;
  endTime: string;
  businessId?: string;
  isBusinessHours?: boolean;
}

// Dashboard statistics type
export interface DashboardStats {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  activeEmployees?: number;
  completedBookings: number;
}

export interface ScheduleSettings {
  businessId: string;
  workDays: number[]; // 0-6, donde 0 es domingo
  workHours: {
    start: string; // formato 'HH:MM'
    end: string; // formato 'HH:MM'
  };
  slotDuration: number; // en minutos
  breakBetweenSlots: number; // en minutos
  defaultCapacity: number; // cupos por defecto por horario (fallback)
  capacityMode: "fixed" | "employee-based" | "hybrid"; // modo de cálculo de capacidad
}
