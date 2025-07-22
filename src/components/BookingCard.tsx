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
  DollarSign,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Wallet,
  TrendingUp,
} from "lucide-react";
import { useBookingContext } from "@/context/apisContext/bookingContext";
import { compnay_logged } from "@/context/current_company";

interface BookingCardProps {
  booking: Booking & {
    totalAmount?: number;
    paidAmount?: number;
    depositAmount?: number;
  };
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

  // Cálculos de pagos
  const totalAmount = booking.price || 0;
  const paidAmount = booking.paymentAmount || 0;
  const remainingAmount = totalAmount - paidAmount;
  const hasDeposit = paidAmount > 0 && remainingAmount > 0;
  const isFullyPaid = paidAmount >= totalAmount;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "confirmed":
        return {
          color: "bg-gradient-to-r from-emerald-50 to-green-50",
          textColor: "text-emerald-700",
          borderColor: "border-emerald-200",
          icon: CheckCircle2,
          label: "Confirmado",
        };
      case "pending":
        return {
          color: "bg-gradient-to-r from-amber-50 to-orange-50",
          textColor: "text-amber-700",
          borderColor: "border-amber-200",
          icon: AlertCircle,
          label: "Pendiente",
        };
      case "cancelled":
        return {
          color: "bg-gradient-to-r from-red-50 to-rose-50",
          textColor: "text-red-700",
          borderColor: "border-red-200",
          icon: XCircle,
          label: "Cancelado",
        };
      case "completed":
        return {
          color: "bg-gradient-to-r from-blue-50 to-indigo-50",
          textColor: "text-blue-700",
          borderColor: "border-blue-200",
          icon: CheckCircle2,
          label: "Completado",
        };
      default:
        return {
          color: "bg-gradient-to-r from-gray-50 to-slate-50",
          textColor: "text-gray-700",
          borderColor: "border-gray-200",
          icon: AlertCircle,
          label: status,
        };
    }
  };

  const getPaymentStatusConfig = (status: string) => {
    switch (status) {
      case "paid":
        return {
          color: "text-emerald-600 bg-emerald-50",
          label: "Pagado",
          icon: CheckCircle2,
        };
      case "pending":
        return {
          color: "text-amber-600 bg-amber-50",
          label: "Pendiente",
          icon: AlertCircle,
        };
      case "refunded":
        return {
          color: "text-red-600 bg-red-50",
          label: "Reembolsado",
          icon: XCircle,
        };
      default:
        return {
          color: "text-gray-600 bg-gray-50",
          label: status,
          icon: AlertCircle,
        };
    }
  };

  const onMarkAsCompleted = async (booking_id: string) => {
    await fetchPatchStatusBooking(
      booking_id,
      "completed",
      booking.paymentAmount,
      booking.price
    );
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

  const statusConfig = getStatusConfig(booking.status);
  const paymentConfig = getPaymentStatusConfig(booking.paymentStatus);
  const StatusIcon = statusConfig.icon;
  const PaymentIcon = paymentConfig.icon;

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-500 overflow-hidden">
      {/* Gradient header */}
      <div
        className={`${statusConfig.color} px-6 py-4 ${statusConfig.borderColor} border-b`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 ${statusConfig.color} rounded-xl border ${statusConfig.borderColor}`}
            >
              <StatusIcon className={`w-4 h-4 ${statusConfig.textColor}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
                {nameOfService?.name_service}
              </h3>
              <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  <span className="font-medium">
                    {format(bookingDate, "dd MMM yyyy", { locale: es })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  <span className="font-medium">
                    {format(bookingDate, "HH:mm")} -{" "}
                    {format(new Date(booking.end), "HH:mm")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <Badge
              className={`${statusConfig.textColor} ${statusConfig.color} border-0 font-medium px-3 py-1`}
            >
              {statusConfig.label}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="p-6 space-y-6">
        {/* Client information */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {booking.userName}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                <Mail className="w-3 h-3" />
                <span>{booking.userEmail}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <Badge
              className={`${paymentConfig.color} border-0 font-medium px-3 py-1`}
            >
              <PaymentIcon className="w-3 h-3 mr-1" />
              {paymentConfig.label}
            </Badge>
          </div>
        </div>

        {/* Payment information */}
        {totalAmount > 0 && (
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-900 text-sm">
                Información de Pago
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  Total
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  ${totalAmount.toLocaleString()}
                </div>
              </div>

              {hasDeposit && (
                <>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      Seña Pagada
                    </div>
                    <div className="text-lg font-semibold text-emerald-600">
                      ${paidAmount.toLocaleString()}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      Resta Pagar
                    </div>
                    <div className="text-lg font-semibold text-amber-600">
                      ${remainingAmount.toLocaleString()}
                    </div>
                  </div>
                </>
              )}

              {isFullyPaid && !hasDeposit && (
                <div className="col-span-2 space-y-1">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    Estado
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-600">
                      Completamente Pagado
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Progress bar for partial payments */}
            {hasDeposit && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Progreso de Pago</span>
                  <span>{Math.round((paidAmount / totalAmount) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(paidAmount / totalAmount) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        {booking.notes && (
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="text-xs text-blue-600 uppercase tracking-wide mb-1">
              Notas
            </div>
            <div className="text-sm text-gray-700">{booking.notes}</div>
          </div>
        )}

        {/* Actions */}
        {booking.status !== "cancelled" && booking.status !== "completed" && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex gap-3">
              {canMarkAsCompleted && company && (
                <Button
                  onClick={() => onMarkAsCompleted(booking.id)}
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium px-4 py-2 rounded-lg transition-all duration-200 group/btn"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Marcar Completado
                  <ArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover/btn:opacity-100 transform translate-x-0 group-hover/btn:translate-x-1 transition-all duration-200" />
                </Button>
              )}

              <Button
                onClick={() => onCancel?.(booking.id)}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600 hover:bg-red-50 font-medium px-4 py-2 rounded-lg transition-all duration-200 group/btn"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancelar
                <ArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover/btn:opacity-100 transform translate-x-0 group-hover/btn:translate-x-1 transition-all duration-200" />
              </Button>
            </div>

            <div className="opacity-60 hover:opacity-100 transition-opacity duration-200">
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
