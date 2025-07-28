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
  logo_url: string,
  password: string,
  subscriptionPlan: string,
  preapproval_id: string
) => {
  try {
    const url = `${API_URL}/register_company/${preapproval_id}`;
    const response = await axios.post(url, {
      logo: logo_url,
      ownerName,
      businessName,
      email,
      phone,
      address,
      businessType,
      description,
      password,
      subscriptionPlan,
    });
    return response;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

export const getAllBusiness = async () => {
  try {
    const url = `${API_URL}/all_business`;
    const response = await axios.get(`${url}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getBusinessId = async (id: string) => {
  try {
    const url = `${API_URL}/business/${id}`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};
