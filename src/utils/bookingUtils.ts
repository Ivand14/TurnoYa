import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

export const getStatusColor = (status: string) => {
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
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "confirmed":
      return CheckCircle2;
    case "pending":
      return Clock;
    case "cancelled":
      return AlertCircle;
    default:
      return Clock;
  }
};

export const getStatusLabel = (status: string) => {
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
};

export const exportBookingsData = (bookings: any[]) => {
  console.log("Exportando datos...", bookings);
  // Implementar lógica de exportación aquí
};

export const refreshBookingsData = () => {
  console.log("Refrescando datos...");
  // Implementar lógica de actualización aquí
};
