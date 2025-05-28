import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, ExternalLink, Loader2 } from "lucide-react";
import React, { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreatePreferenceRequest } from "@/types/mercadopago";
import { Separator } from "@/components/ui/separator";
import { Service } from "@/types";
import { current_user } from "@/context/currentUser";
import { mercadoPagoService } from "@/services/mercadoPagoService";
import { toast } from "sonner";

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
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  service,
  bookingData,
  onPaymentSuccess,
  onCancel
}) => {
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const { user } = current_user();

  const handleCreatePayment = async () => {
    setIsCreatingPayment(true);

    try {

      const phoneNumber = bookingData.phone?.replace(/[^\d]/g, "") || "";
      const areaCode = phoneNumber.substring(0, 3) || "011";
      const number = phoneNumber.substring(3) || "12345678";

      const preferenceData: CreatePreferenceRequest = {
        items: [
          {
            id: service.id,
            title: service.name_service,
            description: service.description,
            quantity: 1,
            currency_id: "ARS",
            unit_price: service.price
          }
        ],
        payer: {
          name: user?.name,
          email: user?.email,
          phone: {
            area_code: areaCode,
            number: number
          }
        },
        back_urls: {
          success: `${window.location.origin}/payment-success`,
          failure: `${window.location.origin}/payment-failure`,
          pending: `${window.location.origin}/payment-pending`
        },
        auto_return: "approved",
        external_reference: `BOOKING_${Date.now()}`,
        notification_url: `${window.location.origin}/api/mercadopago/webhook`
      };

      const preference = await mercadoPagoService.createPreference(
        preferenceData
      );
      const paymentUrl = mercadoPagoService.generatePaymentUrl(
        preference.id,
        true
      );

      setPaymentUrl(paymentUrl);

      // Abrir en nueva ventana
      const newWindow = window.open(
        paymentUrl,
        "_blank",
        "width=800,height=600"
      );

      if (!newWindow) {
        toast.error(
          "Por favor, permite las ventanas emergentes para continuar con el pago"
        );
        return;
      }

      // Simular éxito del pago después de un tiempo (en un entorno real esto vendría del webhook)
      setTimeout(() => {
        onPaymentSuccess({
          preferenceId: preference.id,
          paymentUrl,
          status: "pending"
        });
      }, 3000);
    } catch (error) {
      console.error("Error al crear el pago:", error);
      toast.error("Error al procesar el pago. Inténtalo nuevamente.");
    } finally {
      setIsCreatingPayment(false);
    }
  };

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
          <Button
            onClick={handleCreatePayment}
            disabled={isCreatingPayment}
            className="w-full"
          >
            {isCreatingPayment ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pagar con Mercado Pago
              </>
            )}
          </Button>

          {paymentUrl && (
            <Button
              variant="outline"
              onClick={() => window.open(paymentUrl, "_blank")}
              className="w-full"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Abrir ventana de pago
            </Button>
          )}

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
