import { API_URL } from "./api_url";
import axios from "axios";

export const recoverPass = (email:string,new_password?:string) => {
    const url = `${API_URL}/new-password`
    return axios.post(`${url}`,{email})
}