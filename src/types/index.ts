export type BusinessType = 'barbershop' | 'beauty' | 'sports' | 'other';

export interface Business {
  address: string;
  company_name: string;
  company_type: string;
  description: string;
  email: string;
  id: string;
  logo: string;
  owner: string;
  phone: string;
  rol: string;
  services?: Service[];
}

export interface Service {
  id?: string;
  businessId: string;
  name_service: string;
  description: string;
  duration: number; // en minutos
  price: number;
  active: boolean;
  capacity?: number;
  requiresSpecificEmployee?: boolean;
  allowedEmployeeIds?: string[];
  capacityMode?: 'fixed' | 'employee-based' | 'hybrid';
}

export interface TimeSlot extends Omit<Booking, 'id' | 'userId' | 'userName' | 'userEmail' | 'userPhone'> {
  id: string;
  start: string; // ISO date string
  end: string; // ISO date string
  available: boolean;
  userId: string;
  userName: string;
  serviceId: string;
  serviceName: string;
  userEmail:string;
  userPhone: string; 
}

export interface Booking {
  id: string;
  businessId: string;
  serviceId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  date: string; // ISO date string
  start: string; // ISO date string
  end: string; // ISO date string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'business' | 'customer';
  businessId?: string;
}

export interface Day {
  date: Date;
  isToday: boolean;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isDisabled?: boolean; // array of disabled days (e.g., ['Sunday', 'Saturday'])
}

export interface DaySchedule {
  date: Date;
  timeSlots: TimeSlot[];
}

export interface WeekSchedule {
  days: DaySchedule[];
  startDate: Date;
  endDate: Date;
}

export interface ScheduleSettings {
  businessId: string;
  workDays: number[]; // 0-6 donde 0 es domingo
  workHours: {
    start: string; // formato 'HH:MM'
    end: string; // formato 'HH:MM'
  };
  slotDuration: number; // en minutos
  breakBetweenSlots: number; // en minutos
  days_business?:string[];
  defaultCapacity: number; // cupos por defecto por horario (fallback)
  capacityMode: 'fixed' | 'employee-based' | 'hybrid'; // modo de cálculo de capacidad
}

export interface firebaseSettings {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}