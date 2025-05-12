
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Service, TimeSlot } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BookingFormProps {
  service: Service;
  selectedDate: Date;
  selectedSlot: {
    start: Date;
    end: Date;
  } | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const BookingForm = ({
  service,
  selectedDate,
  selectedSlot,
  open,
  onClose,
  onSubmit,
}: BookingFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const submitForm = (data: any) => {
    if (!selectedSlot) {
      toast.error("Por favor selecciona un horario");
      return;
    }
    
    onSubmit({
      ...data,
      serviceId: service.id,
      date: selectedDate.toISOString().split('T')[0],
      start: selectedSlot.start.toISOString(),
      end: selectedSlot.end.toISOString(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reservar {service.name}</DialogTitle>
          <DialogDescription>
            Complete sus datos para confirmar su turno
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
                <p className="mt-1 text-xs text-red-600">{errors.name.message as string}</p>
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
                <p className="mt-1 text-xs text-red-600">{errors.email.message as string}</p>
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
              placeholder="+1234567890"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600">{errors.phone.message as string}</p>
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
              <p className="font-medium">{service.name}</p>
              
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
                  ? `${format(selectedSlot.start, "HH:mm")} - ${format(selectedSlot.end, "HH:mm")}`
                  : "No seleccionado"}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="mr-2">
              Cancelar
            </Button>
            <Button type="submit">Confirmar Reserva</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
