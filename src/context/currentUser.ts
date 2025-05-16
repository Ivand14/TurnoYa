import { create } from "zustand";

interface User {
    email: string;
    name: string;
    id: string;
    rol: string;
}

interface Current {
    user: User | null;
    isLogged: boolean;
    setIsLogged: (isLogged: boolean) => void;
    setUser: (user: User | null) => void;
}

export const current_user = create<Current>((set) => ({
    user: JSON.parse(localStorage.getItem("user") || "null"),
    isLogged: JSON.parse(localStorage.getItem("isLogged") || "false"),
    setIsLogged: (isLogged) => {
        localStorage.setItem("isLogged", JSON.stringify(isLogged));
        set({ isLogged });
    },
    setUser: (user) => {
        localStorage.setItem("user", JSON.stringify(user));
        set({ user });
    },
}));
