import axios from "axios";
import { API_URL } from "../api_url";
import { toast } from "sonner";

export const create_preferences = async (
  businessId: string,
  title: string,
  price: number,
  bookingId: string
) => {
  try {
    const response = await axios.post(
      `${API_URL}/payment/create_preferences/${businessId}`,
      {
        title,
        price,
        bookingId,
      }
    );
    const { init_point } = response.data;
    if (init_point) {
      window.location.href = init_point;
    } else {
      toast.error("No se pudo inciar el pago");
    }
    return response;
  } catch (error) {
    console.log(error.response.data);
    toast.error("error al iniciar el pago");
  }
};
