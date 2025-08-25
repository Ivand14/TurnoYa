import { getUser, singInWhithGoogle } from "@/apis/users_apis";

export const loginGoogle = async () => {
  try {
    const loginGoogle = await singInWhithGoogle();
    if (!loginGoogle) return;
    const userData = await getUser(loginGoogle.sessionId);
    return {
      session: loginGoogle,
      user: userData,
    };
  } catch (error) {
    console.log(error);
  }
};
