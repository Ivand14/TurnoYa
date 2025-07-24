import { storage } from "@/firebase.config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadLogoToFirebase = async (file: File): Promise<string> => {
  const filePath = `temp_logos/${Date.now()}_${file.name}`;
  const fileRef = ref(storage, filePath);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  return url;
};
