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
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

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
  const { user, setUser } = current_user();
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

  const handleLoginGoogle = async () => {
    const loginGoogle = await singInWhithGoogle();
    if (loginGoogle.success === true) {
      setIsLogged(true);
      const userData = await getUser(loginGoogle.sessionId);
      if (userData.user_data) {
        setUser(userData.user_data);
      }
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* <Navbar /> */}

      <div className="flex-1 flex">
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

                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleLoginGoogle}
                    className="w-full h-14 text-base font-semibold border-2 hover:border-gray-300 hover:shadow-lg transition-all duration-200"
                  >
                    <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continuar con Google
                  </Button>
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
