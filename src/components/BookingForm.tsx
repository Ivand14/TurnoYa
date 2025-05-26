import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Service, TimeSlot } from "@/types";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentForm } from "@/components/PaymentForm";
import { Textarea } from "@/components/ui/textarea";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

interface BookingData {
  name: string;
  email: string;
  phone: string;
  notes?: string;
  date: string;
  start: string;
  end: string;
  paymentData?: PaymentData;
  paymentStatus?: 'pending' | 'paid' | 'refunded';
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
}

interface PaymentData {
  preferenceId: string;
  paymentUrl: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const BookingForm = ({
  service,
  selectedDate,
  selectedSlot,
  open,
  onClose,
  onSubmit
}: BookingFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
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
      end: selectedSlot.end.toISOString()
      
    };

    setFormData(bookingData);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (paymentData: PaymentData) => {
    if (formData) {
      onSubmit({
        ...formData,
        paymentData,
        paymentStatus: "pending"
      });
    }
    setShowPayment(false);
    setFormData(null);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setFormData(null);
  };

  if (showPayment && formData) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Pago de Reserva</DialogTitle>
            <DialogDescription>
              Complete el pago para confirmar su reserva
            </DialogDescription>
          </DialogHeader>

          <PaymentForm
            service={service}
            bookingData={formData}
            onPaymentSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reservar {service.name_service}</DialogTitle>
          <DialogDescription>
            Complete sus datos para continuar con el pago
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitForm)} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                {...register("name", { required: "Este campo es obligatorio" })}
                placeholder="Ingrese su nombre"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.name.message as string}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Este campo es obligatorio",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email inválido"
                  }
                })}
                placeholder="su@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message as string}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              {...register("phone", {
                required: "Este campo es obligatorio",
                pattern: {
                  value: /^[0-9+-\s()]+$/,
                  message: "Número de teléfono inválido"
                }
              })}
              placeholder="+5411234567890"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600">
                {errors.phone.message as string}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="notes">Notas adicionales (opcional)</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Agregue cualquier información adicional que necesitemos saber"
              rows={3}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium mb-2">Resumen de reserva:</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <p className="text-gray-600">Servicio:</p>
              <p className="font-medium">{service.name_service}</p>

              <p className="text-gray-600">Duración:</p>
              <p className="font-medium">{service.duration} minutos</p>

              <p className="text-gray-600">Precio:</p>
              <p className="font-medium">${service.price}</p>

              <p className="text-gray-600">Fecha:</p>
              <p className="font-medium">
                {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
              </p>

              <p className="text-gray-600">Horario:</p>
              <p className="font-medium">
                {selectedSlot
                  ? `${format(selectedSlot.start, "HH:mm")} - ${format(
                      selectedSlot.end,
                      "HH:mm"
                    )}`
                  : "No seleccionado"}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="mr-2"
            >
              Cancelar
            </Button>
            <Button type="submit">Continuar al Pago</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
