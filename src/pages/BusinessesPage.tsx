import { Business, BusinessType } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useEffect, useMemo, useReducer, useState } from "react";

import { BusinessCard } from "@/components/BusinessCard";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { compnay_logged } from "@/context/current_company";
import { getAllBusiness } from "@/apis/business_apis";
import { mockBusinesses } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

const BusinessesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<BusinessType | "all">("all");
  const navigate = useNavigate();

  const [business, setBusiness] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Indicar que la carga ha comenzado
        const responseBusiness = await getAllBusiness();
        const data = responseBusiness.data.data;
        setBusiness(data);
      } catch (error) {
        console.error("Error fetching business:", error);
        setBusiness([]); // Asignar array vacío en caso de error
      } finally {
        setLoading(false); // Termina la carga
      }
    };
    fetchData();
  }, []);

  // Filtrar negocios según búsqueda y tipo
  const filteredBusinesses = useMemo(() => {
    return business.filter((business) => {
      // Filtro por tipo
      if (selectedType !== "all" && business.company_type !== selectedType) {
        return false;
      }

      // Filtro por término de búsqueda
      if (
        searchTerm &&
        !business.company_name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [searchTerm, selectedType,business]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Negocios</h1>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select
                value={selectedType}
                onValueChange={(value) =>
                  setSelectedType(value as BusinessType | "all")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filtrar por tipo" />
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
        </div>

        {/* Listado de negocios */}
        {loading ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-4">Cargando negocios...</p>
          </div>
        ) : filteredBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                onClick={() => navigate(`/business/${business.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-4">
              No se encontraron negocios con los filtros seleccionados
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedType("all");
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BusinessesPage;
