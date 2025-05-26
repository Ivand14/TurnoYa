import { Employee, Schedule } from "@/types/dashboard";

// Mockup of employees for demonstration
export const mockEmployees: Employee[] = [
    {
        id: "emp-1",
        name: "Ana García",
        email: "ana@ejemplo.com",
        phone: "601-234-567",
        position: "Estilista",
        status: "active"
    },
    {
        id: "emp-2",
        name: "Carlos Rodríguez",
        email: "carlos@ejemplo.com",
        phone: "602-345-678",
        position: "Barbero",
        status: "active"
    },
    {
        id: "emp-3",
        name: "Elena Martínez",
        email: "elena@ejemplo.com",
        phone: "603-456-789",
        position: "Manicurista",
        status: "inactive"
    }
];

// Mockup of schedules for demonstration
export const mockSchedules: Schedule[] = [
    {
        id: "sch-1",
        employeeId: "emp-1",
        employeeName: "Ana García",
        day: "Lunes",
        startTime: "09:00",
        endTime: "17:00"
    },
    {
        id: "sch-2",
        employeeId: "emp-1",
        employeeName: "Ana García",
        day: "Martes",
        startTime: "09:00",
        endTime: "17:00"
    },
    {
        id: "sch-3",
        employeeId: "emp-2",
        employeeName: "Carlos Rodríguez",
        day: "Lunes",
        startTime: "10:00",
        endTime: "18:00"
    },
    {
        id: "sch-4",
        employeeId: "emp-2",
        employeeName: "Carlos Rodríguez",
        day: "Miércoles",
        startTime: "10:00",
        endTime: "18:00"
    }
];