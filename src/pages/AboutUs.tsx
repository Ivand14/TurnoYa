import React from "react";
import {
  User,
  Code,
  Palette,
  Calendar,
  Target,
  Users,
  Lightbulb,
  Heart,
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Award,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { TeamCard } from "@/components/ui/TeamCard";

const AboutPage: React.FC = () => {
  const stats = [
    { number: "500+", label: "Negocios Activos", icon: Users },
    { number: "10,000+", label: "Turnos Gestionados", icon: Calendar },
    { number: "98%", label: "Satisfacción Cliente", icon: Star },
    { number: "24/7", label: "Soporte Disponible", icon: Clock },
  ];

  const values = [
    {
      icon: Shield,
      title: "Confiabilidad",
      description:
        "Sistemas robustos y seguros que garantizan la disponibilidad de tu negocio",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Zap,
      title: "Innovación",
      description:
        "Tecnología de vanguardia que evoluciona con las necesidades del mercado",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Heart,
      title: "Experiencia",
      description:
        "Diseñamos cada interacción pensando en la satisfacción del usuario",
      color: "from-red-500 to-orange-500",
    },
    {
      icon: TrendingUp,
      title: "Crecimiento",
      description:
        "Herramientas que escalan con tu negocio y potencian tu éxito",
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 opacity-10"></div>
        <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900  ">
          <div className="container mx-auto px-6 py-16">
            <motion.div
              className="flex flex-col lg:flex-row items-center lg:items-start gap-12 mt-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Logo */}
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-40 h-40 bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-white group-hover:shadow-3xl transition-all duration-300">
                  <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                    <Calendar className="w-16 h-16 text-white" />
                  </div>
                </div>
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-xl">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </motion.div>

              {/* Company Info */}
              <div className="flex-1 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                    <span className="text-indigo-600">UTurns</span>
                  </h1>

                  <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                    <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 px-6 py-3 text-base font-medium">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Plataforma Líder
                    </Badge>
                    <Badge className="bg-green-100 text-green-800 border-green-200 px-6 py-3 text-base font-medium">
                      <Award className="w-4 h-4 mr-2" />
                      Fundado en 2025
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200 px-6 py-3 text-base font-medium">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      En Crecimiento
                    </Badge>
                  </div>

                  <p className="text-xl text-white mb-8 max-w-3xl leading-relaxed">
                    Revolucionando la gestión de turnos para negocios modernos
                    con tecnología de vanguardia y experiencias excepcionales.
                  </p>

                  {/* Stats */}
                  {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                      >
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {stat.number}
                        </div>
                        <div className="text-sm text-white">
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </div> */}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <main className="flex-grow">
        <div className="container mx-auto px-6 py-12">
          <Tabs defaultValue="mission" className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-white shadow-xl border border-gray-200 p-2 rounded-2xl">
                <TabsTrigger
                  value="mission"
                  className="px-8 py-4 rounded-xl font-semibold text-base data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Misión & Visión
                </TabsTrigger>
                <TabsTrigger
                  value="team"
                  className="px-8 py-4 rounded-xl font-semibold text-base data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Nuestro Equipo
                </TabsTrigger>
                <TabsTrigger
                  value="story"
                  className="px-8 py-4 rounded-xl font-semibold text-base data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                >
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Nuestra Historia
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="mission">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Mission Section */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mb-16">
                  <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-10">
                    <div className="flex items-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mr-6">
                        <Target className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">
                        Nuestra Misión
                      </h2>
                    </div>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      Transformar la manera en que los negocios gestionan sus
                      reservas y citas, creando experiencias excepcionales tanto
                      para empresarios como para clientes.
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      Desarrollamos soluciones tecnológicas intuitivas que
                      permiten a negocios de todos los tamaños ofrecer un
                      servicio de reservas profesional y eficiente.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl shadow-xl p-10 text-white">
                    <div className="flex items-center mb-8">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-6">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold">Nuestra Visión</h2>
                    </div>
                    <p className="text-lg text-indigo-100 mb-6 leading-relaxed">
                      Ser la plataforma líder en gestión de turnos en América
                      Latina, democratizando el acceso a herramientas
                      profesionales para todos los negocios.
                    </p>
                    <p className="text-lg text-indigo-100 leading-relaxed">
                      Imaginamos un futuro donde cada negocio, sin importar su
                      tamaño, pueda ofrecer experiencias de reserva de clase
                      mundial.
                    </p>
                  </div>
                </div>

                {/* Values Section */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-10">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Nuestros Valores
                    </h2>
                    <p className="text-xl text-gray-600">
                      Los principios que guían cada decisión que tomamos
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map((value, index) => (
                      <motion.div
                        key={index}
                        className="text-center group"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                      >
                        <div
                          className={`w-20 h-20 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                        >
                          <value.icon className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                          {value.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {value.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="team">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-10">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Nuestro Equipo
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                      Profesionales apasionados por la tecnología y la
                      experiencia del usuario
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <TeamCard
                      name="Ana Rodríguez"
                      role="CEO & Fundadora"
                      description="Visionaria con más de 10 años de experiencia en tecnología. Fundó UTurns con el objetivo de revolucionar la gestión de turnos para pequeños y medianos negocios."
                      icon={<User className="w-8 h-8" />}
                    />
                    <TeamCard
                      name="Carlos Méndez"
                      role="CTO & Co-fundador"
                      description="Arquitecto de software experimentado en startups. Lidera el desarrollo de nuestra plataforma escalable y las innovaciones tecnológicas del producto."
                      icon={<Code className="w-8 h-8" />}
                    />
                    <TeamCard
                      name="Laura Torres"
                      role="Head of Design"
                      description="Diseñadora UX/UI especializada en crear experiencias digitales intuitivas. Se asegura de que cada interacción sea simple y agradable para nuestros usuarios."
                      icon={<Palette className="w-8 h-8" />}
                    />
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="story">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Timeline */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-10 mb-12">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Nuestra Historia
                    </h2>
                    <p className="text-xl text-gray-600">
                      De una experiencia frustrante a una solución innovadora
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <motion.div
                      className="text-center group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    >
                      <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <span className="text-2xl font-bold text-white">
                          2023
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        El Problema
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Ana experimentó de primera mano las dificultades de
                        gestionar reservas en pequeños negocios. Una espera de
                        una hora en la barbería fue la gota que colmó el vaso.
                      </p>
                    </motion.div>

                    <motion.div
                      className="text-center group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <Lightbulb className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        La Solución
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Junto con un equipo de desarrolladores y diseñadores,
                        comenzamos a construir una plataforma flexible y fácil
                        de usar para cualquier tipo de negocio.
                      </p>
                    </motion.div>

                    <motion.div
                      className="text-center group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <Users className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        El Impacto
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Hoy ayudamos a cientos de negocios a gestionar
                        eficientemente sus reservas, ahorrando tiempo y
                        mejorando la experiencia del cliente.
                      </p>
                    </motion.div>
                  </div>
                </div>

                {/* Detailed Story */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-xl border border-gray-200 p-10">
                  <div className="max-w-4xl mx-auto">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                      La Historia Completa
                    </h3>
                    <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
                      <p className="text-lg leading-relaxed">
                        UTurns comenzó en 2023 cuando nuestra fundadora, Ana
                        Rodríguez, experimentó de primera mano las dificultades
                        que enfrentan los pequeños negocios para gestionar sus
                        reservas. Después de esperar más de una hora en una
                        barbería debido a un sistema de reservas desorganizado,
                        decidió que tenía que haber una solución mejor.
                      </p>
                      <p className="text-lg leading-relaxed">
                        Junto con un pequeño equipo de desarrolladores y
                        diseñadores, Ana comenzó a construir lo que
                        eventualmente se convertiría en UTurns. La visión era
                        clara: crear una plataforma que fuera lo suficientemente
                        flexible para adaptarse a diferentes tipos de negocios,
                        pero lo suficientemente simple para que cualquiera
                        pudiera usarla.
                      </p>
                      <p className="text-lg leading-relaxed">
                        Hoy, UTurns ayuda a cientos de negocios a gestionar
                        eficientemente sus reservas, ahorrando tiempo tanto a
                        ellos como a sus clientes. Y esto es solo el comienzo de
                        nuestro viaje hacia la transformación digital de los
                        servicios locales.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-10">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Preguntas Frecuentes
                  </h2>
                  <p className="text-xl text-gray-600">
                    Respuestas a las dudas más comunes sobre UTurns
                  </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      ¿Para qué tipos de negocios es adecuado UTurns?
                    </AccordionTrigger>
                    <AccordionContent>
                      UTurns está diseñado para adaptarse a diversos tipos de
                      negocios que funcionan con sistema de reservas o citas. Es
                      ideal para barberías, salones de belleza, centros de
                      estética, consultorios médicos, dentistas, centros de
                      fisioterapia, canchas deportivas, estudios de yoga,
                      talleres mecánicos, y cualquier servicio que requiera
                      agendamiento previo.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      ¿Cómo puedo registrar mi negocio en UTurns?
                    </AccordionTrigger>
                    <AccordionContent>
                      El proceso es muy sencillo y solo toma unos minutos. Haz
                      clic en "Registrar mi negocio" en nuestra página
                      principal, completa el formulario con los datos básicos de
                      tu negocio, configura tus servicios con duración y
                      precios, establece tus horarios de atención, y personaliza
                      tu página de reservas. Nuestro equipo te guiará en cada
                      paso del proceso.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>
                      ¿Qué métodos de pago aceptan?
                    </AccordionTrigger>
                    <AccordionContent>
                      Aceptamos múltiples métodos de pago para tu comodidad:
                      MercadoPago (tarjetas de crédito, débito, efectivo),
                      PayPal, transferencias bancarias, y próximamente Bitcoin y
                      otras criptomonedas. Los pagos son procesados de forma
                      segura y puedes cambiar tu método de pago en cualquier
                      momento desde tu panel de administración.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>
                      ¿Ofrecen soporte técnico?
                    </AccordionTrigger>
                    <AccordionContent>
                      Sí, ofrecemos soporte completo a través de múltiples
                      canales: chat en vivo disponible 24/7, correo electrónico
                      con respuesta en menos de 2 horas, base de conocimientos
                      con tutoriales y guías, y para usuarios Premium, soporte
                      telefónico prioritario con especialistas dedicados.
                      También organizamos webinars gratuitos para ayudarte a
                      aprovechar al máximo la plataforma.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger>
                      ¿Tienen una aplicación móvil?
                    </AccordionTrigger>
                    <AccordionContent>
                      Actualmente, UTurns es una aplicación web progresiva
                      (PWA) optimizada para todos los dispositivos móviles.
                      Funciona perfectamente en navegadores móviles y puede
                      instalarse en tu dispositivo como una app nativa. Estamos
                      desarrollando aplicaciones nativas para iOS y Android que
                      incluirán notificaciones push, sincronización offline y
                      funciones avanzadas. Estarán disponibles en Q2 2024.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6">
                    <AccordionTrigger>
                      ¿Puedo personalizar mi página de reservas?
                    </AccordionTrigger>
                    <AccordionContent>
                      Absolutamente. UTurns te permite personalizar
                      completamente tu página de reservas: agrega tu logo y
                      colores corporativos, personaliza textos y descripciones,
                      configura campos adicionales específicos para tu negocio,
                      establece políticas de cancelación personalizadas, y crea
                      promociones especiales. Todo con una interfaz simple de
                      arrastrar y soltar, sin necesidad de conocimientos
                      técnicos.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-12 text-white text-center">
                <div className="flex items-center justify-center mb-8">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold">
                    ¿Listo para revolucionar tu negocio?
                  </h2>
                </div>

                <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
                  Únete a cientos de negocios que ya confían en UTurns para
                  gestionar sus reservas de manera eficiente y profesional.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <motion.button
                    className="px-10 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-gray-100 transition-colors duration-200 shadow-xl group text-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Registrar mi Negocio
                    <ArrowRight className="ml-2 w-5 h-5 inline group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                  <motion.button
                    className="px-10 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-indigo-600 transition-colors duration-200 text-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Ver Demo Gratuita
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
