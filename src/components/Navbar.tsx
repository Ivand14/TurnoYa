import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Calendar, Sparkles } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { current_user } from "@/context/currentUser";
import { Logged } from "@/context/logged";
import { compnay_logged } from "@/context/current_company";
import { logout } from "@/lib/utils";
import { salesmanContext } from "@/context/MercadoPagoContext/salesmanContext";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { setUser } = current_user();
  const { setIsLogged, isLogged } = Logged();
  const { setCompany, company } = compnay_logged();
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we're on the home page
  const isHomePage = location.pathname === "/";
  const isAbout = location.pathname === "/about";
  const isBusinesses = location.pathname === "/businesses";

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

  const navItems = [
    { name: "Inicio", href: "/" },
    { name: "Negocios", href: "/businesses" },
    { name: "Sobre nosotros", href: "/about" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get navbar styles based on page and scroll state
  const getNavbarStyles = () => {
    if (isHomePage || isAbout || isBusinesses) {
      // Home page: transparent/blur effect
      return isScrolled
        ? "bg-white/80 backdrop-blur-xl border-b border-gray-200/20 shadow-xl"
        : "bg-transparent";
    } else {
      // Other pages: solid background
      return "bg-white border-b border-gray-200 shadow-sm";
    }
  };

  const getLogoStyles = () => {
    if (isHomePage || isAbout || isBusinesses) {
      return isScrolled
        ? "bg-gradient-to-br from-indigo-600 to-purple-600"
        : "bg-white/10 backdrop-blur-sm border border-white/20";
    } else {
      return "bg-gradient-to-br from-indigo-600 to-purple-600";
    }
  };

  const getLogoIconColor = () => {
    if (isHomePage || isAbout || isBusinesses) {
      return isScrolled ? "text-white" : "text-white";
    } else {
      return "text-white";
    }
  };

  const getLogoTextColor = () => {
    if (isHomePage || isAbout || isBusinesses) {
      return isScrolled
        ? "bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        : "text-white";
    } else {
      return "bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent";
    }
  };

  const getLogoSubtextColor = () => {
    if (isHomePage || isAbout || isBusinesses) {
      return isScrolled ? "text-gray-500" : "text-blue-200";
    } else {
      return "text-gray-500";
    }
  };

  const getNavLinkStyles = () => {
    if (isHomePage || isAbout || isBusinesses) {
      return isScrolled
        ? "text-gray-700 hover:text-indigo-600"
        : "text-white/90 hover:text-white";
    } else {
      return "text-gray-700 hover:text-indigo-600";
    }
  };

  const getNavLinkHoverBg = () => {
    if (isHomePage || isAbout || isBusinesses) {
      return isScrolled
        ? "bg-indigo-50 group-hover:bg-indigo-100"
        : "bg-white/10 backdrop-blur-sm border border-white/20";
    } else {
      return "bg-indigo-50 group-hover:bg-indigo-100";
    }
  };

  const getButtonStyles = () => {
    if (isHomePage || isAbout || isBusinesses) {
      return isScrolled
        ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
        : "bg-white text-indigo-900 hover:bg-gray-100";
    } else {
      return "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white";
    }
  };

  const getGhostButtonStyles = () => {
    if (isHomePage || isAbout || isBusinesses) {
      return isScrolled
        ? "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
        : "text-white hover:text-white hover:bg-white/10";
    } else {
      return "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50";
    }
  };

  const getMobileButtonStyles = () => {
    if (isHomePage || isAbout || isBusinesses) {
      return isScrolled
        ? "text-gray-700 hover:bg-gray-100"
        : "text-white hover:bg-white/10 backdrop-blur-sm border border-white/20";
    } else {
      return "text-gray-700 hover:bg-gray-100";
    }
  };

  const getMobileMenuStyles = () => {
    if (isHomePage || isAbout || isBusinesses) {
      return isScrolled
        ? "bg-white/95 backdrop-blur-xl border-gray-200/20"
        : "bg-black/20 backdrop-blur-xl border-white/10";
    } else {
      return "bg-white border-gray-200";
    }
  };

  const getMobileBorderStyles = () => {
    if (isHomePage || isAbout || isBusinesses) {
      return isScrolled
        ? "border-t border-gray-200/50"
        : "border-t border-white/20";
    } else {
      return "border-t border-gray-200";
    }
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${getNavbarStyles()}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.6, -0.05, 0.01, 0.99] }}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 ${getLogoStyles()}`}
              >
                <Calendar
                  className={`w-6 h-6 transition-colors duration-500 ${getLogoIconColor()}`}
                />
              </div>
              <motion.div
                className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isHomePage && !isScrolled
                    ? "bg-gradient-to-r from-cyan-300 to-blue-400"
                    : "bg-gradient-to-r from-cyan-400 to-blue-500"
                }`}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </motion.div>
            </motion.div>
            <div className="flex flex-col">
              <span
                className={`text-xl font-bold transition-all duration-500 ${getLogoTextColor()}`}
              >
                UTurns
              </span>
              <span
                className={`text-xs transition-colors duration-500 ${getLogoSubtextColor()}`}
              >
                Gestión inteligente
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
              >
                <Link
                  to={item.href}
                  className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-500 group ${getNavLinkStyles()}`}
                >
                  <span className="relative z-10">{item.name}</span>
                  <motion.div
                    className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 ${getNavLinkHoverBg()}`}
                    whileHover={{ scale: 1.05 }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {!isLogged ? (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className={`transition-all duration-300 ${getGhostButtonStyles()}`}
                  >
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/register-business">
                  <Button
                    className={`transition-all duration-300 ${getButtonStyles()}`}
                  >
                    Registrar Negocio
                  </Button>
                </Link>
              </>
            ) : (
              <Button
                onClick={handleLogOut}
                className={`transition-all duration-300 ${getButtonStyles()}`}
              >
                Cerrar sesión
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className={`md:hidden p-2 rounded-xl transition-all duration-500 ${getMobileButtonStyles()}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className={`md:hidden absolute top-full left-0 right-0 shadow-xl border-b transition-all duration-500 ${getMobileMenuStyles()}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="container mx-auto px-6 py-6">
              <div className="flex flex-col space-y-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      to={item.href}
                      className={`block px-4 py-3 rounded-xl font-medium transition-all duration-300 ${getNavLinkStyles()} hover:bg-opacity-10`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                <div className={`pt-4 space-y-3 ${getMobileBorderStyles()}`}>
                  {!isLogged ? (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className={`w-full justify-start transition-all duration-300 ${getGhostButtonStyles()}`}
                        >
                          Iniciar Sesión
                        </Button>
                      </Link>
                      <Link
                        to="/register-business"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button
                          className={`w-full transition-all duration-300 ${getButtonStyles()}`}
                        >
                          Registrar Negocio
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Button
                      onClick={() => {
                        handleLogOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full transition-all duration-300 ${getButtonStyles()}`}
                    >
                      Cerrar sesión
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
