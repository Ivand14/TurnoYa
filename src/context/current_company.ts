import { create } from "zustand"

interface Company {
    address:string
    company_name:string
    company_type:string
    description:string
    email:string
    id:string
    logo:string
    owner:string
    phone:string
    rol:string
}

interface current_company{
    company: Company | null
    setCompany: (company:Company | null) => void
}


export const compnay_logged = create<current_company>((set)=>({
    company: JSON.parse(localStorage.getItem("company") || "null"),
    setCompany: (company) => {
        localStorage.setItem("company", JSON.stringify(company));
        set({ company });
    },
}))