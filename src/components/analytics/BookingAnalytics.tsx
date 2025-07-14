import React from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { BookingAnalytics } from "@/types/bookings";


interface BookingAnalyticsProps {
  analytics: BookingAnalytics;
}

export const BookingAnalyticsCard: React.FC<BookingAnalyticsProps> = ({
  analytics,
}) => {
  return (
    <motion.div
      className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-2xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <BarChart3 className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Panel de Reservas</h1>
            <p className="text-slate-300">
              Gestión avanzada y análisis en tiempo real
            </p>
          </div>
        </div>

        {/* Quick Analytics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {analytics.total}
            </div>
            <div className="text-xs text-slate-300">Total</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {analytics.today}
            </div>
            <div className="text-xs text-slate-300">Hoy</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {analytics.thisWeek}
            </div>
            <div className="text-xs text-slate-300">Esta semana</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">
              {analytics.confirmed}
            </div>
            <div className="text-xs text-slate-300">Confirmadas</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
