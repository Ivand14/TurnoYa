import { Booking, Service } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { useServicesContext } from "@/context/apisContext/servicesContext";
import { useEffect } from "react";
import { PaymentDetails } from "./dashboarBusiness/paymentDetail";
import {
  Calendar,
  Clock,
  User,
  Mail,
  CreditCard,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { useBookingContext } from "@/context/apisContext/bookingContext";
import { compnay_logged } from "@/context/current_company";

interface BookingCardProps {
  booking: Booking;
  service?: Service;
  onCancel?: (bookingId: string) => void;
}

export const BookingCard = ({
  booking,
  service,
  onCancel,
}: BookingCardProps) => {
  const bookingDate = new Date(booking.start);
  const { services, fetchGetServices } = useServicesContext();
  const { fetchPatchStatusBooking } = useBookingContext();
  const { company } = compnay_logged();

  useEffect(() => {
    const loadService = async () => {
      await fetchGetServices(booking.businessId);
    };
    loadService();
  }, []);

  const nameOfService = services.find((serv) => serv.id === booking.serviceId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-emerald-600";
      case "pending":
        return "text-amber-600";
      case "cancelled":
        return "text-red-600";
      case "completed":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-emerald-600";
      case "pending":
        return "text-amber-600";
      case "refunded":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmado";
      case "pending":
        return "Pendiente";
      case "cancelled":
        return "Cancelado";
      case "completed":
        return "Completado";
      default:
        return status;
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case "paid":
        return "Pagado";
      case "pending":
        return "Pendiente";
      case "refunded":
        return "Reembolsado";
      default:
        return status;
    }
  };

  const onMarkAsCompleted = async (booking_id: string) => {
    await fetchPatchStatusBooking(booking_id, "completed");
  };

  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const currentDate = date.toLocaleDateString("en-CA", options);
  const bookingToDate = bookingDate.toLocaleDateString("en-CA", options);

  const isPastOrToday = bookingToDate <= currentDate;
  const canMarkAsCompleted = booking.status === "confirmed" && isPastOrToday;

  return (
    <div className="group relative py-8 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/30 transition-all duration-500">
      {/* Status indicator line */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-0.5 ${getStatusColor(
          booking.status
        )} bg-current opacity-30 group-hover:opacity-100 transition-opacity duration-300`}
      />

      <div className="pl-6 space-y-6">
        {/* Header row */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-light text-gray-900 tracking-wide">
              {nameOfService?.name_service}
            </h3>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                <span className="font-mono">
                  {format(bookingDate, "dd.MM.yyyy", { locale: es })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-mono">
                  {format(bookingDate, "HH:mm")}—
                  {format(new Date(booking.end), "HH:mm")}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right space-y-1">
            <div
              className={`text-xs font-medium uppercase tracking-wider ${getStatusColor(
                booking.status
              )}`}
            >
              {getStatusLabel(booking.status)}
            </div>
            <div className="w-12 h-px bg-gray-200 ml-auto" />
          </div>
        </div>

        {/* Client and payment row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-medium text-gray-700">
                  {booking.userName}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Mail className="w-3 h-3" />
                <span className="font-mono">{booking.userEmail}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CreditCard className="w-3.5 h-3.5 text-gray-300" />
            <span
              className={`text-xs font-medium uppercase tracking-wider ${getPaymentStatusColor(
                booking.paymentStatus
              )}`}
            >
              {getPaymentStatusLabel(booking.paymentStatus)}
            </span>
          </div>
        </div>

        {/* Actions row */}
        {booking.status !== "cancelled" && booking.status !== "completed" && (
          <div className="flex items-start justify-between  pt-2">
            <div className="flex flex-col items-start gap-4">
              {canMarkAsCompleted && company && (
                <Button
                  onClick={() => onMarkAsCompleted(booking.id)}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-blue-600 hover:text-blue-700 hover:bg-transparent font-normal p-0 h-auto uppercase tracking-wider"
                >
                  Marcar completado
                  <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              )}
              <Button
                onClick={() => onCancel?.(booking.id)}
                variant="ghost"
                size="sm"
                className="text-xs text-red-500 hover:text-red-600 hover:bg-transparent font-normal p-0 h-auto uppercase tracking-wider"
              >
                Cancelar
                <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </div>

            <div className="opacity-60 hover:opacity-100 transition-opacity">
              <PaymentDetails
                paymentId={booking.payment_id}
                note={booking.notes}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
