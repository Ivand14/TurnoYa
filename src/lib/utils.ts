import app from "@/firebase.config";
import { clsx, type ClassValue } from "clsx";

import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  signOut,
  updateEmail,
} from "firebase/auth";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { updatePassword } from "firebase/auth";
import { auth } from "@/firebase.config";

const user = auth.currentUser;
console.log(user);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const logout = async () => {
  const auth = getAuth(app);
  await signOut(auth)
    .then(() => {
      localStorage.removeItem("sessionId");
      toast.success("Has cerrado sesion");
    })
    .catch((error) => {
      console.log(error);
    });
};

export const resetPassword = async (
  currentPassword: string,
  newPassword: string
) => {
  try {
    const user = getAuth().currentUser;
    if (!user || !user.email)
      throw new Error("Usuario no autenticado.Vuelve a iniciar sesion");

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);

    toast.success("Contraseña actualizada");
  } catch (error: any) {
    if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/wrong-password"
    ) {
      toast.error("La contraseña actual es incorrecta");
    } else {
      toast.error("Ocurrió un error al actualizar la contraseña");
    }
  }
};

export const resetEmail = (email: string) => {
  console.log(email);
  if (email) {
    updateEmail(user, email)
      .then(() => {
        toast.success("Email actualizado!");
      })
      .catch((error) => {
        error.code === "auth/email-already-in-use" &&
          toast.error("El correo ya esta ocupado por otro usuario");
        error.code === "auth/invalid-email" &&
          toast.error("El formato del correo es invalido");
      });
  }
};
