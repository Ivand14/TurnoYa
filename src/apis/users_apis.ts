import { GoogleAuthProvider, getAuth, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

import { API_URL } from "./api_url";
import app from "../firebase.config"
import axios from "axios"
import { toast } from 'sonner';

export const registro_usuario = async (email: string, password: string, name: string) => {
    return await axios.post(`${API_URL}/registrarse`, {
        email,
        password,
        name
    });

}


export const login_usuario = async (email: string, password: string) => {

    const auth = getAuth(app);
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const token = await user.getIdToken(); // Obtiene el token de Firebase

        // Envía el token al backend de Flask
        const response = await axios.post(`${API_URL}/login`, token, {
            "headers": {
                "Content-Type": "application/json"
            }
        });


        // Si el backend responde con éxito, guarda la sesión o el token de sesión
        if (response.data.success) {
            localStorage.setItem('sessionId', response.data.sessionId); // Ejemplo
            return response.data
            // Redirige al usuario, muestra un mensaje, etc.
        } else {
            console.error('Error en el inicio de sesión:', response.data.error);
            // Muestra un mensaje de error al usuario
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        // Muestra un mensaje de error al usuario
    }
};

export const singInWhithGoogle = async () => {
    const auth = getAuth(app)
    const provider = new GoogleAuthProvider()
    try {
        const result = await signInWithPopup(auth, provider)
        const user = result.user
        const token = await user.getIdToken()

        // Envía el token al backend de Flask
        const response = await axios.post(`${API_URL}/login`, token, {
            "headers": {
                "Content-Type": "application/json"
            }
        });

        // Si el backend responde con éxito, guarda la sesión o el token de sesión
        if (response.data.success) {
            localStorage.setItem('sessionId', response.data.sessionId); // Ejemplo
            return response.data
            // Redirige al usuario, muestra un mensaje, etc.
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error.response.data.details);
        const messageError = error.response.data.details
        // Muestra un mensaje de error al usuario
        toast.error(`Error al iniciar sesion: ${messageError}`);
    }
}

export const getUser = async(id: string) => {

    try {
        const response = await axios.post(`${API_URL}/user_data`, {id:id},{
            "headers":{
                "Content-Type":"application/json"
            }
        } )
        
        return response.data.user_data

    } catch (error) {
        console.log(error)
    }
}