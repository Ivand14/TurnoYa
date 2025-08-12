import React from "react";
import { Check, X, Clock, Shield, HeadphonesIcon, Lock } from "lucide-react";
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
  const navigate = useNavigate();
  const pathname = window.location.pathname;

  console.log(pathname);

  const plans = [
    {
      name: "Básico",
      description: "Perfecto para pequeños negocios que inician",
      monthlyPrice: 15,
      features: [
        "Citas ilimitadas",
        "Elegi el porcentaje de adelanto que quieras",
        "Calendario avanzado",
        "Soporte básico",
        "Integración en un solo click con mercado pago reduciendo perdidas de dinero",
        "Reportes básicos",
        "Bloquea los dias que no quieras recibir reservas",
        "Filtros de reservas",
        "Personaliza tu perfil de negocio",
        "Bloqueo de turnos por alta demanda",
      ],
      ctaText: "Probar 7 días gratis",
      ctaVariant: "secondary",
      free_trial: 7,
      isAvailable: true,
    },
    {
      name: "Profesional",
      description: "Ideal para negocios en crecimiento",
      monthlyPrice: 20000,
      features: [
        "Incluye todo lo anterior",
        "🔁 Automatizaciones con IA",
        "🤖 Integración con bots o WhatsApp",
        "📈 Recomendaciones inteligentes de agenda",
        "📨 Respuestas automáticas por WhatsApp",
        "⏱ Confirmación y recordatorios automáticos",
        "📊 Reportes automáticos semanales",
        "⚠️ Bloqueo de turnos por alta demanda",
        "📝 Encuestas post-turno con análisis",
      ],

      ctaText: "Próximamente",
      ctaVariant: "disabled",
      free_trial: 0,
      isAvailable: false,
    },
  ];

  const handleSubscription = async (plan: (typeof plans)[0]) => {
    if (!plan.isAvailable) return;
    onPlanSelect?.(plan.name);
    localStorage.setItem(
      "businessRegisterPending",
      JSON.stringify({ ...businessRegister, subscriptionPlan: plan.name })
    );
    await subscription([
      {
        amount: plan.monthlyPrice,
        reason: plan.name,
        free_trial: plan.free_trial,
        payer_email: businessRegister.email,
        pathname,
      },
    ]);
  };

  return (
    <div className="min-h-screen">
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        {/* <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Planes para cada etapa de tu negocio
          </h2>
          <p className="text-xl text-gray-600">
            Comienza gratis y escala según creces
          </p>
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 ${
                plan.isAvailable
                  ? "cursor-pointer hover:scale-105"
                  : "opacity-70 cursor-not-allowed"
              } ${
                selectedPlan === plan.name && plan.isAvailable
                  ? "ring-2 ring-blue-500 scale-105"
                  : ""
              }`}
              onClick={() => handleSubscription(plan)}
            >
              {!plan.isAvailable && (
                <div className="absolute top-4 right-4">
                  <span className="bg-yellow-200 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">
                    Próximamente
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                {plan.name}
              </h3>
              <p className="text-gray-600 mb-6 text-center">
                {plan.description}
              </p>

              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  ${plan.monthlyPrice}
                </span>
                <span className="text-gray-500 text-sm ml-2">ARS/mes</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((text, i) => (
                  <li key={i} className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    {text}
                  </li>
                ))}
              </ul>

              <button
                disabled={!plan.isAvailable}
                className={`w-full py-3 rounded-xl font-semibold transition ${
                  plan.isAvailable
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {plan.ctaText}
              </button>
            </div>
          ))}
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
