import {
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "./clientApp";

interface SignInProps {
  email: string;
  password: string;
}

export const login = async ({ email, password }: SignInProps) => {
  try {
    await signInWithEmailAndPassword(auth, email.trim(), password);
    return { error: false, message: "sucess" };
  } catch (error) {
    return { error: true, message: error };
  }
};

export const logout = () => {
  signOut(auth);
};

export async function verifyEmail(user: User | null | undefined) {
  if (user && !user.emailVerified) {
    const actionCodeSettings = {
      url: `https://www.example.com/?email=${user.email}`,
      handleCodeInApp: true,
    };
    try {
      await sendEmailVerification(user, actionCodeSettings);
    } catch (error) {}
  }
}
