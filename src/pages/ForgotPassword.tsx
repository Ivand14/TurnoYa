import {  } from "@/context/login.state";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { recoverPass } from "@/apis/forgot_pass";
import { toast } from "sonner";
import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Por favor ingrese su email");
      return;
    }

    try {
      setLoading(true);
      await recoverPass(email);
      setEmailSent(true);
      toast.success(
        "Se ha enviado un email con instrucciones para restablecer su contraseña"
      );
    } catch (error) {
      toast.error(
        "No se pudo procesar su solicitud. Por favor intente nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-12 px-4 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Recuperar Contraseña</CardTitle>
            <CardDescription>
              {!emailSent
                ? "Ingrese su correo electrónico para restablecer su contraseña"
                : "Revise su correo electrónico para seguir las instrucciones"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!emailSent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Enviando..." : "Enviar instrucciones"}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Hemos enviado un correo electrónico a <strong>{email}</strong>{" "}
                  con instrucciones para restablecer su contraseña.
                </p>
                <p className="text-sm text-gray-600">
                  Si no recibe el correo electrónico en unos minutos, verifique
                  su carpeta de spam o intente nuevamente.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setEmailSent(false)}
                >
                  Volver a intentar
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              ¿Recordó su contraseña?{" "}
              <Link
                to="/login"
                className="text-booking-primary hover:underline"
              >
                Iniciar sesión
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default ForgotPassword;
