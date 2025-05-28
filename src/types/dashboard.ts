import { Booking, Service, User } from "@/types";

// Employee type definition
export interface Employee {
    id?: string;
    name: string;
    email: string;
    phone?: string;
    position: string;
    status: string;
    businessId: string;
    allowedEmployeeIds?:string[];
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
    activeEmployees: number;
}