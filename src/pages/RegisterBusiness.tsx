import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the form schema
const businessSchema = z.object({
  businessName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  ownerName: z.string().min(2, "El nombre del propietario es requerido"),
  email: z.string().email("Por favor ingresa un email válido"),
  phone: z.string().min(8, "Por favor ingresa un número de teléfono válido"),
  address: z.string().min(5, "La dirección es requerida"),
  businessType: z.string().min(2, "El tipo de negocio es requerido"),
  description: z.string().optional(),
});

const businessTypes = [
  { id: "barbershop", label: "Barbería" },
  { id: "beauty", label: "Centro de Belleza" },
  { id: "sports", label: "Centro Deportivo" },
  { id: "health", label: "Centro de Salud" },
  { id: "restaurant", label: "Restaurante" },
  { id: "other", label: "Otro" },
];

type BusinessFormValues = z.infer<typeof businessSchema>;

const RegisterBusiness = () => {
  const { currentUser, register } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      businessName: "",
      ownerName: currentUser?.name || "",
      email: currentUser?.email || "",
      phone: "",
      address: "",
      businessType: "",
      description: "",
    },
  });

  const onSubmit = async (values: BusinessFormValues) => {
    setIsSubmitting(true);
    try {
      // If user is not logged in, create an account
      if (!currentUser) {
        const password = Math.random().toString(36).substring(2, 10);
        await register(values.ownerName, values.email, password, "business");
        toast.success("Cuenta creada correctamente");
      }
      
      // In a real app, we would submit business details to the backend
      console.log("Business registration data:", values);
      
      toast.success("¡Negocio registrado correctamente!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error registering business:", error);
      toast.error("Error al registrar el negocio. Por favor intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar currentUser={currentUser} />

      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto py-10 px-4">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
            <h1 className="text-3xl font-bold mb-2">Registra tu Negocio</h1>
            <p className="text-gray-600 mb-6">
              Completa el formulario para comenzar a gestionar tus reservas con Turnify
            </p>

            <Alert className="mb-6">
              <AlertTitle>¡Bienvenido a Turnify!</AlertTitle>
              <AlertDescription>
                Al registrar tu negocio, podrás comenzar a gestionar tus reservas, 
                administrar horarios y recibir pagos en línea. El proceso de verificación 
                tomará hasta 24 horas.
              </AlertDescription>
            </Alert>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Negocio</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Barbería El Corte" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ownerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Propietario</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre completo" {...field} />
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="tu@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input placeholder="+54 11 1234 5678" {...field} />
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
                        <FormLabel>Tipo de Negocio</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            {...field}
                          >
                            <option value="" disabled>Selecciona un tipo</option>
                            {businessTypes.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input placeholder="Dirección completa del negocio" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción del Negocio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe brevemente tu negocio y los servicios que ofreces"
                          {...field}
                          className="min-h-28"
                        />
                      </FormControl>
                      <FormDescription>
                        Esta descripción se mostrará en tu perfil público.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Registrando..." : "Registrar Negocio"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterBusiness;