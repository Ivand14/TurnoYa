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
import { useEffect, useState } from "react";
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
  User,
  Percent,
  Banknote,
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
  paymentPercentage: number;
  paymentAmount: number;
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
  const [paymentPercentage, setPaymentPercentage] = useState<number>(100);

  const [paymentAmount, setPaymentAmount] = useState(0);

  useEffect(() => {
    const amount = service.requiresDeposit
      ? (service.price * paymentPercentage) / 100
      : service.price;

    setPaymentAmount(amount);
  }, [service.price, service.requiresDeposit, paymentPercentage]);

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
      paymentPercentage,
      paymentAmount,
    };

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
        <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[600px] p-0 overflow-hidden max-h-[95vh] overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {/* Header con gradiente - Responsive */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 sm:p-6 text-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-lg sm:text-2xl font-bold text-white leading-tight">
                    Pago de Reserva
                  </DialogTitle>
                  <DialogDescription className="text-green-100 text-sm sm:text-base mt-1">
                    Complete el pago para confirmar su reserva - $
                    {formData.paymentAmount} ({formData.paymentPercentage}% del
                    total)
                  </DialogDescription>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
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
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[600px] p-0 overflow-hidden max-h-[95vh] overflow-y-auto">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {/* Header con gradiente - Completamente responsive */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6 text-white relative overflow-hidden">
              {/* Elementos decorativos - Ocultos en móviles */}
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full -translate-y-12 translate-x-12 sm:-translate-y-16 sm:translate-x-16 hidden sm:block"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8 sm:translate-y-12 sm:-translate-x-12 hidden sm:block"></div>

              <div className="relative flex items-center space-x-3 sm:space-x-4">
                <motion.div
                  className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Calendar className="w-6 h-6 sm:w-8 sm:h-8" />
                </motion.div>
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-lg sm:text-2xl font-bold text-white mb-1 leading-tight">
                    Reservar {service.name_service}
                  </DialogTitle>
                  <div className="flex items-center space-x-2 text-indigo-100">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">
                      Confirma tu cita en segundos
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {/* Resumen de reserva completamente responsive */}
              <motion.div
                className="mb-6 sm:mb-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="flex items-center mb-3 sm:mb-4">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mr-2 sm:mr-3 flex-shrink-0" />
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    Resumen de tu reserva
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200">
                    <div className="flex items-center mb-2">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 mr-2 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-gray-500">
                        Servicio
                      </span>
                    </div>
                    <p className="font-bold text-gray-900 text-sm sm:text-base leading-tight">
                      {service.name_service}
                    </p>
                  </div>

                  <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200">
                    <div className="flex items-center mb-2">
                      <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-gray-500">
                        Precio total
                      </span>
                    </div>
                    <p className="font-bold text-gray-900 text-sm sm:text-base">
                      ${service.price}
                    </p>
                  </div>

                  <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200">
                    <div className="flex items-center mb-2">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-gray-500">
                        Duración
                      </span>
                    </div>
                    <p className="font-bold text-gray-900 text-sm sm:text-base">
                      {service.duration} minutos
                    </p>
                  </div>

                  <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200">
                    <div className="flex items-center mb-2">
                      <Banknote className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mr-2 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-gray-500">
                        Monto a pagar
                      </span>
                    </div>
                    <p className="font-bold text-emerald-600 text-sm sm:text-base">
                      {service.requiresDeposit
                        ? `${paymentAmount}$ (${paymentPercentage}% )`
                        : `${paymentAmount}$`}
                    </p>
                  </div>

                  <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200">
                    <div className="flex items-center mb-2">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mr-2 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-gray-500">
                        Fecha
                      </span>
                    </div>
                    <p className="font-bold text-gray-900 text-sm sm:text-base leading-tight">
                      {format(selectedDate, "EEEE, d 'de' MMMM", {
                        locale: es,
                      })}
                    </p>
                  </div>

                  <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200">
                    <div className="flex items-center mb-2">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mr-2 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-gray-500">
                        Horario
                      </span>
                    </div>
                    <p className="font-bold text-gray-900 text-sm sm:text-base">
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

              {/* Formulario completamente responsive */}
              <form
                onSubmit={handleSubmit(submitForm)}
                className="space-y-4 sm:space-y-6"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <Label
                    htmlFor="phone"
                    className="flex items-center text-sm font-semibold text-gray-700 mb-2"
                  >
                    <Phone className="w-4 h-4 mr-2 text-indigo-600 flex-shrink-0" />
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
                    className="h-11 sm:h-12 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 transition-all duration-300 text-base"
                  />
                  {errors.phone && (
                    <motion.p
                      className="mt-2 text-sm text-red-600 flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mr-2 mt-0.5 text-xs flex-shrink-0">
                        !
                      </span>
                      <span className="leading-tight">
                        {errors.phone.message as string}
                      </span>
                    </motion.p>
                  )}
                </motion.div>
                {/* Opción de porcentaje de pago */}
                {service.requiresDeposit && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                  >
                    <Label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <Percent className="w-4 h-4 mr-2 text-indigo-600 flex-shrink-0" />
                      Opción de pago
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <motion.button
                        type="button"
                        onClick={() =>
                          setPaymentPercentage(
                            Number(service.paymentPercentage)
                          )
                        }
                        className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                          paymentPercentage ===
                          Number(service.paymentPercentage)
                            ? "border-indigo-500 bg-indigo-50 shadow-lg"
                            : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-25"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div
                              className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                                paymentPercentage ===
                                Number(service.paymentPercentage)
                                  ? "border-indigo-500 bg-indigo-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {paymentPercentage ===
                                Number(service.paymentPercentage) && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                            <span className="font-semibold text-gray-900">
                              Pago del {Number(service.paymentPercentage)} %
                            </span>
                          </div>
                          <span
                            className={`text-lg font-bold ${
                              paymentPercentage === Number(service.paymentPercentage)
                                ? "text-indigo-600"
                                : "text-gray-600"
                            }`}
                          >
                            $
                            {(service.price *
                              Number(service.paymentPercentage)) /
                              100}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          Paga un porcentaje, el resto al finalizar el servicio
                        </p>
                      </motion.button>

                      <motion.button
                        type="button"
                        onClick={() => setPaymentPercentage(100)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                          paymentPercentage === 100
                            ? "border-emerald-500 bg-emerald-50 shadow-lg"
                            : "border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-25"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div
                              className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                                paymentPercentage === 100
                                  ? "border-emerald-500 bg-emerald-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {paymentPercentage === 100 && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                            <span className="font-semibold text-gray-900">
                              Pago completo
                            </span>
                          </div>
                          <span
                            className={`text-lg font-bold ${
                              paymentPercentage === 100
                                ? "text-emerald-600"
                                : "text-gray-600"
                            }`}
                          >
                            ${service.price}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          Paga el monto completo y asegura tu reserva
                        </p>
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <Label
                    htmlFor="notes"
                    className="flex items-center text-sm font-semibold text-gray-700 mb-2"
                  >
                    <MessageSquare className="w-4 h-4 mr-2 text-indigo-600 flex-shrink-0" />
                    Notas adicionales (opcional)
                  </Label>
                  <Textarea
                    id="notes"
                    {...register("notes")}
                    placeholder="¿Hay algo específico que deberíamos saber para tu cita?"
                    rows={3}
                    className="rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 transition-all duration-300 resize-none text-base"
                  />
                </motion.div>

                <DialogFooter className="pt-4 sm:pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={onClose}
                      className="flex-1 h-11 sm:h-12 rounded-lg sm:rounded-xl border-2 border-gray-200 hover:bg-gray-50 font-semibold transition-all duration-300 text-base"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 h-11 sm:h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group text-base"
                    >
                      <span className="flex items-center justify-center">
                        <span className="mr-2">Pagar ${paymentAmount}</span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                      </span>
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
