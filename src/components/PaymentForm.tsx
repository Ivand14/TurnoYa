import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, ExternalLink, Loader2 } from "lucide-react";
import React, { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreatePreferenceRequest } from "@/types/mercadopago";
import { Separator } from "@/components/ui/separator";
import { Service } from "@/types";
import { current_user } from "@/context/currentUser";
import { toast } from "sonner";
import MercadoPagoButton from "./mercadopagoComponents/MercadoPagoButton";

interface PaymentData {
  preferenceId: string;
  paymentUrl: string;
  status: "pending" | "approved" | "rejected";
}

interface PaymentFormProps {
  service: Service;
  bookingData: {
    name: string;
    email: string;
    phone?: string;
    date: string;
    start: string;
    end: string;
    notes?: string;
  };
  onPaymentSuccess: (paymentData: PaymentData) => void;
  onCancel: () => void;
  businessId:string
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  service,
  bookingData,
  onPaymentSuccess,
  onCancel,
  businessId
}) => {

  const { user } = current_user();


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS"
    }).format(amount);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Proceder al Pago
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Resumen de la reserva */}
        <div className="space-y-3">
          <h3 className="font-semibold">Resumen de la reserva</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Servicio:</span>
              <span className="font-medium">{service.name_service}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Cliente:</span>
              <span className="font-medium">{user?.name}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Fecha:</span>
              <span className="font-medium">{bookingData.date}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Duración:</span>
              <span className="font-medium">{service.duration} min</span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total a pagar:</span>
            <span className="text-green-600">
              {formatCurrency(service.price)}
            </span>
          </div>
        </div>

        {/* Métodos de pago */}
        <div className="space-y-3">
          <h3 className="font-semibold">Método de pago</h3>
        </div>

        {/* Botones de acción */}
        <div className="space-y-2 pt-4">
         
          <MercadoPagoButton
            businessId={businessId}
            title={service.name_service}
            price={service.price}
          />


          <Button variant="ghost" onClick={onCancel} className="w-full">
            Cancelar
          </Button>
        </div>

        {/* Información de seguridad */}
        <div className="text-xs text-gray-500 text-center pt-2">
          <p>🔒 Tus datos están protegidos por Mercado Pago</p>
          <p>Certificado SSL y encriptación de datos</p>
        </div>
      </CardContent>
    </Card>
  );
};
