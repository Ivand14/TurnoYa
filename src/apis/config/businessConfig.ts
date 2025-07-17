import { API_URL } from "@/apis/api_url";
import { settings } from "@/types/accountSettings";
import axios from "axios";

export const profileSettings = async (
  profile: Partial<settings>,
  businessId: string
) => {
  const url = `${API_URL}/config/profile`;
  const formData = new FormData();

  if (profile.name) formData.append("name", profile.name);
  if (profile.email) formData.append("email", profile.email);
  if (profile.phone) formData.append("phone", profile.phone);
  if (profile.address) formData.append("address", profile.address);
  if (profile.description) formData.append("description", profile.description);
  formData.append("businessId", businessId);

  if (profile.logo && profile.logo instanceof File) {
    formData.append("logo", profile.logo);
  }

  console.log(profile);

  try {
    const response = await axios.patch(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al enviar el perfil:", error);
  }
};
