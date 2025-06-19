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
  fetchAccessTokenData?: (businessId: string) => void;
  accountType: string;
}

export const salesmanContext = create<salesmanData>()(
  persist(
    (set) => ({
      brand_name: "",
      email: "",
      identification: { number: 0, type: "" },
      picture_url: "",
      accountType: "",

      fetchAccessTokenData: async (businessId) => {
        try {
          const res = await axios(
            `${API_URL}/salesman/${businessId}`
          );
          const data = await res.data.details;

        const{company,email,identification,thumbnail} = data

          set({
            brand_name: company.brand_name || "",
            email: email || "",
            identification: identification || { number: 0, type: "" },
            picture_url: thumbnail?.picture_url || "",
            accountType: "oauth",
          });
        } catch (error) {
          console.error("fetchAccessTokenData error:", error);
        }
      },
    }),
    {
      name: "salesman-store", 
    }
  )
);
