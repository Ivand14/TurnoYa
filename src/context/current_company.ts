import { profileSettings } from "@/apis/config/businessConfig";
import { reactivateSubscription } from "@/apis/MercadoPagoApis/subscription";
import { settings } from "@/types/accountSettings";
import { socket } from "@/utils/socket";

import { create } from "zustand";

export interface Company {
  address: string;
  company_name: string;
  company_type: string;
  description: string;
  email: string;
  id: string;
  logo: string;
  owner: string;
  phone: string;
  rol: string;
  mercado_pago_connect?: boolean;
  preapproval_id?: string;
  mercado_pago_subscription: {
    id: string;
    next_payment_date: Date;
    reason: string;
    status: string;
  };
}

interface current_company {
  company: Company | null;
  setCompany: (company: Company | null) => void;
  fetchUpdateProfile: (profile: Partial<settings>, businessId: string) => void;
  fetchReactiveSubscription: (
    preapproval_id: string,
    businessId: string
  ) => Promise<company_subscription_update>;
}

interface company_subscription_update {
  mercado_pago_subscription: {
    id: string;
    status: string;
    next_payment_date: null | Date;
    reason: string;
  };
  preapproval_id: string;
}

socket.on("update_profile", ({ action, profile }) => {
  const company = Array.isArray(profile) ? profile[0] : profile;
  if (action === "update") {
    compnay_logged.getState().setCompany(company);
  }
});

socket.on("subscription_update", (newSubscription) => {
  console.log(newSubscription);
  const company = compnay_logged.getState().company;
  const updateCompany = {
    ...company,
    mercado_pago_subscription: newSubscription.mercado_pago_subscription,
    preapproval_id: newSubscription.preapproval_id,
  };
  console.log(updateCompany);
  compnay_logged.getState().setCompany(updateCompany);
});

export const compnay_logged = create<current_company>((set) => ({
  company: JSON.parse(localStorage.getItem("company") || "null"),
  setCompany: (company) => {
    if (company) {
      // Clonamos y filtramos mercado_pago si existe
      const { mercado_pago, ...safeData } = company as any;
      localStorage.setItem("company", JSON.stringify(safeData));

      set({ company: safeData });
    } else {
      localStorage.removeItem("company");
      set({ company: null });
    }
  },
  fetchUpdateProfile: async (profile, businessId) => {
    try {
      const response = await profileSettings(profile, businessId);
      if (response?.status === 200) {
        const updatePorfile = response.details[0];
        socket.emit("update_profile", {
          action: "update",
          profile: updatePorfile,
        });
        set((state) => ({
          company:
            state.company?.id === businessId ? updatePorfile : state.company,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  },
  fetchReactiveSubscription: async (preapproval_id, businessid) => {
    try {
      const response = await reactivateSubscription(preapproval_id, businessid);
      if (response.status === 200) {
        const updateSubscription = response.data.details;
        // console.log(updateSubscription);
        socket.emit("subscription_update", { updateSubscription });
        return updateSubscription;
      }
    } catch (error) {
      console.log(error);
    }
  },
}));
