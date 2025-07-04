import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
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

const Login = () => {
  const navigate = useNavigate();
  const {
    email,
    password,
    setEmail,
    setPassword,
    setLoading,
    resetForm,
    loading
  } = useLoginStore();
  const { user,setUser } = current_user();
  const{setIsLogged,isLogged} = Logged()
  const{setCompany} = compnay_logged()

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
        const userData = await getUser(userlogin.sessionId)
        if (userData.user_data) {
          setUser(userData.user_data);
          navigate("/dashboard");
        }else if(userData.company_data){
          setCompany(userData.company_data)
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

  const handleLoginGoogle = async() => {
    const loginGoogle = await singInWhithGoogle();
    if(loginGoogle.success === true){
      setIsLogged(true)
      const userData = await getUser(loginGoogle.sessionId)
      if (userData.user_data) {
        setUser(userData.user_data); 
      }
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-12 px-4 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
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
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Contraseña</Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-booking-primary hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    O continúa con
                  </span>
                </div>
              </div>

              <div className=" gap-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleLoginGoogle}
                  className="w-full"
                  
                >
                  <svg className="w-full h-5 mr-2" viewBox="0 0 24 24">
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
                  Google
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link
                to="/register"
                className="text-booking-primary hover:underline"
              >
                Regístrate
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
