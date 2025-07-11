import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentForm } from "@/components/PaymentForm";
import { Service } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Phone, 
  MessageSquare, 
  CreditCard,
  CheckCircle,
  ArrowRight,
  Sparkles,
  User
} from "lucide-react";

interface BookingData {
  name: string;
  email: string;
  phone: string;
  notes?: string;
  date: string;
  start: string;
  end: string;
  paymentData?: PaymentData;
  paymentStatus?: "pending" | "paid" | "refunded";
  employeeId?: string | null;
}

interface BookingFormProps {
  service: Service;
  selectedDate: Date;
  selectedSlot: {
    start: Date;
    end: Date;
  } | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BookingData) => void;
  businessId: string;
}

interface PaymentData {
  preferenceId: string;
  paymentUrl: string;
  status: "pending" | "approved" | "rejected";
}

export const BookingForm = ({
  service,
  selectedDate,
  selectedSlot,
  open,
  onClose,
  onSubmit,
  businessId,
}: BookingFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPayment, setShowPayment] = useState(false);
  const [formData, setFormData] = useState<BookingData | null>(null);

  const submitForm = (data: BookingData) => {
    if (!selectedSlot) {
      toast.error("Por favor selecciona un horario");
      return;
    }

    const bookingData = {
      ...data,
      serviceId: service.id,
      date: selectedDate.toISOString().split("T")[0],
      start: selectedSlot.start.toISOString(),
      end: selectedSlot.end.toISOString(),
      employeeId: data.employeeId || null,
    };

    console.log(bookingData);

    onSubmit(bookingData);

    setFormData(bookingData);
    setShowPayment(true);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setFormData(null);
  };

  if (showPayment && formData) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {/* Header con gradiente */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-white">
                    Pago de Reserva
                  </DialogTitle>
                  <DialogDescription className="text-green-100">
                    Complete el pago para confirmar su reserva
                  </DialogDescription>
                </div>
              </div>
            </div>

            <div className="p-6">
              <PaymentForm
                service={service}
                bookingData={formData}
                onCancel={handlePaymentCancel}
                businessId={businessId}
              />
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {/* Header con gradiente */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative overflow-hidden">
              {/* Elementos decorativos */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative flex items-center space-x-4">
                <motion.div 
                  className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Calendar className="w-8 h-8" />
                </motion.div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-white mb-1">
                    Reservar {service.name_service}
                  </DialogTitle>
                  <div className="flex items-center space-x-2 text-indigo-100">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm">Confirma tu cita en segundos</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Resumen de reserva mejorado */}
              <motion.div 
                className="mb-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                  <h3 className="text-lg font-bold text-gray-900">Resumen de tu reserva</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center mb-2">
                      <User className="w-5 h-5 text-indigo-600 mr-2" />
                      <span className="text-sm font-medium text-gray-500">Servicio</span>
                    </div>
                    <p className="font-bold text-gray-900">{service.name_service}</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center mb-2">
                      <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-gray-500">Precio</span>
                    </div>
                    <p className="font-bold text-gray-900">${service.price}</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center mb-2">
                      <Clock className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-gray-500">Duración</span>
                    </div>
                    <p className="font-bold text-gray-900">{service.duration} minutos</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center mb-2">
                      <Calendar className="w-5 h-5 text-purple-600 mr-2" />
                      <span className="text-sm font-medium text-gray-500">Fecha</span>
                    </div>
                    <p className="font-bold text-gray-900">
                      {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200 md:col-span-2">
                    <div className="flex items-center mb-2">
                      <Clock className="w-5 h-5 text-orange-600 mr-2" />
                      <span className="text-sm font-medium text-gray-500">Horario</span>
                    </div>
                    <p className="font-bold text-gray-900">
                      {selectedSlot
                        ? `${format(selectedSlot.start, "HH:mm")} - ${format(
                            selectedSlot.end,
                            "HH:mm"
                          )}`
                        : "No seleccionado"}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Formulario */}
              <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <Label htmlFor="phone" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 mr-2 text-indigo-600" />
                    Número de teléfono
                  </Label>
                  <Input
                    id="phone"
                    {...register("phone", {
                      required: "Este campo es obligatorio",
                      pattern: {
                        value: /^[0-9+-\s()]+$/,
                        message: "Número de teléfono inválido",
                      },
                    })}
                    placeholder="+54 11 1234-5678"
                    className="h-12 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 transition-all duration-300"
                  />
                  {errors.phone && (
                    <motion.p 
                      className="mt-2 text-sm text-red-600 flex items-center"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mr-2">!</span>
                      {errors.phone.message as string}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <Label htmlFor="notes" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <MessageSquare className="w-4 h-4 mr-2 text-indigo-600" />
                    Notas adicionales (opcional)
                  </Label>
                  <Textarea
                    id="notes"
                    {...register("notes")}
                    placeholder="¿Hay algo específico que deberíamos saber para tu cita?"
                    rows={4}
                    className="rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 transition-all duration-300 resize-none"
                  />
                </motion.div>

                <DialogFooter className="pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={onClose}
                      className="flex-1 h-12 rounded-xl border-2 border-gray-200 hover:bg-gray-50 font-semibold transition-all duration-300"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit"
                      className="flex-1 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      Continuar al Pago
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};