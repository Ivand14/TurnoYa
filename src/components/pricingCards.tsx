import React, { useState } from "react";
import { Check, X, Clock, Shield, HeadphonesIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { subscription } from "@/apis/MercadoPagoApis/subscription";
import { businessRegister } from "@/types";

function PricingCards({
  onPlanSelect,
  selectedPlan,
  businessRegister,
}: {
  onPlanSelect?: (planId: string) => void;
  selectedPlan?: string;
  businessRegister: businessRegister;
}) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  );

  const plans = [
    {
      name: "Básico",
      description: "Perfecto para pequeños negocios que inician",
      monthlyPrice: 15000,
      popular: false,
      features: [
        { text: "Hasta 40 citas por mes", included: true },
        { text: "Gestión de hasta 2 empleados", included: true },
        { text: "Base de datos de clientes", included: true },
        {
          text: "Integración con mercado pago reduciendo perdidas de dinero",
          included: true,
        },
        { text: "Calendario básico", included: true },
        { text: "Soporte por email", included: false },
        { text: "Reportes avanzados", included: false },
      ],
      ctaText: "Probar 7 días gratis",
      ctaVariant: "secondary",
      free_trial: 7,
    },
    {
      name: "Profesional",
      description: "Ideal para negocios en crecimiento",
      monthlyPrice: 20000,
      popular: true,
      features: [
        { text: "Citas ilimitadas", included: true },
        { text: "Hasta 10 empleados", included: true },
        { text: "CRM completo de clientes", included: true },
        { text: "Recordatorios SMS y Email", included: true },
        { text: "Calendario avanzado", included: true },
        { text: "Soporte prioritario", included: true },
        { text: "Reportes y analytics", included: true },
        {
          text: "Integración con mercado pago reduciendo perdidas de dinero",
          included: true,
        },
      ],
      ctaText: "Probar 14 días gratis",
      ctaVariant: "primary",
      free_trial: 14,
    },
  ];

  const getPrice = (plan: (typeof plans)[0]) => {
    return plan.monthlyPrice;
  };

  const mercadoPagoSubscription = async (planName: string) => {
    localStorage.setItem(
      "businessRegisterPending",
      JSON.stringify(businessRegister)
    );
    onPlanSelect(planName);
    const filterPlan = plans
      .filter((plan) => plan.name === planName)
      .map((plan) => ({
        amount: plan.monthlyPrice,
        reason: plan.name,
        free_trial: plan.free_trial,
      }));
    await subscription(filterPlan);
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen ">
      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Planes para cada etapa de tu negocio
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Comienza gratis y escala según creces
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                  selectedPlan === plan.name
                    ? "ring-2 ring-blue-500 transform scale-105"
                    : "hover:transform hover:scale-105"
                }`}
                onClick={() => onPlanSelect(plan.name)}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Más Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    <div className="mb-2">
                      <span className="text-5xl font-bold text-gray-900">
                        ${getPrice(plan)}
                      </span>
                      <span className="text-gray-500 ml-2">
                        ARS/{billingCycle === "monthly" ? "mes" : "mes"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <div
                          className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                            feature.included
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {feature.included ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                        </div>
                        <span
                          className={`ml-3 text-sm ${
                            feature.included ? "text-gray-900" : "text-gray-500"
                          }`}
                        >
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => mercadoPagoSubscription(plan.name)}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                      plan.ctaVariant === "primary"
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200 border-2 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {plan.ctaText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                100% Seguro
              </h3>
              <p className="text-gray-600">
                Tus datos y los de tus clientes están protegidos
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <HeadphonesIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Soporte 24/7
              </h3>
              <p className="text-gray-600">
                Estamos aquí para ayudarte cuando lo necesites
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-purple-100 p-4 rounded-full mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Sin compromisos
              </h3>
              <p className="text-gray-600">
                Cancela cuando quieras, sin penalizaciones
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PricingCards;
