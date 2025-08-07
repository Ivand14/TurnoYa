import React, { useState } from "react";
import { Plus, List, Settings } from "lucide-react";
import ServiceForm from "@/components/dashboarBusiness/services/ServiceForm";
import ServiceList from "@/components/dashboarBusiness/services/ServiceList";
import { Employee } from "@/types/dashboard";
import { Service } from "@/types";

interface managmentProps {
  businessId: string;
  employees: Employee[];
  onSubmit: (service: Service) => void;
  services: Service[];
  onDelete: (serviceId: string) => void;
  onEdit: (data: Service, serviceId: string) => void;
}

const ServiceManagement: React.FC<managmentProps> = ({
  businessId,
  employees,
  onSubmit,
  services,
  onDelete,
  onEdit
}) => {
  const [activeTab, setActiveTab] = useState<"form" | "list">("form");

  const tabs = [
    {
      id: "form" as const,
      label: "Nuevo Servicio",
      icon: Plus,
      description: "Crear un nuevo servicio",
    },
    {
      id: "list" as const,
      label: "Mis Servicios",
      icon: List,
      description: `${services.length} servicio${
        services.length !== 1 ? "s" : ""
      } creado${services.length !== 1 ? "s" : ""}`,
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/25">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Gestión de Servicios
          </h1>
          <p className="text-gray-500 mt-2">
            Crea y administra los servicios de tu negocio
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 mb-8 max-w-md mx-auto">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Description */}
        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm">
            {tabs.find((tab) => tab.id === activeTab)?.description}
          </p>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">
          {activeTab === "form" && (
            <div className="animate-in fade-in-50 duration-300">
              <ServiceForm
                businessId={businessId}
                employees={employees}
                onSubmit={onSubmit}
              />
            </div>
          )}

          {activeTab === "list" && (
            <div className="animate-in fade-in-50 duration-300">
              <ServiceList
                services={services}
                onEdit={onEdit}
                onDelete={onDelete}
                employees={employees}
                // onCreateNew={() => setActiveTab("form")}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceManagement;
