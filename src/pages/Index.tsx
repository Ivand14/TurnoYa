import React, { useEffect, useState } from "react";
import { motion, useAnimation, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Calendar,
  Smartphone,
  Bell,
  BarChart3,
  CreditCard,
  MessageSquare,
  Scissors,
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
  Play,
  Users,
  TrendingUp,
  Shield,
  Clock,
  Globe,
  Edit3,
  DollarSign,
} from "lucide-react";

// Import your original components and functionality
import { Business } from "@/types";
import { BusinessCard } from "@/components/BusinessCard";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { getAllBusiness } from "@/apis/business_apis";
import { toast } from "sonner";
import PricingCards from "@/components/pricingCards";

// Enhanced animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8, y: 40 },
  animate: { opacity: 1, scale: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] },
};

const slideInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
};

const slideInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
};

// Enhanced Animated Section Component
const AnimatedSection = ({
  children,
  className = "",
  variant = "fadeInUp",
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const variants = {
    fadeInUp,
    slideInLeft,
    slideInRight,
    scaleIn,
  };

  useEffect(() => {
    if (inView) {
      controls.start("animate");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={controls}
      variants={variants[variant]}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Floating elements component
const FloatingElements = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-white/20 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30, 0],
          opacity: [0.2, 0.8, 0.2],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>
);

const Index = () => {
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState<Business[]>([]);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // Your original data fetching logic
  const fetchData = async () => {
    const response = await getAllBusiness();
    setBusiness(response.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const featuredBusinesses = business;

  return (
    <div className="flex flex-col min-h-screen bg-transparent">

      <Navbar />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <motion.div className="absolute inset-0 opacity-30" style={{ y }}>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
          </motion.div>
        </div>

        <FloatingElements />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.6, -0.05, 0.01, 0.99] }}
            >
              <motion.h1
                className="text-6xl md:text-8xl font-bold mb-8 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                Gestiona tu agenda con{" "}
                <motion.span
                  className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent block"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  UTurns
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl mb-12 text-blue-100 leading-relaxed max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                La plataforma todo en uno para gestionar turnos y reservas de
                cualquier tipo de negocio. Barberías, centros de belleza,
                canchas deportivas y más.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                <Link to="/register-business" className="w-full sm:w-auto">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-white text-indigo-900 hover:bg-gray-100 shadow-2xl text-lg px-10 py-5"
                    >
                      Regístrate como Negocio
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>

              {/* Stats */}
              {/* <motion.div
                className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                {[
                  { number: "10K+", label: "Negocios activos" },
                  { number: "500K+", label: "Reservas gestionadas" },
                  { number: "99.9%", label: "Tiempo de actividad" },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      {stat.number}
                    </div>
                    <div className="text-blue-200 text-sm">{stat.label}</div>
                  </div>
                ))}
              </motion.div> */}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        <div className="container mx-auto px-6 relative">
          <AnimatedSection>
            <div className="text-center mb-20">
              <motion.div
                className="inline-block px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium mb-6"
                whileHover={{ scale: 1.05 }}
              >
                ✨ Características principales
              </motion.div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
                ¿Por qué elegir{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  UTurns?
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Descubre las funcionalidades avanzadas que transformarán la
                gestión de tu negocio
              </p>
            </div>
          </AnimatedSection>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                icon: Calendar,
                title: "Calendario Inteligente",
                description:
                  "Gestiona tu agenda con un calendario dinámico y personalizable que se adapta a tus horarios y necesidades.",
                color: "from-blue-500 to-cyan-500",
                bgColor: "bg-blue-50",
              },
              {
                icon: Smartphone,
                title: "Reservas Online",
                description:
                  "Tus clientes pueden reservar citas directamente desde su móvil o computadora a cualquier hora.",
                color: "from-purple-500 to-pink-500",
                bgColor: "bg-purple-50",
              },
              {
                icon: Bell,
                title: "Notificaciones",
                description:
                  "Envía recordatorios automáticos y reduce las ausencias con notificaciones por email o WhatsApp.",
                color: "from-green-500 to-emerald-500",
                bgColor: "bg-green-50",
              },
              {
                icon: BarChart3,
                title: "Panel Administrativo",
                description:
                  "Accede a estadísticas detalladas y gestiona tu negocio desde un intuitivo panel de control.",
                color: "from-orange-500 to-red-500",
                bgColor: "bg-orange-50",
              },
              {
                icon: CreditCard,
                title: "Pagos Integrados",
                description:
                  "Cobra reservas anticipadas, servicios completos o depósitos con múltiples métodos de pago.",
                color: "from-indigo-500 to-blue-500",
                bgColor: "bg-indigo-50",
              },
              {
                icon: MessageSquare,
                title: "Multi-negocio",
                description:
                  "Perfecto para cualquier tipo de servicio: barberías, centros de belleza, instalaciones deportivas y más.",
                color: "from-gray-600 to-gray-800",
                bgColor: "bg-gray-50",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="group relative"
              >
                <div className="relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div
                    className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10`}
                  >
                    <div
                      className={`w-8 h-8 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center`}
                    >
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-4 text-gray-900 relative z-10">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed relative z-10">
                    {feature.description}
                  </p>

                  <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-indigo-100 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Business Types Section */}
      <section className="py-32 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative">
          <AnimatedSection>
            <div className="text-center mb-20">
              <motion.div
                className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-6"
                whileHover={{ scale: 1.05 }}
              >
                🏢 Sectores compatibles
              </motion.div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                Para todo tipo de{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  negocios
                </span>
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Nuestra plataforma está diseñada para adaptarse a diferentes
                tipos de negocios con necesidades específicas de gestión de
                turnos.
              </p>
            </div>
          </AnimatedSection>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Scissors,
                title: "Barberías",
                description:
                  "Gestiona cortes de cabello, afeitados y tratamientos",
                features: [
                  "Catálogo de servicios",
                  "Gestión de barberos",
                  "Venta de productos",
                ],
                gradient: "from-blue-500 to-cyan-500",
                image:
                  "https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=400",
              },
              {
                icon: Sparkles,
                title: "Centros de Belleza",
                description:
                  "Organiza citas para tratamientos estéticos, manicuras, pedicuras, maquillaje y más.",
                features: [
                  "Tratamientos personalizados",
                  "Historial de clientes",
                  "Paquetes de servicios",
                ],
                gradient: "from-pink-500 to-purple-500",
                image:
                  "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=400",
              },
              {
                icon: Zap,
                title: "Centros Deportivos",
                description:
                  "Alquiler de canchas, reservas para clases grupales y gestión de torneos deportivos.",
                features: [
                  "Reserva de canchas",
                  "Clases grupales",
                  "Entrenadores personales",
                ],
                gradient: "from-green-500 to-emerald-500",
                image:
                  "https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=400",
              },
            ].map((business, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="group relative"
              >
                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-3 border border-white/20">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={business.image}
                      alt={business.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>

                  <div className="p-8">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${business.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <business.icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-center mb-4">
                      {business.title}
                    </h3>
                    <p className="text-blue-100 text-center mb-6 leading-relaxed">
                      {business.description}
                    </p>

                    <ul className="space-y-2 mb-6">
                      {business.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center text-sm text-blue-200"
                        >
                          <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <AnimatedSection>
            <div className="text-center mt-16">
              <Link to="/register-business">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-white text-indigo-900 hover:bg-gray-100 px-10 py-5 text-lg"
                  >
                    Registra tu Negocio
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-20">
              <motion.div
                className="inline-block px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-medium mb-6"
                whileHover={{ scale: 1.05 }}
              >
                🌟 Casos de éxito
              </motion.div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
                Negocios{" "}
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Destacados
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Estos son algunos de los negocios que confían en nuestra
                plataforma para gestionar sus reservas.
              </p>
            </div>
          </AnimatedSection>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {featuredBusinesses.map((business, index) => (
              <motion.div
                key={business.id || index}
                variants={scaleIn}
                className="group cursor-pointer"
              >
                <div className="transform hover:-translate-y-3 transition-all duration-500">
                  <BusinessCard
                    business={business}
                    onClick={() => {}} // En una implementación real, esto llevaría a la página del negocio
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          <AnimatedSection>
            <div className="text-center mt-16">
              <Link to="/businesses">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-10 py-5 text-lg"
                  >
                    Ver Todos los Negocios
                    <Globe className="ml-3 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing Section */}
      <AnimatedSection>
        <PricingCards />
      </AnimatedSection>

      {/* Newsletter */}
      <section className="py-32 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-500/10 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-500/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-6 relative">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-6"
                whileHover={{ scale: 1.05 }}
              >
                📧 Newsletter
              </motion.div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                Mantente{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Informado
                </span>
              </h2>
              <p className="text-xl mb-12 text-blue-100 leading-relaxed">
                Suscríbete para recibir actualizaciones y novedades sobre
                nuestras funcionalidades.
              </p>

              <motion.form
                className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Input
                  type="email"
                  placeholder="Tu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 backdrop-blur-sm text-white placeholder:text-blue-200 border-white/20 focus:ring-white/50 flex-1"
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      if (email) {
                        toast.success(`Gracias por suscribirte con: ${email}`);
                        setEmail("");
                      }
                    }}
                    className="bg-white text-indigo-900 hover:bg-gray-100 px-8"
                  >
                    Suscribirse
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </motion.form>

              <p className="text-sm text-blue-200 mt-4">
                Sin spam. Cancela tu suscripción cuando quieras.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
