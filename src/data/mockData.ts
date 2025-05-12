
import { Business, Service, Booking, User, ScheduleSettings } from '../types';

export const mockBusinesses: Business[] = [
  {
    id: '1',
    name: 'Barber Shop Premium',
    type: 'barbershop',
    description: 'El mejor servicio de barbería de la ciudad',
    logo: 'https://placehold.co/200x200?text=BS',
    address: 'Av. Principal 123',
    phone: '+1234567890',
    email: 'info@barbershoppremium.com',
  },
  {
    id: '2',
    name: 'Beauty Center Elegance',
    type: 'beauty',
    description: 'Centro de belleza y estética profesional',
    logo: 'https://placehold.co/200x200?text=BC',
    address: 'Calle Comercial 456',
    phone: '+1234567891',
    email: 'info@beautycenter.com',
  },
  {
    id: '3',
    name: 'Soccer Fields Pro',
    type: 'sports',
    description: 'Canchas de fútbol profesionales para alquiler',
    logo: 'https://placehold.co/200x200?text=SF',
    address: 'Ruta Deportiva 789',
    phone: '+1234567892',
    email: 'info@soccerfieldspro.com',
  },
];

export const mockServices: Service[] = [
  {
    id: '1',
    businessId: '1',
    name: 'Corte de cabello',
    description: 'Corte de cabello profesional',
    duration: 30,
    price: 15,
    active: true,
  },
  {
    id: '2',
    businessId: '1',
    name: 'Afeitado completo',
    description: 'Afeitado profesional con toalla caliente',
    duration: 20,
    price: 10,
    active: true,
  },
  {
    id: '3',
    businessId: '1',
    name: 'Corte y barba',
    description: 'Combo de corte de cabello y recorte de barba',
    duration: 45,
    price: 22,
    active: true,
  },
  {
    id: '4',
    businessId: '2',
    name: 'Manicure',
    description: 'Manicure profesional',
    duration: 40,
    price: 20,
    active: true,
  },
  {
    id: '5',
    businessId: '2',
    name: 'Pedicure',
    description: 'Pedicure completo con masaje',
    duration: 50,
    price: 25,
    active: true,
  },
  {
    id: '6',
    businessId: '3',
    name: 'Cancha Fútbol 5',
    description: 'Alquiler de cancha para 5 jugadores por lado',
    duration: 60,
    price: 40,
    active: true,
  },
  {
    id: '7',
    businessId: '3',
    name: 'Cancha Fútbol 7',
    description: 'Alquiler de cancha para 7 jugadores por lado',
    duration: 60,
    price: 50,
    active: true,
  },
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin General',
    email: 'admin@turnify.com',
    phone: '+1234567890',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Carlos Gómez',
    email: 'carlos@barbershoppremium.com',
    phone: '+1234567891',
    role: 'business',
    businessId: '1',
  },
  {
    id: '3',
    name: 'Laura Martínez',
    email: 'laura@beautycenter.com',
    phone: '+1234567892',
    role: 'business',
    businessId: '2',
  },
  {
    id: '4',
    name: 'Juan Pérez',
    email: 'juan@soccerfieldspro.com',
    phone: '+1234567893',
    role: 'business',
    businessId: '3',
  },
  {
    id: '5',
    name: 'María López',
    email: 'maria@example.com',
    phone: '+1234567894',
    role: 'customer',
  },
];

export const mockScheduleSettings: ScheduleSettings[] = [
  {
    businessId: '1',
    workDays: [1, 2, 3, 4, 5, 6], // Lunes a sábado
    workHours: {
      start: '09:00',
      end: '18:00',
    },
    slotDuration: 30,
    breakBetweenSlots: 5,
  },
  {
    businessId: '2',
    workDays: [1, 2, 3, 4, 5], // Lunes a viernes
    workHours: {
      start: '10:00',
      end: '19:00',
    },
    slotDuration: 40,
    breakBetweenSlots: 10,
  },
  {
    businessId: '3',
    workDays: [1, 2, 3, 4, 5, 6, 0], // Todos los días
    workHours: {
      start: '08:00',
      end: '22:00',
    },
    slotDuration: 60,
    breakBetweenSlots: 0,
  },
];

// Generar fechas para los próximos 7 días
const generateBookingsForNextWeek = (): Booking[] => {
  const bookings: Booking[] = [];
  const today = new Date();

  for (let i = 0; i < 10; i++) {
    const randomDay = new Date(today);
    randomDay.setDate(today.getDate() + Math.floor(Math.random() * 7));
    
    const randomHour = 9 + Math.floor(Math.random() * 8);
    randomDay.setHours(randomHour, 0, 0, 0);
    
    const endTime = new Date(randomDay);
    
    // Seleccionar un servicio aleatorio
    const randomServiceIndex = Math.floor(Math.random() * mockServices.length);
    const service = mockServices[randomServiceIndex];
    
    endTime.setMinutes(endTime.getMinutes() + service.duration);
    
    bookings.push({
      id: `booking-${i+1}`,
      businessId: service.businessId,
      serviceId: service.id,
      userId: mockUsers[4].id, // Cliente
      userName: mockUsers[4].name,
      userEmail: mockUsers[4].email,
      userPhone: mockUsers[4].phone,
      date: randomDay.toISOString().split('T')[0],
      start: randomDay.toISOString(),
      end: endTime.toISOString(),
      status: Math.random() > 0.2 ? 'confirmed' : 'pending',
      paymentStatus: Math.random() > 0.5 ? 'paid' : 'pending',
    });
  }
  
  return bookings;
};

export const mockBookings: Booking[] = generateBookingsForNextWeek();
