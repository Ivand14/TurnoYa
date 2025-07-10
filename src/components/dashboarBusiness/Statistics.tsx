import React from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Clock,
  Star,
  Target,
} from "lucide-react";

const Statistics: React.FC = () => {
  const monthlyData = [
    { month: "Ene", reservas: 45, ingresos: 4500 },
    { month: "Feb", reservas: 52, ingresos: 5200 },
    { month: "Mar", reservas: 48, ingresos: 4800 },
    { month: "Abr", reservas: 61, ingresos: 6100 },
    { month: "May", reservas: 55, ingresos: 5500 },
    { month: "Jun", reservas: 67, ingresos: 6700 },
    { month: "Jul", reservas: 73, ingresos: 7300 },
    { month: "Ago", reservas: 69, ingresos: 6900 },
    { month: "Sep", reservas: 78, ingresos: 7800 },
    { month: "Oct", reservas: 82, ingresos: 8200 },
    { month: "Nov", reservas: 87, ingresos: 8700 },
    { month: "Dec", reservas: 92, ingresos: 9200 },
  ];

  const maxReservas = Math.max(...monthlyData.map((d) => d.reservas));
  const maxIngresos = Math.max(...monthlyData.map((d) => d.ingresos));

  const topServices = [
    { name: "Consulta Médica", bookings: 145, revenue: 14500 },
    { name: "Limpieza Dental", bookings: 98, revenue: 9800 },
    { name: "Terapia Física", bookings: 87, revenue: 8700 },
    { name: "Masaje Terapéutico", bookings: 76, revenue: 7600 },
    { name: "Consulta Nutrición", bookings: 63, revenue: 6300 },
  ];

  const performanceMetrics = [
    {
      title: "Satisfacción Cliente",
      value: "4.8/5",
      icon: Star,
      color: "text-yellow-500",
    },
    {
      title: "Tasa de Cancelación",
      value: "5.2%",
      icon: Calendar,
      color: "text-red-500",
    },
    {
      title: "Tiempo Promedio",
      value: "45 min",
      icon: Clock,
      color: "text-blue-500",
    },
    {
      title: "Clientes Recurrentes",
      value: "78%",
      icon: Users,
      color: "text-green-500",
    },
  ];

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
                        width: `${(data.reservas / maxReservas) * 100}%`,
                      }}
                    >
                      <span className="text-white text-xs font-medium">
                        {data.reservas}
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
                        width: `${(data.ingresos / maxIngresos) * 100}%`,
                      }}
                    >
                      <span className="text-white text-xs font-medium">
                        ${data.ingresos}
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
                {topServices.map((service, index) => (
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
