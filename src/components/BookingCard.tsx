
import { Booking, Service } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BookingCardProps {
  booking: Booking;
  service?: Service;
  onCancel?: (bookingId: string) => void;
}

export const BookingCard = ({ booking, service, onCancel }: BookingCardProps) => {
  const bookingDate = new Date(booking.start);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'refunded': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'pending': return 'Pendiente';
      case 'cancelled': return 'Cancelado';
      case 'completed': return 'Completado';
      default: return status;
    }
  };
  
  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Pagado';
      case 'pending': return 'Pendiente';
      case 'refunded': return 'Reembolsado';
      default: return status;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-2 bg-gray-50">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{service?.name || 'Reserva'}</CardTitle>
          <Badge className={getStatusColor(booking.status)}>
            {getStatusLabel(booking.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid gap-1 mb-3">
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>
              {format(bookingDate, "EEEE, d 'de' MMMM", { locale: es })}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              {format(bookingDate, "HH:mm")} - {format(new Date(booking.end), "HH:mm")}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm">
            <p className="font-semibold">{booking.userName}</p>
            <p className="text-gray-600">{booking.userEmail}</p>
          </div>
          <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
            {getPaymentStatusLabel(booking.paymentStatus)}
          </Badge>
        </div>
        
        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
          <Button 
            onClick={() => onCancel?.(booking.id)} 
            variant="outline" 
            className="w-full border-red-300 text-red-600 hover:bg-red-50"
          >
            Cancelar reserva
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
