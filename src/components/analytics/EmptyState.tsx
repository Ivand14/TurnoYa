import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, Calendar, X } from "lucide-react";

interface EmptyStateProps {
  type: "no-results" | "no-bookings";
  onClearFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  onClearFilters,
}) => {
  if (type === "no-results") {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No se encontraron reservas
        </h3>
        <p className="text-gray-500 text-center max-w-md mb-6">
          No hay reservas que coincidan con los criterios de búsqueda y filtros
          aplicados
        </p>
        {onClearFilters && (
          <Button onClick={onClearFilters} className="flex items-center gap-2">
            <X className="w-4 h-4" />
            Limpiar filtros
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center">
          <Calendar className="w-12 h-12 text-blue-400" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-sm font-semibold text-gray-600">0</span>
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        Panel listo para reservas
      </h3>
      <p className="text-gray-500 text-center max-w-md">
        No hay reservas programadas en este momento. Las nuevas reservas
        aparecerán aquí automáticamente.
      </p>
    </motion.div>
  );
};
