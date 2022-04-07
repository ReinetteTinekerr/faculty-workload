import {
  getDownloadURL,
  ref,
  uploadString,
  uploadBytes,
} from "firebase/storage";
//test develop branch
import { storage } from "./clientApp";

export async function uploadSignature(imageDataUrl: string, uid: string) {
  const userSignatureRef = ref(storage, `signatures/${uid}/signature`);
  const metadata = {
    contentType: "image/jpeg",
  };
  if (typeof imageDataUrl === "string") {
    const snapshot = await uploadString(
      userSignatureRef,
      imageDataUrl,
      "data_url",
      metadata
    );
    console.log(snapshot.metadata.fullPath);
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
