import {} from "@/context/login.state";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Building2, Sparkles, CheckCircle, CreditCard } from "lucide-react";
import { Form } from "@/components/ui/form";
import { useEffect, useState } from "react";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { BusinessInfoForm } from "@/components/RegisterBusinessComponents/BusinessInfoForm";
import { PaymentPlanForm } from "@/components/RegisterBusinessComponents/PaymentPlanForm";
import { cn } from "@/lib/utils";
import { register_business } from "@/apis/business_apis";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BusinessFormValues } from "@/types/business";

// Define the form schema with logo and subscription
const businessSchema = z
  .object({
    businessName: z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres"),
    ownerName: z.string().min(2, "El nombre del propietario es requerido"),
    email: z.string().email("Por favor ingresa un email válido"),
    phone: z.string().min(8, "Por favor ingresa un número de teléfono válido"),
    address: z.string().min(5, "La dirección es requerida"),
    businessType: z.string().min(2, "El tipo de negocio es requerido"),
    description: z.string(),
    logo_url: z.string().url().optional(),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
    subscriptionPlan: z
      .string()
      .min(1, "Debes seleccionar un plan de suscripción"),
    preapproval_id: z.string(),
  })
  .refine((data) => !data.password || data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

// Type will be imported from types/business.ts

const RegisterBusiness = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const preapproval_id = params.get("preapproval_id");

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      businessName: "",
      ownerName: "",
      email: "",
      phone: "",
      address: "",
      businessType: "",
      description: "",
      logo_url: "",
      password: "",
      confirmPassword: "",
      subscriptionPlan: "",
      preapproval_id: "",
    },
  });

  useEffect(() => {
    const raw = localStorage.getItem("businessRegisterPending");

    if (!raw) return;

    let companyParsed: Partial<BusinessFormValues> | null = null;

    try {
      companyParsed = JSON.parse(raw);
    } catch (error) {
      console.error("❌ Error al parsear businessRegisterPending:", error);
      return;
    }

    if (!companyParsed || typeof companyParsed !== "object") return;

    // Setear campos en el formulario
    Object.entries(companyParsed).forEach(([key, value]) => {
      if (key in form.getValues()) {
        form.setValue(key as keyof BusinessFormValues, value);
      }
    });

    // Si tenemos el preapproval_id y los datos están completos, enviar el formulario
    if (preapproval_id) {
      form.setValue("preapproval_id", preapproval_id);


      // Asegurarse que tiene los campos requeridos
      const requiredFields = ["businessName", "email", "subscriptionPlan", "ownerName", "phone", "address", "businessType", "logo_url", "password", "confirmPassword", "preapproval_id"];
      const isReady = requiredFields.every((field) =>
        form.getValues(field as keyof BusinessFormValues)
      );

      if (isReady) {
        form.handleSubmit(onSubmit)();
      }
    }
  }, [preapproval_id, form]);

  const onSubmit = async (values: BusinessFormValues) => {
    setIsSubmitting(true);
    try {
      // Include subscription plan in the registration
      const response = await register_business(
        values.businessName,
        values.ownerName,
        values.email,
        values.phone,
        values.address,
        values.businessType,
        values.description,
        values.logo_url,
        values.password,
        values.subscriptionPlan,
        values.preapproval_id
      );

      if (response.status === 200) {
        toast.success("¡Negocio registrado correctamente!");
        localStorage.removeItem("businessRegisterPending");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else if (
        response.details ===
        "The user with the provided email already exists (EMAIL_EXISTS)."
      ) {
        toast.error("Error al registrar el negocio. Correo electrónico en uso");
      }
    } catch (error) {
      toast.error(
        "Error al registrar el negocio. Por favor intenta nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentStep(2);
  };


  const prevStep = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentStep(1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <main className="flex-grow">
        <div className="container mx-auto py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12">
            <Navbar />
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-lg mt-16 sm:mt-20">
              <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Registra tu Negocio
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
              Únete a miles de negocios que ya confían en UTurns para gestionar
              sus reservas
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-6 sm:mb-8">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-300",
                    currentStep >= 1
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-300 text-gray-400"
                  )}
                >
                  <span className="font-semibold text-sm sm:text-base">1</span>
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-600 hidden sm:block">
                  Información del Negocio
                </div>
                <div className="text-xs font-medium text-gray-600 sm:hidden">
                  Información
                </div>
                <div
                  className={cn(
                    "w-8 sm:w-16 h-0.5 transition-all duration-300",
                    currentStep >= 2 ? "bg-blue-600" : "bg-gray-300"
                  )}
                ></div>
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-300",
                    currentStep >= 2
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-300 text-gray-400"
                  )}
                >
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-600 hidden sm:block">
                  Plan de Suscripción
                </div>
                <div className="text-xs font-medium text-gray-600 sm:hidden">
                  Plan
                </div>
              </div>
            </div>

            {/* Benefits Alert */}
            <Alert className="mb-6 sm:mb-8 border-blue-200 bg-blue-50/50 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <AlertTitle className="text-blue-900 font-semibold text-sm sm:text-base">
                ¡Bienvenido a UTurns!
              </AlertTitle>
              <AlertDescription className="text-blue-800 text-sm">
                Al registrar tu negocio, podrás gestionar reservas, administrar
                horarios y recibir pagos en línea. El proceso de verificación
                toma hasta 24 horas.
              </AlertDescription>
            </Alert>

            {/* Main Form Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border-0 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 sm:p-8 text-white">
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                  {currentStep === 1
                    ? "Información del Negocio"
                    : "Selecciona tu Plan"}
                </h2>
                <p className="text-blue-100 text-sm sm:text-base">
                  {currentStep === 1
                    ? "Completa todos los campos para crear tu cuenta empresarial"
                    : "Elige el plan que mejor se adapte a tu negocio"}
                </p>
              </div>

              <div className="p-4 sm:p-6 lg:p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    {currentStep === 1 ? (
                      <BusinessInfoForm form={form} onNext={nextStep} />
                    ) : (
                      <PaymentPlanForm
                        form={form}
                        onPrev={prevStep}
                        onSubmit={() => form.handleSubmit(onSubmit)()}
                        isSubmitting={isSubmitting}
                      />
                    )}

                    {/* Additional Info */}
                    <div className="bg-blue-50 rounded-xl p-4 sm:p-6 text-center mt-6 sm:mt-8">
                      <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2 text-blue-600" />
                        Al registrar tu negocio, aceptas nuestros términos de
                        servicio y política de privacidad. Recibirás un email de
                        confirmación una vez completado el proceso.
                      </p>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterBusiness;
