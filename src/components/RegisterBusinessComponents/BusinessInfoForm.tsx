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
  CheckCircle,
} from "lucide-react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { uploadLogoFile } from "@/utils/uploadFile";
import { BusinessFormValues } from "@/types/business";

const businessTypes = [
  { id: "barbershop", label: "Barbería", icon: "✂️" },
  { id: "beauty", label: "Centro de Belleza", icon: "💄" },
  { id: "sports", label: "Centro Deportivo", icon: "🏋️" },
  { id: "health", label: "Centro de Salud", icon: "🏥" },
  { id: "restaurant", label: "Restaurante", icon: "🍽️" },
  { id: "other", label: "Otro", icon: "🏢" },
];

interface BusinessInfoFormProps {
  form: UseFormReturn<BusinessFormValues>;
  onNext: () => void;
}

export const BusinessInfoForm = ({ form, onNext }: BusinessInfoFormProps) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(
    form.getValues("logo_url") || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


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

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Logo Upload Section */}
      <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
        <FormField
          control={form.control}
          name="logo_url"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center">
              <FormLabel className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Logo del Negocio
              </FormLabel>
              <FormControl>
                <div className="flex flex-col items-center gap-4 sm:gap-6 w-full">
                  <div
                    className={cn(
                      "cursor-pointer w-32 h-32 sm:w-40 sm:h-40 rounded-2xl border-2 border-dashed transition-all duration-300 flex items-center justify-center overflow-hidden hover:border-blue-400 hover:bg-blue-50/50",
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
                      <div className="flex flex-col items-center p-4 sm:p-6">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                          <Image className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-600 text-center">
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
                    className="w-full sm:w-auto border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {logoPreview ? "Cambiar logo" : "Subir logo"}
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
                className="h-11 sm:h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Owner and Email */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
                  className="h-11 sm:h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
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
                  className="h-11 sm:h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Password Fields */}
      <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
          Configuración de Seguridad
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      className="h-11 sm:h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 pr-12"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
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
                  Usa una contraseña segura con al menos 6 caracteres
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
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repite tu contraseña"
                      className="h-11 sm:h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 pr-12"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
                  className="h-11 sm:h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
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
                  className="flex h-11 sm:h-12 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus:border-blue-500 transition-all duration-200"
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
                className="h-11 sm:h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
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
                className="min-h-24 sm:min-h-32 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 resize-none"
                {...field}
              />
            </FormControl>
            <FormDescription className="text-gray-600">
              Esta descripción aparecerá en tu perfil público y ayudará a los
              clientes a conocer mejor tu negocio.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Next Button */}
      <div className="pt-4 sm:pt-6">
        <Button
          type="button"
          onClick={onNext}
          className="w-full h-12 sm:h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
        >
          Continuar al Plan de Suscripción
        </Button>
      </div>
    </div>
  );
};
