import React from "react";
import { Shield, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import PricingCards from "../pricingCards";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

interface SubscriptionSelectorProps {
  selectedPlan: string;
  onPlanSelect: (planId: string) => void;
  className?: string;
}

export const SubscriptionSelector: React.FC<SubscriptionSelectorProps> = ({
  selectedPlan,
  onPlanSelect,
  className,
}) => {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Elige tu Plan de Suscripción
        </h3>
        <p className="text-gray-600">
          Selecciona el plan que mejor se adapte a las necesidades de tu negocio
        </p>
      </div>

      {/* Plans Grid */}
      <div>
        <PricingCards onPlanSelect={onPlanSelect} selectedPlan={selectedPlan} />
      </div>

      {/* Additional Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              ¿No estás seguro qué plan elegir?
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              Puedes comenzar con el plan Básico gratuito y actualizar en
              cualquier momento. Todos los planes incluyen migración gratuita de
              datos y soporte durante la configuración inicial.
            </p>
          </div>
        </div>
      </div>

      {/* Money Back Guarantee */}
      <div className="text-center">
        <div className="inline-flex items-center px-4 py-2 bg-green-50 rounded-full border border-green-200">
          <Shield className="w-4 h-4 text-green-600 mr-2" />
          <span className="text-sm font-medium text-green-800">
            Garantía de devolución de 30 días
          </span>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSelector;
