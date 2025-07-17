import axios from "axios";
import { useEffect } from "react";
import { toast } from "sonner";

const useCheckPaymentStatus = () => {
  useEffect(() => {
    const checkPayment = async () => {
      const paramsStatus = new URLSearchParams(window.location.search);
      const paymentId = paramsStatus.get("payment_id");
      const status = paramsStatus.get("status");
      const paymentType = paramsStatus.get("payment_type");

      try {
        if (paymentId) {
          const response = await axios.post(
            `https://turnosya-backend.onrender.com/payment`,
            {
              data: { id: paymentId },
            }
          );

          console.log(response.data);

          if (response?.data?.status === "approved") {
            toast.success("Pago realizado con éxito!");
          } else {
            toast.warning(
              `Estado del pago: ${response?.data?.status || "desconocido"}`
            );
          }
        }
      } catch (error) {
        console.error("Error al verificar el estado del pago:", error);
        toast.error("Hubo un error al consultar el pago");
      }
    };

    checkPayment();
  }, []);
};

export default useCheckPaymentStatus;
