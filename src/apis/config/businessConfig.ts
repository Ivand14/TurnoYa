import { API_URL } from "@/apis/api_url";
import { settings } from "@/types/accountSettings";
import axios from "axios";

export const profileSettings = async (
  profile: Partial<settings>,
  businessId: string
) => {
  const url = `${API_URL}/config/profile`;

  const{logo,name,email,phone,address,description} = profile;

  try {
    const response = await axios.patch(url, {
      name,
      email,
      phone,
      address,
      description,
      logo,
      businessId
    });
    return response.data;
  } catch (error) {
    console.error("Error al enviar el perfil:", error);
  }
};
