import { BusinessType } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";

import { BusinessCard } from "@/components/BusinessCard";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { useBusinessContext } from "@/context/apisContext/businessContext";
import Loading from "@/components/loading";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  MapPin, 
  Building2, 
  Sparkles, 
  TrendingUp,
  Users,
  Star,
  RefreshCw,
  Grid3X3,
  List
} from "lucide-react";

const BusinessesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<BusinessType | "all">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const navigate = useNavigate();
  const { allBusinesses, loading, error, fetchAllBusinesses } = useBusinessContext();

  useEffect(() => {
    fetchAllBusinesses();
  }, []);

  const filteredBusinesses = useMemo(() => {
    return allBusinesses?.filter((business) => {
      if (selectedType !== "all" && business.company_type !== selectedType) {
        return false;
      }

      if (
        searchTerm &&
        !business.company_name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [searchTerm, selectedType, allBusinesses]);

  const getBusinessTypeInfo = (type: string) => {
    const types = {
      barbershop: {
        label: "Barberías",
        count: allBusinesses?.filter(b => b.company_type === "barbershop").length || 0,
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-blue-50",
        textColor: "text-blue-700"
      },
      beauty: {
        label: "Centros de Belleza",
        count: allBusinesses?.filter(b => b.company_type === "beauty").length || 0,
        color: "from-pink-500 to-rose-500",
        bgColor: "bg-pink-50",
        textColor: "text-pink-700"
      },
      sports: {
        label: "Centros Deportivos",
        count: allBusinesses?.filter(b => b.company_type === "sports").length || 0,
        color: "from-green-500 to-emerald-500",
        bgColor: "bg-green-50",
        textColor: "text-green-700"
      },
      other: {
        label: "Otros",
        count: allBusinesses?.filter(b => b.company_type === "other").length || 0,
        color: "from-purple-500 to-indigo-500",
        bgColor: "bg-purple-50",
        textColor: "text-purple-700"
      }
    };
    return types[type] || types.other;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
        
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-20 blur-xl"
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-20 blur-xl"
            animate={{
              y: [0, 20, 0],
              x: [0, -10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="relative container mx-auto px-6 py-20">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-sm font-medium mb-6">
              <Building2 className="w-4 h-4 mr-2" />
              Descubre negocios increíbles
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Encuentra tu
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Negocio Ideal
              </span>
            </h1>

            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Explora una amplia variedad de negocios y reserva tu cita de manera fácil y rápida
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {allBusinesses?.length || 0}+
                </div>
                <div className="text-blue-200 text-sm">Negocios Registrados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-blue-200 text-sm">Disponibilidad</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">98%</div>
                <div className="text-blue-200 text-sm">Satisfacción</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-6 py-12">
        {/* Filtros Mejorados */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mr-4">
              <Filter className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Filtros de Búsqueda</h2>
              <p className="text-gray-600">Encuentra exactamente lo que buscas</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Búsqueda */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Search className="w-4 h-4 inline mr-2" />
                Buscar por nombre
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Escribe el nombre del negocio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 text-lg"
                />
              </div>
            </div>

            {/* Tipo de negocio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Building2 className="w-4 h-4 inline mr-2" />
                Tipo de negocio
              </label>
              <Select
                value={selectedType}
                onValueChange={(value) =>
                  setSelectedType(value as BusinessType | "all")
                }
              >
                <SelectTrigger className="h-14 rounded-xl border-2 border-gray-200 focus:border-indigo-500 text-lg">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="barbershop">Barberías</SelectItem>
                  <SelectItem value="beauty">Centros de Belleza</SelectItem>
                  <SelectItem value="sports">Centros Deportivos</SelectItem>
                  <SelectItem value="other">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Limpiar filtros</span>
              </Button>
              
              <div className="text-sm text-gray-500">
                {filteredBusinesses?.length || 0} resultados encontrados
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="px-3 py-2"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="px-3 py-2"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Categorías rápidas */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Categorías Populares</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries({
              barbershop: "barbershop",
              beauty: "beauty", 
              sports: "sports",
              other: "other"
            }).map(([key, type]) => {
              const info = getBusinessTypeInfo(type);
              return (
                <motion.button
                  key={key}
                  onClick={() => setSelectedType(type as BusinessType)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                    selectedType === type 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${info.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-sm font-semibold text-gray-900 mb-1">
                    {info.label}
                  </div>
                  <div className="text-xs text-gray-500">
                    {info.count} disponibles
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Listado de negocios */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loading />
              <p className="text-gray-600 mt-4 text-lg">
                Cargando negocios increíbles...
              </p>
            </motion.div>
          ) : error ? (
            <motion.div 
              className="text-center py-20 bg-white rounded-2xl shadow-lg border border-red-200"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar</h3>
              <p className="text-red-600 mb-6">Error: {error}</p>
              <Button onClick={() => fetchAllBusinesses()} className="bg-red-600 hover:bg-red-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reintentar
              </Button>
            </motion.div>
          ) : filteredBusinesses && filteredBusinesses.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900">
                  Negocios Disponibles
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <TrendingUp className="w-4 h-4" />
                  <span>Ordenados por popularidad</span>
                </div>
              </div>

              <div className={`grid gap-8 ${
                viewMode === "grid" 
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              }`}>
                {filteredBusinesses.map((business, index) => (
                  <motion.div
                    key={business.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <BusinessCard
                      business={business}
                      onClick={() => navigate(`/business/${business.id}`)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-20 bg-white rounded-2xl shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                No se encontraron negocios
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                No hay negocios que coincidan con los filtros seleccionados. 
                Intenta ajustar tu búsqueda.
              </p>
              <Button
                onClick={clearFilters}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Limpiar filtros
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>

  );
};

export default BusinessesPage;