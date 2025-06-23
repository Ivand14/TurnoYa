import { API_URL } from "./api_url";
import axios from "axios";

export const register_business = async (
    businessName: string,
    ownerName: string,
    email: string,
    phone: string,
    address: string,
    businessType: string,
    description: string,
    logo: File, // Archivo correctamente tipado
    password: string
) => {
    try {
        const url = `${API_URL}/register_company`;


        // Crear `FormData` para manejar la subida del archivo
        const formData = new FormData();
        formData.append("businessName", businessName);
        formData.append("ownerName", ownerName);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("address", address);
        formData.append("businessType", businessType);
        formData.append("description", description);
        formData.append("password", password);

        // Agregar el archivo al FormData
        formData.append("logo", logo);


        // Enviar la solicitud con `multipart/form-data`
        const response = await axios.post(url, formData, {
            "headers": {
                "Content-Type": "multipart/form-data"
            }
        });
        return response
    } catch (error) {
        console.log(error.response.data)
        return error.response.data
    }
};



export const getAllBusiness = async() => {
    try {
        const url = `${API_URL}/all_business`;
        const response = await axios.get(`${url}`)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const getBusinessId = async(id:string) => {
    try {
        const url = `${API_URL}/business/${id}`;
        const response = await axios.get(url)
        return response
    } catch (error) {
        console.log(error)
        return error
    }
}