import app from "@/firebase.config"
import { clsx, type ClassValue } from "clsx"

import { getAuth, signOut } from "firebase/auth"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const logout = async() => {
  const auth = getAuth(app)
  await signOut(auth).then(()=>{
    localStorage.removeItem('sessionId');
    toast.success("Has cerrado sesion");
  }).catch((error)=>{
    console.log(error)
  })
}