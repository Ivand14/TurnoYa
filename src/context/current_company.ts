import { profileSettings } from "@/apis/config/businessConfig";
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
}

interface current_company {
  company: Company | null;
  setCompany: (company: Company | null) => void;
  fetchUpdateProfile: (profile: Partial<settings>, businessId: string) => void;
}

socket.on("update_profile", ({ action, profile }) => {
  const company = Array.isArray(profile) ? profile[0] : profile;
  if (action === "update") {
    compnay_logged.getState().setCompany(company);
  }
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
}));

// company:

// {

//   id: 'dufCoirvZOSbEXWlIFEJwKIbnL42',

//   subscriptionPlan: 'Profesional',

//   owner: 'Ivan Dicesare',

//   phone: '+542615540317',

//   company_type: 'sports',

//   address: 'Calle Palma 330',

//   logo:

//     'https://storage.googleapis.com/turnosya-c5672.firebasestorage.app/company_profile/plantilla-logotipo-futbol-dibujado-mano_23-2149364523.jpg',

//   company_name: 'Futbol club',

//   rol: 'business',

//   email: 'ivanmoyano993@gmail.com',

//   description: 'Canchas de cesped natural y sintetico futbol 5/7/8'

// }
