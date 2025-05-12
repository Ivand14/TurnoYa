
export type BusinessType = 'barbershop' | 'beauty' | 'sports' | 'other';

export interface Business {
  id: string;
  name: string;
  type: BusinessType;
  description: string;
  logo?: string;
  address?: string;
  phone?: string;
  email: string;
}

export interface Service {
  id: string;
  businessId: string;
  name: string;
  description: string;
  duration: number; // en minutos
  price: number;
  active: boolean;
}

export interface TimeSlot {
  id: string;
  start: string; // ISO date string
  end: string; // ISO date string
  available: boolean;
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
  workDays: number[]; // 0-6, donde 0 es domingo
  workHours: {
    start: string; // formato 'HH:MM'
    end: string; // formato 'HH:MM'
  };
  slotDuration: number; // en minutos
  breakBetweenSlots: number; // en minutos
}
