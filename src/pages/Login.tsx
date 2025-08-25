import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { getUser, login_usuario, singInWhithGoogle } from "@/apis/users_apis";

import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logged } from "@/context/logged";
import { Navbar } from "@/components/Navbar";
import { compnay_logged } from "@/context/current_company";
import { current_user } from "@/context/currentUser";
import { toast } from "sonner";
import { useLoginStore } from "@/context/login.state";
import { motion } from "framer-motion";
import {
  Calendar,
  Mail,
  Lock,
  Shield,
  Zap,
  Users,
  ArrowRight,
} from "lucide-react";
import { loginGoogle } from "@/hooks/LoginGoogle";
import GoogleButton from "@/components/ui/GoogleButton";

const Login = () => {
  const navigate = useNavigate();
  const {
    email,
    password,
    setEmail,
    setPassword,
    setLoading,
    resetForm,
    loading,
  } = useLoginStore();
  const { setUser } = current_user();
  const { setIsLogged, isLogged } = Logged();
  const { setCompany } = compnay_logged();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Por favor complete todos los campos");
      return;
    }

    try {
      setLoading(true);
      const userlogin = await login_usuario(email, password);

      if (userlogin.success === true) {
        setIsLogged(true);
        const userData = await getUser(userlogin.sessionId);
        if (userData.user_data) {
          setUser(userData.user_data);
          navigate("/dashboard");
        } else if (userData.company_data) {
          setCompany(userData.company_data);
          navigate(`/admin-dashboard/${userData.company_data.id}`);
        }
        toast.success("Inicio de sesión exitoso");
      }
      resetForm();
    } catch (error) {
      toast.error("Error al iniciar sesión: credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col  bg-gray-50">
      {/* <Navbar /> */}

      <div className="flex-1 flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"></div>

          {/* Decorative Elements */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>

          <div className="relative z-10 flex flex-col justify-center px-16 text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold">UTurns</h1>
              </div>

              <h2 className="text-3xl font-bold mb-6 leading-tight">
                Gestiona tus reservas de manera inteligente
              </h2>

              <p className="text-xl text-indigo-100 mb-12 leading-relaxed">
                La plataforma más completa para administrar turnos y citas de tu
                negocio.
              </p>

              <div className="space-y-6">
                <motion.div
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">100% Seguro</h3>
                    <p className="text-indigo-200">
                      Tus datos están protegidos con encriptación de nivel
                      bancario
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Fácil de usar</h3>
                    <p className="text-indigo-200">
                      Interfaz intuitiva diseñada para cualquier tipo de negocio
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Soporte 24/7</h3>
                    <p className="text-indigo-200">
                      Nuestro equipo está siempre disponible para ayudarte
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center py-12 px-4 lg:px-8">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden">
              <CardHeader className="text-center bg-gradient-to-r from-gray-50 to-white p-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                  Bienvenido de vuelta
                </CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  Ingresa tus credenciales para acceder a tu cuenta
                </CardDescription>
              </CardHeader>

              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-semibold">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-14 text-base"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label
                        htmlFor="password"
                        className="text-base font-semibold"
                      >
                        Contraseña
                      </Label>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-12 h-14 text-base"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200"
                    disabled={loading}
                    // loading={loading}
                  >
                    {loading ? (
                      "Iniciando sesión..."
                    ) : (
                      <>
                        Iniciar Sesión
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>

                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500 font-medium">
                        O continúa con
                      </span>
                    </div>
                  </div>

                  <GoogleButton />
                </form>
              </CardContent>

              <CardFooter className="flex justify-center bg-gray-50 p-8">
                <p className="text-base text-gray-600">
                  ¿No tienes una cuenta?{" "}
                  <Link
                    to="/register"
                    className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors"
                  >
                    Regístrate aquí
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
