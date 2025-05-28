import { API_URL } from "./api_url";
import { Booking } from "@/types";
import axios from "axios";

export const createBooking = async (booking: Booking) => {
    const response = await axios.post(`${API_URL}/create_booking`, booking);
    return response.data;
}

export const get_booking = async(businessId:string) => {
    const response = await axios.get(`${API_URL}/get_booking/${businessId}`);
    return response.data;
}

export const get_user_booking = async(userId:string) => {
    const response = await axios.get(`${API_URL}/user_booking/${userId}`);
    return response.data;
}