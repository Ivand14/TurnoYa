import { Booking } from ".";

export interface Reservation {
  id: string;
  businessName: string;
  businessLogo?: string;
  serviceName: string;
  date: string;
  time: string;
  duration: number; // en minutos
  price: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  notes?: string;
  createdAt: string;
}

export interface ReservationCardProps {
  reservation: Booking;
  onCancel?: (reservationId: string) => void;
  onReschedule?: (reservationId: string) => void;
  onViewDetails?: (reservationId: string) => void;
}