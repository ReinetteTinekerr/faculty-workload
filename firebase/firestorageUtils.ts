import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "../firebase/clientApp";

export async function uploadImage(image: string, uid: string) {
  const userSignatureRef = ref(storage, `signatures/${uid}/signature`);
  const snapshot = await uploadString(userSignatureRef, image, "data_url", {
    // cacheControl: "no-cache",
  });
  return snapshot;
}

export async function getImageURL(uid: string) {
  const signaturePathReference = ref(storage, `signatures/${uid}/signature`);
  try {
    const url = await getDownloadURL(signaturePathReference);
    return url + "&" + Date.now();
  } catch (error) {
    return null;
  }
}
