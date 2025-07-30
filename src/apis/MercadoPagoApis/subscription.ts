import { subscriptionData } from "@/types/mercadopago";
import axios from "axios";
import { toast } from "sonner";
import { API_URL } from "../api_url";

export const subscription = async (subscriptionData: subscriptionData[]) => {
  const { free_trial, amount, reason } = subscriptionData[0];
  try {
    const response = await axios.post(`${API_URL}/plan`, {
      free_trial,
      amount,
      reason,
    });
    const { init_point, status } = response.data;
    if (status === 200 && init_point) {
      window.location.href = init_point;
    } else {
      toast("No se pudo iniciar la subscripcion");
    }
  } catch (error) {
    console.log(error);
  }
};
