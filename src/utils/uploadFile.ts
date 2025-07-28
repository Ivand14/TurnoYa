import supabase from "@/lib/supabase.config";

export const uploadLogoFile = async (file: File) => {
  try {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("uturns")
      .upload(`companylogo/${file.name}`, file);

    if (uploadError) {
      console.error("Error al subir imagen:", uploadError.message);
      return null;
    }

    console.log("Imagen subida:", uploadData);

    const publicUrl = supabase.storage
      .from("uturns")
      .getPublicUrl(`companylogo/${file.name}`);

    const url = publicUrl.data.publicUrl;

    return url;
  } catch (error) {
    console.error("Error general:", error);
    return null;
  }
};
