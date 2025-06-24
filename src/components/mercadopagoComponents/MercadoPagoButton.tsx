import React, { useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { create_preferences } from "@/apis/MercadoPagoApis/create_preferences";

initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, { locale: "es-AR" });

interface PaymentData {
  preferenceId: string;
  paymentUrl: string;
  status: "pending" | "approved" | "rejected";
}

interface Props {
  businessId: string;
  title: string;
  price: number;
  onPaymentSuccess: (paymentData: PaymentData) => void;
}

const MercadoPagoButton: React.FC<Props> = ({
  businessId,
  title,
  price,
  onPaymentSuccess,
}) => {
  const [preferenceId, setPreferenceId] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePago = async () => {
    setLoading(true);
    try {
      const res = await create_preferences(businessId, title, price);
      console.log(res);
      setPreferenceId(res.data.preferenceId);
      onPaymentSuccess({
        preferenceId: res.data.preferenceId,
        paymentUrl: res.data.init_point,
        status: "pending",
      });
    } catch (err) {
      console.error("Error al crear preferencia:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!preferenceId ? (
        <button
          onClick={handlePago}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          {loading ? "Generando..." : "Pagar con Mercado Pago"}
        </button>
      ) : (
        <Wallet
          initialization={{ preferenceId }}
          customization={{ theme: "default" }}
        />
      )}
    </div>
  );
};

export default MercadoPagoButton;
