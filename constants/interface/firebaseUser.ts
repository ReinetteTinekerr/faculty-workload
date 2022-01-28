import { User } from "firebase/auth";

export interface AuthUser {
  user?: User | null | undefined;
}
