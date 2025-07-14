import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import {
  getStatusColor,
  getStatusIcon,
  getStatusLabel,
} from "@/utils/bookingUtils";
import { string } from "zod";

interface BookingFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedServiceTypes: string[];
  selectedStatuses: string[];
  availableServiceTypes: string[];
  availableStatuses: string[];
  onToggleServiceType: (serviceType: string) => void;
  onToggleStatus: (status: string) => void;
  onClearFilters: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  hasActiveFilters: boolean | string;
}

export const BookingFilters: React.FC<BookingFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedServiceTypes,
  selectedStatuses,
  availableServiceTypes,
  availableStatuses,
  onToggleServiceType,
  onToggleStatus,
  onClearFilters,
  showFilters,
  onToggleFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar reservas, clientes o servicios..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
            />
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onToggleFilters}
          className={`flex items-center gap-2 ${
            showFilters ? "bg-blue-50 border-blue-200" : ""
          }`}
        >
          <Filter className="w-4 h-4" />
          Filtros
          {selectedServiceTypes.length + selectedStatuses.length > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
              {selectedServiceTypes.length + selectedStatuses.length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-100 pt-6 space-y-4"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Service Types Filter */}
              {availableServiceTypes.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Tipos de Servicio
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {availableServiceTypes.map((serviceType) => (
                      <Button
                        key={serviceType}
                        variant={
                          selectedServiceTypes.includes(serviceType)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => onToggleServiceType(serviceType)}
                        className="text-xs"
                      >
                        {serviceType}
                        {selectedServiceTypes.includes(serviceType) && (
                          <X className="w-3 h-3 ml-1" />
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Filter */}
              {availableStatuses.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Estados
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {availableStatuses.map((status) => (
                      <Button
                        key={status}
                        variant={
                          selectedStatuses.includes(status)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => onToggleStatus(status)}
                        className={`text-xs flex items-center gap-1 ${
                          selectedStatuses.includes(status)
                            ? ""
                            : getStatusColor(status)
                        }`}
                      >
                        {/* {getStatusIcon(status)} */}
                        {getStatusLabel(status)}
                        {selectedStatuses.includes(status) && (
                          <X className="w-3 h-3 ml-1" />
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {hasActiveFilters && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Filtros activos:</span>
                  <Badge variant="outline">
                    {selectedServiceTypes.length + selectedStatuses.length}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={onClearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Limpiar todo
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
