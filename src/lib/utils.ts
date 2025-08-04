import app from "@/firebase.config";
import { clsx, type ClassValue } from "clsx";

import {
  EmailAuthProvider,
  getAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signOut,
  updateEmail,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { updatePassword } from "firebase/auth";
import { auth } from "@/firebase.config";

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
      toast.error(error);
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

export const resetEmail = async (email: string) => {

  console.log(email)

  const user = getAuth().currentUser;

  console.log(user)

  if (!user) return toast.error("No hay sesión activa");

  try {
    if (email) {
      await verifyBeforeUpdateEmail(user, email);
      toast.success(
        "Mail de verificación enviado. Confirmalo para aplicar el cambio."
      );
    }
  } catch (error: any) {
    switch (error.code) {
      case "auth/email-already-in-use":
        toast.error("Ese correo ya está vinculado a otra cuenta");
        break;
      case "auth/invalid-email":
        toast.error("El formato del correo es inválido");
        break;
      case "auth/requires-recent-login":
        toast.error(
          "Por seguridad, volvé a iniciar sesión para cambiar tu correo"
        );
        break;
      default:
        toast.error("Error al actualizar el correo");
    }
  }
};

export const emailForResetPass = async (email: string) => {
  const auth = getAuth();

  try {
    if (email) {
      await sendPasswordResetEmail(auth, email);
      toast.success(
        "Mail de verificación enviado. Confirmalo para aplicar el cambio."
      );
    }
  } catch (error) {
    toast.error("Error al actualizar la contraseña:", error.message);
  }
};
