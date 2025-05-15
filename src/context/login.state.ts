import { create } from 'zustand';

interface LoginState {
    email: string;
    password: string;
    loading:boolean;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    resetForm: () => void; // Añadimos una función para resetear el formulario
    setLoading: (loading:boolean) => void;
}

export const useLoginStore = create<LoginState>((set) => ({
    email: '',
    password: '',
    loading:false,
    setEmail: (email) => set({ email }),
    setPassword: (password) => set({ password }),
    setLoading: (loading: boolean) => set({ loading }),
    resetForm: () => set({ email: '', password: '' }), // Implementación de resetForm
}));
