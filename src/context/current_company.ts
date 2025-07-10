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
  mercado_pago_connect?:boolean
}

interface current_company {
  company: Company | null;
  setCompany: (company: Company | null) => void;
}

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
}));
