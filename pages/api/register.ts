import { RegisterFormProps } from "components/registerForm";
import { adminAuth, adminFirestore } from "../../firebase/adminApp";
import { NextApiRequest, NextApiResponse } from "next";
import { FieldValue } from "firebase-admin/firestore";
import { positionKeyValue } from "constants/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userData: RegisterFormProps = req.body;

  const { password, username, email, position } = userData;

  let positionIndex = -1;
  if (position !== "NONE") {
    Object.entries(positionKeyValue).forEach(([key, value]) => {
      if (position.toLowerCase().includes(key.toLowerCase())) {
        positionIndex = value;
        return;
      }
    });
    // positionIndex = positionKeyValue[position];
  }

  try {
    const userRecord = await createFirebaseUser({
      email,
      username,
      password,
    });

    const uid = userRecord!.uid;
    const campusRef = await addUserToCampus(userData, uid, positionIndex);

    const result = await createUserProfile(
      userData,
      uid,
      campusRef.id,
      positionIndex
    );

    return res.status(200).json({ user: userRecord });
  } catch (error) {
    return res.status(401).json({ error: error });
  }
}

interface CreateUserProps {
  email: string;
  username: string;
  password: string;
}
const createFirebaseUser = async ({
  email,
  username,
  password,
}: CreateUserProps) => {
  const userRecord = await adminAuth.createUser({
    email: email,
    displayName: username,
    password: password,
    emailVerified: true,
  });
  return userRecord;
};

const addUserToCampus = async (
  userData: RegisterFormProps,
  uid: string,
  positionIndex: number
) => {
  const {
    username,
    campus,
    college,
    email,
    role,
    position,
    masteral,
    doctorate,
    extension,
  } = userData;
  const campusRef = adminFirestore.collection("campuses").doc(campus);

  const campusObj = {
    timestamp: FieldValue.serverTimestamp(),
    campus: campus,
    members: FieldValue.arrayUnion(uid),
  };

  await campusRef.set(campusObj, { merge: true });
  return campusRef;
};

const createUserProfile = async (
  userData: RegisterFormProps,
  uid: string,
  campusId: string,
  positionIndex: number
) => {
  const {
    role,
    campus,
    college,
    email,
    username,
    baccalaureate,
    department,
    doctorate,
    masteral,
    position,
    extension,
  } = userData;

  await adminAuth.setCustomUserClaims(uid, { role });

  const result = await adminFirestore.collection("users").doc(uid).set({
    campus,
    college,
    email,
    username,
    baccalaureate,
    department,
    doctorate,
    masteral,
    position,
    positionIndex,
    uid,
    role,
    extension,
    campusId: campusId,
  });

  return result;
};
