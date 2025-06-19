import React, { useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { create_preferences } from "@/apis/MercadoPagoApis/create_preferences";

initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, { locale: "es-AR" });

interface Props {
  businessId: string;
  title:string;
  price:number;
}

const MercadoPagoButton: React.FC<Props> = ({ businessId,title,price }) => {
  const [preferenceId, setPreferenceId] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePago = async () => {
    setLoading(true);
    try {
      const res = await create_preferences(businessId,title,price)
      console.log(res);
    //   setPreferenceId(data.id);
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
        <Wallet initialization={{ preferenceId }} customization={{ theme: "default" }} />
      )}
    </div>
  );
};

export default MercadoPagoButton;
