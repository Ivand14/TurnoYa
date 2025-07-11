import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Business } from "@/types";
import { MapPin, Star, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface BusinessCardProps {
  business: Business;
  onClick?: () => void;
}

const getBusinessTypeLabel = (type: string) => {
  switch (type) {
    case "barbershop":
      return "Barbería";
    case "beauty":
      return "Centro de Belleza";
    case "sports":
      return "Centro Deportivo";
    default:
      return "Negocio";
  }
};

const getBusinessTypeInfo = (type: string) => {
  switch (type) {
    case "barbershop":
      return {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        gradient: "from-blue-500 to-cyan-500",
        bgGradient: "from-blue-50 to-cyan-50",
      };
    case "beauty":
      return {
        color: "bg-pink-100 text-pink-800 border-pink-200",
        gradient: "from-pink-500 to-rose-500",
        bgGradient: "from-pink-50 to-rose-50",
      };
    case "sports":
      return {
        color: "bg-green-100 text-green-800 border-green-200",
        gradient: "from-green-500 to-emerald-500",
        bgGradient: "from-green-50 to-emerald-50",
      };
    default:
      return {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        gradient: "from-gray-500 to-slate-500",
        bgGradient: "from-gray-50 to-slate-50",
      };
  }
};

export const BusinessCard = ({ business, onClick }: BusinessCardProps) => {
  const businessType = getBusinessTypeInfo(business.company_type);

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card
        className="overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-pointer border-0 shadow-lg bg-white group relative"
        onClick={onClick}
        key={business.id}
      >
        {/* Gradient Background Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${businessType.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        />

        {/* Decorative Corner Element */}
        <div
          className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${businessType.gradient} opacity-10 rounded-bl-full`}
        />

        <CardHeader className="p-6 pb-4 relative z-10">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              {/* Logo with enhanced styling */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white shadow-lg border-2 border-white group-hover:shadow-xl transition-all duration-300">
                  {business.logo ? (
                    <img
                      src={business.logo}
                      alt={business.company_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${businessType.gradient} flex items-center justify-center`}
                    >
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
                {/* Online indicator */}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-sm">
                  <div className="w-full h-full bg-green-400 rounded-full animate-pulse" />
                </div>
              </motion.div>

              <div className="flex-1">
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-200 mb-1">
                  {business.company_name}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 font-medium">
                  {business.email}
                </CardDescription>

                {/* Rating */}
                {/* <div className="flex items-center mt-2 gap-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < 4
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div> 
                  <span className="text-xs text-gray-500 ml-1">4.8 (124)</span>
                </div> */}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <Badge
                className={`${businessType.color} border px-3 py-1 text-xs font-semibold shadow-sm`}
              >
                {getBusinessTypeLabel(business.company_type)}
              </Badge>

              {/* Arrow indicator */}
              <motion.div
                className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center group-hover:bg-indigo-600 transition-all duration-300"
                whileHover={{ rotate: 45 }}
              >
                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors duration-300" />
              </motion.div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-2 relative z-10">
          {/* Description */}
          <p className="text-sm text-gray-700 leading-relaxed mb-4 line-clamp-2 group-hover:text-gray-800 transition-colors duration-200">
            {business.description}
          </p>

          {/* Address and additional info */}
          <div className="space-y-2">
            {business.address && (
              <div className="flex items-center text-xs text-gray-600 group-hover:text-gray-700 transition-colors duration-200">
                <MapPin className="w-4 h-4 mr-2 text-indigo-600 flex-shrink-0" />
                <span className="truncate">{business.address}</span>
              </div>
            )}

            {/* Status indicator */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                <span className="text-green-700 font-medium">
                  Disponible ahora
                </span>
              </div>

              {/* <div className="text-xs text-gray-500">Desde $25</div> */}
            </div>
          </div>

          {/* Hover overlay with call-to-action */}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </CardContent>
      </Card>
    </motion.div>
  );
};
