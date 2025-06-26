import axios from "axios"
import { API_URL } from "../api_url"

export const access_token_salesman = async(businessId:string) => {
    const response = await axios.get(`${API_URL}/salesman/${businessId}`)
    try {
        return response
    } catch (error) {
        console.log("salesman data:",error);
    }
}