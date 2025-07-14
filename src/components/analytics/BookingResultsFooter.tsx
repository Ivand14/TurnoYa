import React from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { refreshBookingsData } from "@/utils/bookingUtils";

interface BookingResultsFooterProps {
  processedBookingsCount: number;
  groupedBookingsCount: number;
  groupingMode: string;
  hasActiveFilters: boolean | string;
}

export const BookingResultsFooter: React.FC<BookingResultsFooterProps> = ({
  processedBookingsCount,
  groupedBookingsCount,
  groupingMode,
  hasActiveFilters,
}) => {
  return (
    <div className="mt-8 pt-6 border-t border-gray-100">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <span className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            {hasActiveFilters ? "Resultados filtrados" : "Total de reservas"}
          </span>
          <span className="font-semibold text-gray-800">
            {processedBookingsCount} reserva
            {processedBookingsCount !== 1 ? "s" : ""}
          </span>
          {groupingMode !== "none" && (
            <span className="text-gray-500">
              en {groupedBookingsCount}{" "}
              {groupingMode === "day" ? "día" : "servicio"}
              {groupedBookingsCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>
            Última actualización: {format(new Date(), "HH:mm", { locale: es })}
          </span>
          <Button variant="ghost" size="sm" onClick={refreshBookingsData}>
            <RefreshCw className="w-3 h-3 mr-1" />
            Actualizar
          </Button>
        </div>
      </div>
    </div>
  );
};
