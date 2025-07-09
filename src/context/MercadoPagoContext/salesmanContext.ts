import { API_URL } from "@/apis/api_url";
import { access_token_salesman } from "@/apis/MercadoPagoApis/salesmanData";
import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface salesmanData {
  brand_name: string;
  email: string;
  identification: {
    number: number;
    type: string;
  };
  picture_url: string;
  fetchAccessTokenData?: (businessId: string) => Promise<void>;
  accountType: string;
  phone: string;
}

interface salesmanStore extends salesmanData {
  setSalesman: (data: salesmanData) => void;
  clearSalesman: () => void;
}

export const salesmanContext = create<salesmanStore>()(
  persist(
    (set) => ({
      brand_name: "",
      email: "",
      identification: { number: 0, type: "" },
      picture_url: "",
      accountType: "",
      phone: "",

      fetchAccessTokenData: async (businessId) => {
        try {
          const res = await axios(`${API_URL}/salesman/${businessId}`);
          const data = await res.data.details;

          const {
            first_name,
            last_name,
            email,
            identification,
            thumbnail,
            registration_identifiers,
          } = data;

          set({
            brand_name: `${first_name} ${last_name}` || "",
            email: email || "",
            identification: identification || { number: 0, type: "" },
            picture_url: thumbnail?.picture_url || "",
            accountType: "oauth",
            phone: `+${registration_identifiers[0]?.metadata?.country_code} ${registration_identifiers[0]?.metadata?.number}`,
          });
        } catch (error) {
          console.error("fetchAccessTokenData error:", error);
        }
      },
      setSalesman: (data: salesmanData) => set({ ...data }),
      clearSalesman: () =>
        set({
          brand_name: "",
          email: "",
          identification: { number: 0, type: "" },
          picture_url: "",
          accountType: "",
          phone: "",
        }),
    }),
    {
      name: "salesman-store",
    }
  )
);
