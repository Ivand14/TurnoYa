import axios from "axios";
import { API_URL } from "../api_url";

export const revokeAuthorization = async (businessId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/mp`, {
      data: businessId,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
