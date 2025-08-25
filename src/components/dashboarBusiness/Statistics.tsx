import React, { useEffect, useState } from "react";
import { TrendingUp, Users, Clock, CalendarCheck } from "lucide-react";
import { Booking } from "@/types";
import { useServicesContext } from "@/context/apisContext/servicesContext";
import {
  monthlyDataInt,
  performanceMetricsInt,
  topServiceInt,
} from "@/types/statistics";

interface statisticsProps {
  booking: Booking[];
  businessId: string;
}

const Statistics: React.FC<statisticsProps> = ({ booking, businessId }) => {
  const { fetchGetServices, services } = useServicesContext();
  const [serviceBooking, setServiceBooking] = useState([]);

  useEffect(() => {
    fetchGetServices(businessId);
  }, [businessId]);

  useEffect(() => {
    if (services.length && booking.length) {
      const bookingServiceIds = booking.map((bk) => bk.serviceId);
      const serviceInBooking = services.filter((ser) =>
        bookingServiceIds.includes(ser.id)
      );
      setServiceBooking(serviceInBooking);
    }
  }, [services, booking]);

  const topServices: topServiceInt[] = [];

  const monthlyData: monthlyDataInt[] = React.useMemo(() => {
    const monthsMap: Record<string, { booking: number; income: number }> = {};

    booking.forEach((bk) => {
      const date = new Date(bk.date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthsMap[monthKey]) {
        monthsMap[monthKey] = { booking: 0, income: 0 };
      }

      monthsMap[monthKey].booking += 1;
      monthsMap[monthKey].income += bk.price;
    });

    const sorted = Object.entries(monthsMap)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([key, val]) => {
        const [year, month] = key.split("-");
        const monthName = new Date(
          Number(year),
          Number(month) - 1
        ).toLocaleDateString("es-ES", {
          month: "long",
        });

        return {
          month: `${monthName[0].toUpperCase()}${monthName.slice(1)}`,
          booking: val.booking,
          income: val.income,
        };
      });

    return sorted;
  }, [booking]);

  const topServiceMetrics = () => {
    const serviceData = booking.reduce(
      (acc: Record<string, { bookings: number; revenue: number }>, bk) => {
        const service = services.find((ser) => ser.id === bk.serviceId);
        if (!service) return acc;

        const name = service.name_service;
        if (!acc[name]) {
          acc[name] = { bookings: 0, revenue: 0 };
        }

        acc[name].bookings += 1;
        acc[name].revenue += bk.price;

        return acc;
      },
      {}
    );

    const result = Object.entries(serviceData).map(([name, data]) => ({
      name,
      bookings: data.bookings,
      revenue: data.revenue,
    }));

    return result;
  };

  const timeProm = () => {
    const durations = booking
      .map((bk) => {
        const service = services.find((ser) => ser.id === bk.serviceId);
        return service?.duration ?? 0;
      })
      .filter((duration) => duration > 0);

    if (durations.length === 0) return 0;

    const promedio =
      durations.reduce((acc, dur) => acc + dur, 0) / durations.length;

    return Math.round(promedio);
  };

  const recurringClients = () => {
    const clients = booking.reduce((acc, bk) => {
      const client = bk.userEmail;
      acc[client] = (acc[client] ?? 0) + 1;
      return acc;
    }, {});

    const totalClients = Object.keys(clients).length;
    const recurringCount = Object.values(clients).filter(
      (count: number) => count > 3
    ).length;

    return isNaN(recurringCount / totalClients)
      ? "0%"
      : `${Math.round((recurringCount / totalClients) * 100)}%`;
  };

  const assistProm = () => {
    const bookCompleted = booking.reduce((acc: Record<string, number>, bk) => {
      acc[bk.status] = (acc[bk.status] ?? 0) + 1;
      return acc;
    }, {});

    const quantityCompleted = bookCompleted["completed"] ?? 0;
    const quantityConfirmed = bookCompleted["confirmed"] ?? 0;

    if (quantityConfirmed === 0) return 0;

    const asistencia = Math.round(
      (quantityCompleted / quantityConfirmed) * 100
    );

    return Math.min(100, asistencia);
  };

  const performanceMetrics: performanceMetricsInt[] = [
    {
      title: "Tiempo Promedio",
      value: `${timeProm() || 0}`,
      icon: Clock,
      color: "text-blue-500",
    },
    {
      title: "Clientes Recurrentes",
      value: `${recurringClients() || 0}`,
      icon: Users,
      color: "text-green-500",
    },
    {
      title: "Promedio de asistencia",
      value: `${assistProm() || "0"}%`,
      icon: CalendarCheck,
      color: "text-green-500",
    },
  ];

  topServiceMetrics();
  topServices.push(...topServiceMetrics());

  const maxBooking = Math.max(...monthlyData.map((d) => d.booking), 1);
  const maxIncome = Math.max(...monthlyData.map((d) => d.income), 1);

  return (
    <div className="p-8 min-h-screen ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Estadísticas
          </h1>
          <p className="text-gray-600">
            Análisis detallado del rendimiento de tu negocio
          </p>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {performanceMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gray-50`}>
                    <Icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metric.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Reservations Chart - Simple Bars */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  📅 Reservas por Mes
                </h3>
                <p className="text-gray-500 mt-1">
                  Cuántas citas tuviste cada mes
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {data.month}
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      {data.booking} citas
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${Math.max(
                          data.booking / maxBooking / 100,
                          5
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-blue-700 font-medium">
                  Total de citas:
                </span>
                <span className="text-2xl font-bold text-blue-800">
                  {monthlyData.reduce((acc, data) => acc + data.booking, 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Monthly Revenue Chart - Simple Bars */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  💰 Ingresos por Mes
                </h3>
                <p className="text-gray-500 mt-1">Cuánto ganaste cada mes</p>
              </div>
            </div>

            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {data.month}
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      ${data.income.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${Math.max(
                          data.income / maxIncome / 1000,
                          5
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-green-700 font-medium">
                  Total ganado:
                </span>
                <span className="text-2xl font-bold text-green-800">
                  $
                  {monthlyData
                    .reduce((acc, data) => acc + data.income, 0)
                    .toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                🏆 Tus Servicios Más Populares
              </h3>
              <p className="text-gray-500 mt-1">
                Los que más eligen tus clientes
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {[...topServices]
              .sort((a, b) => b.bookings - a.bookings)
              .slice(0, 5)
              .map((service, index) => {
                const maxServiceBookings = Math.max(
                  ...topServices.map((s) => s.bookings),
                  1
                );
                const percentage = Math.round(
                  (service.bookings / maxServiceBookings) * 100
                );

                return (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">
                            {service.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {service.bookings} citas • $
                            {service.revenue.toLocaleString()} ganados
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">
                          {percentage}%
                        </div>
                        <div className="text-xs text-gray-500">popularidad</div>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${percentage / 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
