import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { DashboardStats } from "@/types/dashboard";
import React from "react";

interface StatsOverviewProps {
  stats: DashboardStats;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Reservas Totales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.totalBookings}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Reservas Confirmadas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-booking-accent">
            {stats.confirmedBookings}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Reservas Pendientes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-booking-warning">
            {stats.pendingBookings}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Empleados Activos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-500">
            {stats.activeEmployees}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
