import {} from "@/context/login.state";

import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Logged } from "@/context/logged";
import { compnay_logged } from "@/context/current_company";
import { current_user } from "@/context/currentUser";
import { logout } from "@/lib/utils";
import { useState } from "react";
import { salesmanContext } from "@/context/MercadoPagoContext/salesmanContext";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setUser, user } = current_user();
  const { setIsLogged, isLogged } = Logged();
  const { setCompany, company } = compnay_logged();

  const navigate = useNavigate();

  const handleLogOut = () => {
    setIsLogged(false);
    setUser(null);
    setCompany(null);
    logout();
    localStorage.removeItem("salesman-store");
    salesmanContext.getState().clearSalesman();
    localStorage.removeItem("activeTab");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-bold text-booking-primary flex items-center gap-2"
        >
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0117.25 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H6a3 3 0 01-3-3V7.5a3 3 0 013-3h.75V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5zm-15-3.75A.75.75 0 016 6.75h12a.75.75 0 01.75.75v.75H5.25v-.75z"
              clipRule="evenodd"
            />
          </svg>
          TurnosYa
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-700 hover:text-booking-primary">
            Inicio
          </Link>
          <Link
            to="/businesses"
            className="text-gray-700 hover:text-booking-primary"
          >
            Negocios
          </Link>
          <Link
            to="/about"
            className="text-gray-700 hover:text-booking-primary"
          >
            Sobre Nosotros
          </Link>

          {isLogged ? (
            <>
              <Link
                to={
                  user?.rol === "user"
                    ? "/dashboard"
                    : company?.rol === "business"
                    ? `/admin-dashboard/${company.id}`
                    : "/login"
                }
                className="text-gray-700 hover:text-booking-primary"
              >
                Dashboard
              </Link>

              <Button
                variant="outline"
                className="text-gray-700 hover:text-booking-primary"
                onClick={handleLogOut}
              >
                Cerrar Sesion
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">Iniciar Sesión</Button>
              </Link>
              <Link to="/register">
                <Button>Registrarse</Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px]">
              <nav className="flex flex-col gap-4 py-4">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-booking-primary px-4 py-2 rounded-md hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Inicio
                </Link>
                <Link
                  to="/businesses"
                  className="text-gray-700 hover:text-booking-primary px-4 py-2 rounded-md hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Negocios
                </Link>
                <Link
                  to="/about"
                  className="text-gray-700 hover:text-booking-primary px-4 py-2 rounded-md hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Sobre Nosotros
                </Link>

                {isLogged ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="text-gray-700 hover:text-booking-primary px-4 py-2 rounded-md hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleLogOut}
                    >
                      Cerrar Sesion
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 px-4 mt-2">
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                      <Button className="w-full">Registrarse</Button>
                    </Link>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
