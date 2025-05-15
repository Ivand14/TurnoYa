import { User } from 'firebase/auth'
import {create} from 'zustand'

interface current{
    user: User | null;
    isLogged: boolean;
    setIsLogged: (isLogged:boolean) => void
}

export const current_user = create<current>((set)=>({
    user: null,
    isLogged: false,
    setIsLogged: (isLogged:boolean) => set({isLogged})
}))