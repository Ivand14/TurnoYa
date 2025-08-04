import {} from "@/context/login.state";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  Image,
  Upload,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  Sparkles,
  CheckCircle,
  CreditCard,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useRef, useState } from "react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Textarea } from "@/components/ui/textarea";
import { SubscriptionSelector } from "@/components/subscriptions/SubscriptionSelector";
import { cn } from "@/lib/utils";
import { register_business } from "@/apis/business_apis";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadLogoFile } from "@/utils/uploadFile";

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
    // logo: z.instanceof(File).optional(),
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

const businessTypes = [
  { id: "barbershop", label: "Barbería", icon: "✂️" },
  { id: "beauty", label: "Centro de Belleza", icon: "💄" },
  { id: "sports", label: "Centro Deportivo", icon: "🏋️" },
  { id: "health", label: "Centro de Salud", icon: "🏥" },
  { id: "restaurant", label: "Restaurante", icon: "🍽️" },
  { id: "other", label: "Otro", icon: "🏢" },
];

type BusinessFormValues = z.infer<typeof businessSchema>;

const RegisterBusiness = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (!raw) {
      return;
    }

    try {
      const companyParsed = JSON.parse(raw);
      Object.entries(companyParsed).forEach(([key, value]: any) => {
        if (key !== "logo_url") {
          form.setValue(key as keyof BusinessFormValues, value);
        }
      });

      if (companyParsed.logo_url) {
        form.setValue("logo_url", companyParsed.logo_url);
        setLogoPreview(companyParsed.logo_url);
      }

      if (companyParsed.subscriptionPlan) {
        form.setValue("subscriptionPlan", companyParsed.subscriptionPlan);
      }

      if(preapproval_id) {
        form.setValue("preapproval_id", preapproval_id);
        form.handleSubmit(onSubmit)();
      }
    } catch (error) {
      console.error("❌ Error al parsear businessRegisterPending:", error);
    }
  }, [preapproval_id, form]);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const logoURL = await uploadLogoFile(file);
      form.setValue("logo_url", logoURL);
      setLogoPreview(logoURL);

      const currentValues = form.getValues();
      localStorage.setItem(
        "businessRegisterPending",
        JSON.stringify({
          ...currentValues,
          logo_url: logoURL,
        })
      );
    } catch (err) {
      toast.error("Error al subir el logo");
    }
  };

  const triggerLogoUpload = () => {
    fileInputRef.current?.click();
  };

  const handlePlanSelect = (planId: string) => {
    console.log(planId);
    form.setValue("subscriptionPlan", planId, { shouldValidate: true });
  };

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
        localStorage.removeItem("businessRegisterPending")
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
    setCurrentStep(2);
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const valuesForLocalStorage = form.getValues();

  console.log(form.getValues("businessType"));

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <main className="flex-grow">
        <div className="container mx-auto py-12 px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <Navbar />
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg mt-20">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Registra tu Negocio
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Únete a miles de negocios que ya confían en UTurns para gestionar
              sus reservas
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                    currentStep >= 1
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-300 text-gray-400"
                  )}
                >
                  <span className="font-semibold">1</span>
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Información del Negocio
                </div>
                <div
                  className={cn(
                    "w-16 h-0.5 transition-all duration-300",
                    currentStep >= 2 ? "bg-blue-600" : "bg-gray-300"
                  )}
                ></div>
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                    currentStep >= 2
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-300 text-gray-400"
                  )}
                >
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Plan de Suscripción
                </div>
              </div>
            </div>

            {/* Benefits Alert */}
            <Alert className="mb-8 border-blue-200 bg-blue-50/50 backdrop-blur-sm">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <AlertTitle className="text-blue-900 font-semibold">
                ¡Bienvenido a UTurns!
              </AlertTitle>
              <AlertDescription className="text-blue-800">
                Al registrar tu negocio, podrás gestionar reservas, administrar
                horarios y recibir pagos en línea. El proceso de verificación
                toma hasta 24 horas.
              </AlertDescription>
            </Alert>

            {/* Main Form Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border-0 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                <h2 className="text-2xl font-semibold mb-2">
                  {currentStep === 1
                    ? "Información del Negocio"
                    : "Selecciona tu Plan"}
                </h2>
                <p className="text-blue-100">
                  {currentStep === 1
                    ? "Completa todos los campos para crear tu cuenta empresarial"
                    : "Elige el plan que mejor se adapte a tu negocio"}
                </p>
              </div>

              <div className="p-8">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    {currentStep === 1 ? (
                      <>
                        {/* Logo Upload Section */}
                        <div className="bg-gray-50 rounded-xl p-6">
                          <FormField
                            control={form.control}
                            name="logo_url"
                            render={({ field }) => (
                              <FormItem className="flex flex-col items-center">
                                <FormLabel className="text-lg font-semibold text-gray-900 mb-4">
                                  Logo del Negocio
                                </FormLabel>
                                <FormControl>
                                  <div className="flex flex-col items-center gap-6">
                                    <div
                                      className={cn(
                                        "cursor-pointer w-40 h-40 rounded-2xl border-2 border-dashed transition-all duration-300 flex items-center justify-center overflow-hidden hover:border-blue-400 hover:bg-blue-50/50",
                                        logoPreview
                                          ? "border-blue-500 bg-blue-50 shadow-lg"
                                          : "border-gray-300 bg-white hover:shadow-md"
                                      )}
                                      onClick={triggerLogoUpload}
                                    >
                                      {logoPreview ? (
                                        <AspectRatio ratio={1}>
                                          <img
                                            src={logoPreview}
                                            alt="Logo preview"
                                            className="w-full h-full object-cover rounded-xl"
                                          />
                                        </AspectRatio>
                                      ) : (
                                        <div className="flex flex-col items-center p-6">
                                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <Image className="w-8 h-8 text-gray-400" />
                                          </div>
                                          <span className="text-sm font-medium text-gray-600 text-center">
                                            Haz clic para subir tu logo
                                          </span>
                                          <span className="text-xs text-gray-400 mt-1">
                                            PNG, JPG hasta 5MB
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      ref={fileInputRef}
                                      className="hidden"
                                      onChange={handleLogoChange}
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={triggerLogoUpload}
                                      className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                                    >
                                      <Upload className="mr-2 h-4 w-4" />
                                      {logoPreview
                                        ? "Cambiar logo"
                                        : "Subir logo"}
                                    </Button>
                                  </div>
                                </FormControl>
                                <FormDescription className="text-center text-gray-600 mt-2">
                                  Sube una imagen que represente tu negocio
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Business Name */}
                        <FormField
                          control={form.control}
                          name="businessName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-gray-700 flex items-center">
                                <Building2 className="w-4 h-4 mr-2 text-blue-600" />
                                Nombre del Negocio
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Ej: Barbería El Corte Premium"
                                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Owner and Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="ownerName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold text-gray-700 flex items-center">
                                  <User className="w-4 h-4 mr-2 text-blue-600" />
                                  Nombre del Propietario
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Nombre completo"
                                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold text-gray-700 flex items-center">
                                  <Mail className="w-4 h-4 mr-2 text-blue-600" />
                                  Email Empresarial
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="negocio@email.com"
                                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Password Fields */}
                        <div className="bg-gray-50 rounded-xl p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                            Configuración de Seguridad
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-semibold text-gray-700">
                                    Contraseña
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Input
                                        type={
                                          showPassword ? "text" : "password"
                                        }
                                        placeholder="Mínimo 6 caracteres"
                                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 pr-12"
                                        {...field}
                                      />
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                        onClick={() =>
                                          setShowPassword(!showPassword)
                                        }
                                      >
                                        {showPassword ? (
                                          <EyeOff className="h-4 w-4 text-gray-400" />
                                        ) : (
                                          <Eye className="h-4 w-4 text-gray-400" />
                                        )}
                                      </Button>
                                    </div>
                                  </FormControl>
                                  <FormDescription className="text-xs text-gray-500">
                                    Usa una contraseña segura con al menos 6
                                    caracteres
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-semibold text-gray-700">
                                    Confirmar Contraseña
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Input
                                        type={
                                          showConfirmPassword
                                            ? "text"
                                            : "password"
                                        }
                                        placeholder="Repite tu contraseña"
                                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 pr-12"
                                        {...field}
                                      />
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                        onClick={() =>
                                          setShowConfirmPassword(
                                            !showConfirmPassword
                                          )
                                        }
                                      >
                                        {showConfirmPassword ? (
                                          <EyeOff className="h-4 w-4 text-gray-400" />
                                        ) : (
                                          <Eye className="h-4 w-4 text-gray-400" />
                                        )}
                                      </Button>
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold text-gray-700 flex items-center">
                                  <Phone className="w-4 h-4 mr-2 text-blue-600" />
                                  Teléfono de Contacto
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="+54 11 1234 5678"
                                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="businessType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold text-gray-700 flex items-center">
                                  <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
                                  Tipo de Negocio
                                </FormLabel>
                                <FormControl>
                                  <select
                                    className="flex h-12 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus:border-blue-500 transition-all duration-200"
                                    {...field}
                                  >
                                    <option value="" disabled>
                                      Selecciona el tipo de negocio
                                    </option>
                                    {businessTypes.map((type) => (
                                      <option key={type.id} value={type.id}>
                                        {type.icon} {type.label}
                                      </option>
                                    ))}
                                  </select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Address */}
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-gray-700 flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                                Dirección del Negocio
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Calle, número, ciudad, código postal"
                                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Description */}
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-gray-700 flex items-center">
                                <FileText className="w-4 h-4 mr-2 text-blue-600" />
                                Descripción del Negocio
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe tu negocio, servicios que ofreces, horarios especiales, etc. Esta información será visible para tus clientes."
                                  className="min-h-32 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-gray-600">
                                Esta descripción aparecerá en tu perfil público
                                y ayudará a los clientes a conocer mejor tu
                                negocio.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Next Button */}
                        <div className="pt-6">
                          <Button
                            type="button"
                            onClick={nextStep}
                            className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                          >
                            Continuar al Plan de Suscripción
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Subscription Plan Selection */}
                        <FormField
                          control={form.control}
                          name="subscriptionPlan"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <SubscriptionSelector
                                  selectedPlan={field.value}
                                  onPlanSelect={handlePlanSelect}
                                  businessRegister={valuesForLocalStorage}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Navigation Buttons */}
                        <div className="flex gap-4 pt-6">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            className="flex-1 h-14 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold text-lg transition-all duration-300"
                          >
                            Volver
                          </Button>
                          <Button
                            type="submit"
                            className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <div className="flex items-center space-x-3">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Registrando tu negocio...</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <Building2 className="w-5 h-5" />
                                <span>Registrar Mi Negocio</span>
                              </div>
                            )}
                          </Button>
                        </div>
                      </>
                    )}

                    {/* Additional Info */}
                    <div className="bg-blue-50 rounded-xl p-6 text-center">
                      <p className="text-sm text-blue-800 leading-relaxed">
                        <CheckCircle className="w-4 h-4 inline mr-2 text-blue-600" />
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
