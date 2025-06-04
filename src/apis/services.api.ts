import { API_URL } from "./api_url";
import { Service } from "@/types";
import axios from "axios";

export const create_service = async(service:Service) => {
    
    try {
        const url = `${API_URL}/create_service`
        const response = await axios.post(url,{service})
        return response.data
    } catch (error) {
        console.log("error al crear el servicio", error)
    }
}

export const get_services = async(businessId:string) => {
    try {
        const url = `${API_URL}/get_services/${businessId}`
        const response = await axios.get(url)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const delete_service = async(id: string) => {
    try {
        const url = `${API_URL}/delete_service`
        const response = await axios.delete(url,{
            data:{
                id:id
            }
        })
        return response
    } catch (error) {
        console.log(error)
    }
}

export const patchService = async(data:Service,serviceId:string) =>{
    const url = `${API_URL}/update_service_card/${serviceId}`
    const response = await axios.patch(url,data)
    return response
}