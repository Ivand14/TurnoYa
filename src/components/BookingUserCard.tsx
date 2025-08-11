import React from "react";
import {
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  User,
  Phone,
  Mail,
} from "lucide-react";
import { Booking } from "@/types";

interface BookingCardProps {
  booking: Booking;
  onCancel?: (bookingId: string) => void;
}

const BookingUserCard: React.FC<BookingCardProps> = ({ booking, onCancel }) => {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string, type: "payment" | "booking") => {
    if (type === "payment") {
      switch (status) {
        case "approved":
          return "bg-green-100 text-green-800 border-green-200";
        case "pending":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "rejected":
          return "bg-red-100 text-red-800 border-red-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    } else {
      switch (status) {
        case "confirmed":
          return "bg-green-100 text-green-800 border-green-200";
        case "pending":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "cancelled":
          return "bg-red-100 text-red-800 border-red-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    }
  };

  const getStatusText = (status: string, type: "payment" | "booking") => {
    if (type === "payment") {
      switch (status) {
        case "approved":
          return "Pagado";
        case "pending":
          return "Pendiente";
        case "rejected":
          return "Rechazado";
        default:
          return status;
      }
    } else {
      switch (status) {
        case "confirmed":
          return "Confirmada";
        case "pending":
          return "Pendiente";
        case "cancelled":
          return "Cancelada";
        default:
          return status;
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {booking.serviceName}
          </h3>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-1.5" />
            <span>{formatDate(booking.date)}</span>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              booking.status,
              "booking"
            )}`}
          >
            {getStatusText(booking.status, "booking")}
          </span>
          <span className="text-lg font-bold text-gray-900">
            ${booking.price.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Time and Duration */}
      <div className="flex items-center mb-4 text-sm text-gray-600">
        <Clock className="w-4 h-4 mr-1.5" />
        <span>
          {formatTime(booking.start)} - {formatTime(booking.end)}
        </span>
      </div>

      {/* Payment Status */}
      <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center">
          <CreditCard className="w-4 h-4 mr-2 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            Estado del pago
          </span>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
            booking.paymentStatus,
            "payment"
          )}`}
        >
          {getStatusText(booking.paymentStatus, "payment")}
        </span>
      </div>

      {/* Customer Info */}
      <div className="border-t border-gray-100 pt-4">
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            <span>{booking.userName}</span>
          </div>
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            <span>{booking.userEmail}</span>
          </div>
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2" />
            <span>{booking.userPhone}</span>
          </div>
        </div>

        {booking.requiresDeposit && (
          <div className="mt-3 p-2 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700 font-medium">
              Requiere depósito
            </p>
          </div>
        )}

        {booking.notes && (
          <div className="mt-3 p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              <strong>Notas:</strong> {booking.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingUserCard;
