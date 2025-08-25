import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Grid3X3, List, Download, RefreshCw } from "lucide-react";
import {
  ViewMode,
  GroupingMode,
  SortOption,
  SortDirection,
} from "@/types/bookings";
import { exportBookingsData, refreshBookingsData } from "@/utils/bookingUtils";

interface BookingControlsProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  groupingMode: GroupingMode;
  setGroupingMode: (mode: GroupingMode) => void;
  sortBy: SortOption;
  sortDirection: SortDirection;
  onSortChange: (value: string) => void;
  processedBookings: any[];
}

export const BookingControls: React.FC<BookingControlsProps> = ({
  viewMode,
  setViewMode,
  groupingMode,
  setGroupingMode,
  processedBookings,
}) => {
  return (
    <div className="flex items-center gap-2">
      {/* Grouping Mode */}
      <Select
        value={groupingMode}
        onValueChange={(value: GroupingMode) => setGroupingMode(value)}
      >
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">Por día</SelectItem>
          <SelectItem value="service">Por servicio</SelectItem>
          <SelectItem value="none">Sin agrupar</SelectItem>
        </SelectContent>
      </Select>

      {/* View Mode Toggle */}
      <div className="flex items-center bg-gray-100 rounded-lg p-1">
        <Button
          variant={viewMode === "grid" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("grid")}
          className="h-8 px-3"
        >
          <Grid3X3 className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("list")}
          className="h-8 px-3"
        >
          <List className="w-4 h-4" />
        </Button>
      </div>

      {/* Action Buttons */}
      {/* <Button variant="outline" size="sm" onClick={refreshBookingsData}>
        <RefreshCw className="w-4 h-4" />
      </Button> */}

      {/* <Button
        variant="outline"
        size="sm"
        onClick={() => exportBookingsData(processedBookings)}
      >
        <Download className="w-4 h-4" />
      </Button> */}
    </div>
  );
};
