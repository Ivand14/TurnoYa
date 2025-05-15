import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import { API_URL } from "./api_url";
import app from "../firebase.config"
import axios from "axios"

export const registro_usuario = async (email: string, password: string, name: string) => {
    return await axios.post(`${API_URL}/registrarse`, {
        email,
        password,
        name
    });

}

export const login_usuario = async (email: string, password: string) => {
    console.log("apis", email, password)
    const auth = getAuth(app)
    await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user
            localStorage.setItem('user', JSON.stringify(user));
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        })
    // return axios.post(`${API_URL}/login`,{email,password})
}