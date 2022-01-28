import {
  AppOptions,
  cert,
  getApp,
  getApps,
  initializeApp,
  ServiceAccount,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const credentials: ServiceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, "\n"),
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
};

const options: AppOptions = {
  credential: cert(credentials),
  // databaseURL: process.env.databaseURL,
};

function createFirebaseAdminApp(config: AppOptions) {
  if (getApps().length === 0) {
    return initializeApp(config);
  } else {
    return getApp();
  }
}

const firebaseAdmin = createFirebaseAdminApp(options);
export const adminAuth = getAuth(firebaseAdmin);
export const adminFirestore = getFirestore(firebaseAdmin);
