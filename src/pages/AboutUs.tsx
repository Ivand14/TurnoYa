import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import React from "react";
import { useAuth } from "@/context/AuthContext";

const AboutPage = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar currentUser={currentUser} onLogout={logout} />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Sobre TurnosYa
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Simplificando la gestión de turnos para todo tipo de negocios
              </p>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-booking-primary mb-6 text-center">
                Nuestra Misión
              </h2>
              <p className="text-gray-600 mb-6">
                En TurnosYa, nuestra misión es transformar la manera en que los negocios gestionan sus reservas y citas. Creemos que cada minuto cuenta, tanto para los dueños de negocios como para sus clientes, y estamos dedicados a crear herramientas que ahorren tiempo y aumenten la eficiencia.
              </p>
              <p className="text-gray-600">
                Desarrollamos soluciones tecnológicas intuitivas y accesibles para permitir que negocios de todos los tamaños ofrezcan una experiencia de reserva profesional y sin complicaciones. Desde barberías y centros de belleza hasta instalaciones deportivas, nuestro objetivo es simplificar la gestión de turnos para todos.
              </p>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-booking-primary mb-12 text-center">
              Nuestro Equipo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-booking-primary/20 mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-12 h-12 text-booking-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Ana Rodríguez</h3>
                  <p className="text-booking-primary font-medium mb-3">CEO & Fundadora</p>
                  <p className="text-gray-600 text-sm">
                    Con más de 10 años de experiencia en el sector tecnológico, Ana fundó TurnosYa con la visión de revolucionar la gestión de turnos.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-booking-primary/20 mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-12 h-12 text-booking-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Carlos Méndez</h3>
                  <p className="text-booking-primary font-medium mb-3">CTO</p>
                  <p className="text-gray-600 text-sm">
                    Ingeniero de software con experiencia en startups, Carlos lidera el desarrollo tecnológico de nuestra plataforma.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-booking-primary/20 mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-12 h-12 text-booking-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Laura Torres</h3>
                  <p className="text-booking-primary font-medium mb-3">Diseñadora UX</p>
                  <p className="text-gray-600 text-sm">
                    Especialista en experiencia de usuario, Laura se asegura de que nuestra aplicación sea intuitiva y fácil de usar.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-booking-primary mb-6 text-center">
                Nuestra Historia
              </h2>
              <div className="prose max-w-none text-gray-600">
                <p>
                  TurnosYa comenzó en 2023 cuando nuestra fundadora, Ana Rodríguez, experimentó de primera mano las dificultades que enfrentan los pequeños negocios para gestionar sus reservas. Después de esperar más de una hora en una barbería debido a un sistema de reservas desorganizado, decidió que tenía que haber una solución mejor.
                </p>
                <p className="mt-4">
                  Junto con un pequeño equipo de desarrolladores y diseñadores, Ana comenzó a construir lo que eventualmente se convertiría en TurnosYa. La visión era clara: crear una plataforma que fuera lo suficientemente flexible para adaptarse a diferentes tipos de negocios, pero lo suficientemente simple para que cualquiera pudiera usarla.
                </p>
                <p className="mt-4">
                  Hoy, TurnosYa ayuda a cientos de negocios a gestionar eficientemente sus reservas, ahorrando tiempo tanto a ellos como a sus clientes. Y esto es solo el comienzo de nuestro viaje.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-booking-primary mb-8 text-center">
                Preguntas Frecuentes
              </h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>¿Para qué tipos de negocios es adecuado TurnosYa?</AccordionTrigger>
                  <AccordionContent>
                    TurnosYa está diseñado para ser versátil y adaptarse a diversos tipos de negocios. Es ideal para barberías, salones de belleza, centros de estética, consultorios médicos, canchas deportivas, y cualquier otro negocio que funcione con sistema de reservas o citas.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>¿Cómo puedo registrar mi negocio en TurnosYa?</AccordionTrigger>
                  <AccordionContent>
                    El proceso es muy sencillo. Solo debes hacer clic en "Registrar mi negocio" en nuestra página principal, completar el formulario con los datos de tu negocio, y seguir los pasos para configurar tus servicios y horarios disponibles.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>¿Qué métodos de pago aceptan?</AccordionTrigger>
                  <AccordionContent>
                    Actualmente aceptamos pagos a través de MercadoPago, PayPal y transferencias bancarias. Estamos trabajando para añadir más opciones de pago en el futuro.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>¿Ofrecen soporte técnico?</AccordionTrigger>
                  <AccordionContent>
                    Sí, ofrecemos soporte técnico a través de correo electrónico y chat en vivo durante horarios comerciales. Los usuarios con plan Premium tienen acceso a soporte telefónico prioritario.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>¿Tienen una aplicación móvil?</AccordionTrigger>
                  <AccordionContent>
                    Actualmente, TurnosYa es una aplicación web optimizada para dispositivos móviles. Estamos desarrollando aplicaciones nativas para iOS y Android que estarán disponibles próximamente.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;