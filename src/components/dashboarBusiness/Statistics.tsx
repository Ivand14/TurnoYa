import React, { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Target,
  CalendarCheck,
} from "lucide-react";
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

  const monthlyData: monthlyDataInt[] = [];

  const maxReservas = Math.max(...monthlyData.map((d) => d.booking));
  const maxIngresos = Math.max(...monthlyData.map((d) => d.income));

  const topServices: topServiceInt[] = [];

  const monthlyMetrics = () => {
    const now = new Date();
    const monthNumber = now.toLocaleString("es-ES", { month: "2-digit" });
    const month = now.toLocaleDateString("es-ES", { month: "long" });

    const bookingMonth = booking.filter(
      (bk) => bk.date.split("-")[1] === monthNumber
    );

    const income = bookingMonth.reduce((acc, bk) => acc + bk.price, 0);

    return {
      month,
      booking: bookingMonth.length,
      income,
    };
  };

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
    return `${Math.round((recurringCount / totalClients) * 100)}%`;
  };

  const assistProm = () => {
    const bookCompleted = booking.reduce((acc: Record<string, number>, bk) => {
      acc[bk.status] = (acc[bk.status] ?? 0) + 1;
      return acc;
    }, {});

    const quantityCompleted = bookCompleted["completed"] ?? 0;
    const quantityConfirmed = bookCompleted["confirmed"] ?? 0;

    if (quantityConfirmed === 0) return 0;

    return Math.min(
      100,
      Math.round(quantityCompleted / quantityConfirmed) * 100
    );
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
      value: `${recurringClients() || "0"}`,
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
  monthlyData.push(monthlyMetrics());
  topServiceMetrics();
  topServices.push(...topServiceMetrics());

  return (
    <div className="p-8 min-h-screen">
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
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
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
          {/* Monthly Reservations Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Reservas Mensuales
              </h3>
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-8 text-xs text-gray-600 font-medium">
                    {data.month}
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{
                        width: `${(data.booking / maxReservas) * 100}%`,
                      }}
                    >
                      <span className="text-white text-xs font-medium">
                        {data.booking}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Ingresos Mensuales
              </h3>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-8 text-xs text-gray-600 font-medium">
                    {data.month}
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{
                        width: `${(data.income / maxIngresos) * 100}%`,
                      }}
                    >
                      <span className="text-white text-xs font-medium">
                        ${data.income}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Servicios Más Populares
            </h3>
            <Target className="w-5 h-5 text-purple-500" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm font-medium text-gray-500 border-b">
                  <th className="pb-3">Servicio</th>
                  <th className="pb-3">Reservas</th>
                  <th className="pb-3">Ingresos</th>
                  <th className="pb-3">Popularidad</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[...topServices]
                  .sort((a, b) => b.bookings - a.bookings)
                  .map((service, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-medium text-xs">
                              {index + 1}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {service.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="text-gray-900 font-medium">
                          {service.bookings}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="text-green-600 font-medium">
                          ${service.revenue}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-100 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                              style={{
                                width: `${(service.bookings / 145) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">
                            {Math.round((service.bookings / 145) * 100)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
