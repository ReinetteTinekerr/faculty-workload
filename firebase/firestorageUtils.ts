import {
  getDownloadURL,
  ref,
  uploadString,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../firebase/clientApp";

export async function uploadImage(image: string, uid: string) {
  const userSignatureRef = ref(storage, `signatures/${uid}/signature`);
  const metadata = {
    contentType: "image/jpeg",
  };
  if (typeof image === "string") {
    const snapshot = await uploadString(
      userSignatureRef,
      image,
      "data_url",
      metadata
    );
    return snapshot;
  } else {
  }
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
