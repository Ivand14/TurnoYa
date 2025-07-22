import { API_URL } from "./api_url";
import { Booking } from "@/types";
import axios from "axios";

export const createBooking = async (booking: Booking) => {
  const response = await axios.post(`${API_URL}/create_booking`, booking);
  return response.data;
};

export const get_booking = async (businessId: string) => {
  const response = await axios.get(`${API_URL}/get_booking/${businessId}`);
  return response.data;
};

export const get_user_booking = async (userId: string) => {
  const response = await axios.get(`${API_URL}/user_booking/${userId}`);
  return response.data;
};

export const delete_booking = async (bookingId: string) => {
  const response = await axios.delete(`${API_URL}/cancel_booking/${bookingId}`);
  return response.data;
};

export const patch_status_book = async (
  booking_id: string,
  new_status: string,
  paymentAmount: number,
  price: number
) => {
  try {
    const response = await axios.patch(`${API_URL}/status_book`, {
      booking_id,
      new_status,
      paymentAmount,
      price,
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
