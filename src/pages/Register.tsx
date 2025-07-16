import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { registro_usuario, singInWhithGoogle } from "@/apis/users_apis";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logged } from "@/context/logged";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import { useState } from "react";
import { Eye, EyeOff, Mail, User, Lock, Chrome } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { setIsLogged } = Logged();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Por favor complete todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);
      await registro_usuario(email, password, name);
      toast.success("Registro exitoso");
      navigate("/login");
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.details || "Error desconocido";
      const mensajeError =
        errorMessage === "User already registered"
          ? "Email ya está registrado"
          : errorMessage;
      toast.error(`Error al registrarse: ${mensajeError}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginGoogle = async () => {
    const loginGoogle = await singInWhithGoogle();
    console.log(loginGoogle);
    if (loginGoogle.success === true) {
      setIsLogged(true);
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md space-y-8">
          <Navbar />
          {/* Hero Section */}
          <div className="text-center space-y-2 ">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4 mt-10">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Únete a UTurns
            </h1>
            <p className="text-gray-600">
              Crea tu cuenta y comienza a gestionar tus turnos
            </p>
          </div>

          {/* Main Card */}
          <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-semibold text-gray-900">
                Crear Cuenta
              </CardTitle>
              <CardDescription className="text-gray-600">
                Completa el formulario para registrarte
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Nombre completo
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      placeholder="Ingrese su nombre completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Correo electrónico
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 8 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-gray-700"
                  >
                    Confirmar contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repite tu contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Registrando...</span>
                    </div>
                  ) : (
                    "Crear cuenta"
                  )}
                </Button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">
                      O continúa con
                    </span>
                  </div>
                </div>

                {/* Google Button */}
                <Button
                  variant="outline"
                  type="button"
                  className="w-full h-12 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02]"
                  onClick={handleLoginGoogle}
                >
                  <Chrome className="w-5 h-5 mr-3 text-gray-600" />
                  <span className="font-medium text-gray-700">
                    Continuar con Google
                  </span>
                </Button>

                {/* Terms */}
                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  Al registrarte, aceptas nuestros{" "}
                  <Link
                    to="/terms"
                    className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
                  >
                    Términos y Condiciones
                  </Link>{" "}
                  y{" "}
                  <Link
                    to="/privacy"
                    className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
                  >
                    Política de Privacidad
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
              >
                Iniciar Sesión
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
