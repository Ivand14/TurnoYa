import { subscriptionData } from "@/types/mercadopago";
import axios from "axios";
import { toast } from "sonner";
import { API_URL } from "../api_url";

export const subscription = async (subscriptionData: subscriptionData[]) => {
  const { free_trial, amount, reason, payer_email, pathname } =
    subscriptionData[0];
  console.log(subscriptionData);
  try {
    const response = await axios.post(`${API_URL}/subscribe`, {
      free_trial,
      amount,
      reason,
      email: payer_email || "",
      pathname,
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

export const subscripcionData = async (preapproval_id: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/plan/information/${preapproval_id}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const cancelSubscription = async (preapproval_id: string) => {
  try {
    const response = await axios.put(
      `${API_URL}/plan/cancel/${preapproval_id}`
    );
    if (response.status === 200) {
      toast("Suscripción cancelada correctamente");
    } else {
      toast("No se pudo cancelar la suscripción");
    }
  } catch (error) {
    console.log(error);
    toast("Error al cancelar la suscripción");
  }
};

export const reactivateSubscription = async (
  preapproval_id: string,
  businessId: string
) => {
  try {
    const response = await axios.post(`${API_URL}/reactive/subscription`, {
      preapproval_id,
      businessId,
    });
    if (response.status === 200) {
      toast(response.data.details);
    } else {
      toast("No se pudo cancelar la suscripción");
    }
  } catch (error) {
    console.log(error);
  }
};
