import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target: string;
}

interface OnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
}

const Onboarding: React.FC<OnboardingProps> = ({
  isOpen,
  onClose,
  isCollapsed,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const steps: OnboardingStep[] = [
    {
      id: "resume",
      title: "Dashboard",
      description:
        "Aquí puedes ver un resumen general de tu negocio,métricas importantes y buscar reservas por filtros.",
      target: "resume",
    },
    {
      id: "booking",
      title: "Reservas",
      description:
        "Gestiona todas las reservas de tus clientes y confirma citas.",
      target: "booking",
    },
    {
      id: "employees",
      title: "Empleados",
      description: "Aca podes crear los empleados que tengas en tu negocio.",
      target: "employees",
    },
    {
      id: "statistics",
      title: "Estadísticas",
      description: "Analiza el rendimiento con gráficos y reportes detallados.",
      target: "statistics",
    },
    {
      id: "schedules",
      title: "Horarios",
      description:
        "Define los horarios de trabajo y disponibilidad de servicios.",
      target: "schedules",
    },
    {
      id: "service",
      title: "Servicios",
      description:
        "Crea y administra los servicios que ofreces con sus precios. RECORDA agregar la cantidad de turnos o si los turnos se definen por la cantidad de empleados.",
      target: "service",
    },
    {
      id: "wallet",
      title: "Pagos",
      description: "Conecta tu cuenta de mercado pago, para poder recibir el dinero de las reservas.",
      target: "wallet",
    },
    {
      id: "configuracion",
      title: "Configuración",
      description:
        "Cualquier cambio que quieras hacer en tu cuenta lo haces aca.",
      target: "configuracion",
    },
  ];

  const currentStepData = steps[currentStep];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateTooltipPosition = () => {
    const targetElement = document.querySelector(
      `[data-onboarding-target="${currentStepData.target}"]`
    );
    if (targetElement && tooltipRef.current) {
      const targetRect = targetElement.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      // Position to the right of the button
      const left = targetRect.right + 20;
      const top =
        targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;

      // Adjust if tooltip goes off screen
      const adjustedLeft = Math.min(
        left,
        window.innerWidth - tooltipRect.width - 20
      );
      const adjustedTop = Math.max(
        20,
        Math.min(top, window.innerHeight - tooltipRect.height - 20)
      );

      setTooltipPosition({
        left: adjustedLeft,
        top: adjustedTop,
      });
    }
  };

  useEffect(() => {
    if (isOpen && currentStepData) {
      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => {
        updateTooltipPosition();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [currentStep, isOpen, currentStepData, isCollapsed]);

  useEffect(() => {
    if (isOpen) {
      const handleResize = () => updateTooltipPosition();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-30 z-[100]" />

      {/* Highlight the current button */}
      <style>
        {`
          [data-onboarding-target="${currentStepData.target}"] {
            position: relative;
            z-index: 101;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.6);
            border-radius: 0.75rem;
          }
        `}
      </style>

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[102] bg-white rounded-lg shadow-2xl border border-gray-200 p-4 max-w-xs"
        style={{
          left: `${tooltipPosition.left}px`,
          top: `${tooltipPosition.top}px`,
        }}
      >
        {/* Arrow pointing to the button */}
        <div className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2">
          <div className="w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white"></div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {currentStep + 1}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {currentStep + 1} de {steps.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-1">
            {currentStepData.title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {currentStepData.description}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={isFirstStep}
            className={cn(
              "flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm transition-colors",
              isFirstStep
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <div className="flex space-x-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  index === currentStep
                    ? "bg-blue-500"
                    : index < currentStep
                    ? "bg-green-500"
                    : "bg-gray-300"
                )}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            className="flex items-center space-x-1 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
          >
            <span>{isLastStep ? "Finalizar" : "Siguiente"}</span>
            {!isLastStep && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </>
  );
};

export default Onboarding;
