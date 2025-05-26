import { create } from "zustand";

interface Current {

    isLogged: boolean;
    setIsLogged: (isLogged: boolean) => void;

}

export const Logged = create<Current>((set) => ({

    isLogged: JSON.parse(localStorage.getItem("isLogged") || "false"),
    setIsLogged: (isLogged) => {
        localStorage.setItem("isLogged", JSON.stringify(isLogged));
        set({ isLogged });
    },

}));