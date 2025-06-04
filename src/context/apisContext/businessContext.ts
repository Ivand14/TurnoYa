import { getAllBusiness, getBusinessId } from '@/apis/business_apis';
import { Business } from '@/types';
import {create} from 'zustand';


interface BusinessContextState {
    allBusinesses: Business[];
    businessForId: Business[];
    loading: boolean;
    error: string | null;
    fetchAllBusinesses: () => Promise<void>;
    fetchBusinessById: (id:string) => Promise<void>;
}



export const useBusinessContext = create<BusinessContextState>((set) => ({
    allBusinesses: [],
    businessForId: null,
    loading: false,
    error: null,

    fetchAllBusinesses: async () => {
        set({ loading: true, error: null });
        try {
            const response = await getAllBusiness();
            if (response?.data) {
                set({ allBusinesses: response.data.details, loading: false, error: null });
            } else {
                set({ allBusinesses: [], loading: false, error: "Error al obtener los negocios" });
            }
        } catch (error) {
            set({ loading: false, error: error instanceof Error ? error.message : "Error desconocido" });
        }
    },

    fetchBusinessById: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const response = await getBusinessId(id);
            if (response?.data) {
                set({ businessForId: response.data.details, loading: false, error: null });
            } else {
                set({ businessForId: null, loading: false, error: "Error al obtener el negocio por ID" });
            }
        } catch (error) {
            set({ loading: false, error: error instanceof Error ? error.message : "Error desconocido" });
        }
    }
}));