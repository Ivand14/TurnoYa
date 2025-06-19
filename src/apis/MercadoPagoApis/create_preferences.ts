import axios from "axios"
import { API_URL } from "../api_url"

export const create_preferences = async(businessId:string,title:string,price:number) => {
    try {
        const response = await axios.post(`${API_URL}/payment/create_preferences/${businessId}`,{
            title,
            price
        })
        console.log(response);
        return response
    } catch (error) {
        console.log(error);
    }
}