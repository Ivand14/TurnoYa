import { create } from "zustand";

interface User {
    
        name: string;
        email: string;
        id: string;
        rol: string;
    
}

interface Current {
    user: User | null;

    setUser: (user: User | null) => void;
}

export const current_user = create<Current>((set) => ({
    user: JSON.parse(localStorage.getItem("user") || "null"),

    setUser: (user) => {
        localStorage.setItem("user", JSON.stringify(user));
        set({ user });
    },
}));
