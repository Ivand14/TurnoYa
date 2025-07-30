import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStats } from "@/types/dashboard";
import React from "react";

interface StatsOverviewProps {
  stats: DashboardStats;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const statsData = [
    {
      id: "total",
      title: "Reservas Totales",
      value: stats.totalBookings,
      colorClass: "text-foreground",
    },
    {
      id: "confirmed",
      title: "Reservas Confirmadas",
      value: stats.confirmedBookings,
      colorClass: "text-green-600",
    },
    {
      id: "completed",
      title: "Reservas Completadas",
      value: stats.completedBookings,
      colorClass: "text-blue-600",
    },
    {
      id: "pending",
      title: "Reservas Pendientes",
      value: stats.pendingBookings,
      colorClass: "text-orange-600",
    },
  ];

  return (
    <>
      {/* Vista Desktop - Grid */}
      <div className="hidden md:grid grid-cols-4 gap-6">
        {statsData.map((stat) => (
          <Card key={stat.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-bold ${stat.colorClass}`}>
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vista Mobile - Tabs */}
      <div className="md:hidden">
        <Tabs defaultValue="total" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="total" className="text-xs px-2">
              Total
            </TabsTrigger>
            <TabsTrigger value="confirmed" className="text-xs px-2">
              Confirmadas
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs px-2">
              Completadas
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs px-2">
              Pendientes
            </TabsTrigger>
          </TabsList>

          {statsData.map((stat) => (
            <TabsContent key={stat.id} value={stat.id}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-center">
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className={`text-4xl font-bold ${stat.colorClass}`}>
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  );
};

export default StatsOverview;
