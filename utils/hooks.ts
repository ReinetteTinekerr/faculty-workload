import { auth } from "../firebase/clientApp";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getUserProfileFromCacheElseServer } from "../firebase/firestoreService";
import {
  kAdminRole,
  kCollegeSecretaryRole,
  kFacultyRole,
  kValidatorRole,
} from "constants/constants";

// const converter = {
//   toFirestore: (data: UserProfileProps) => data,
//   fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
//     snap.data() as UserProfileProps
// }

export function useAuthSession() {
  const [user, loading, error] = useAuthState(auth);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  const router = useRouter();
  const currentRoute = router.pathname;

  useEffect(() => {
    if (!loading && !user) router.replace("/login");

    if (user && userData === null) {
      getUserProfileFromCacheElseServer(user.uid, false).then((docProfile) => {
        setUserData(docProfile);
      });
    }
    if (user && userRole === null) {
      user?.getIdTokenResult().then(async (idTokenResult) => {
        const role = idTokenResult.claims.role as string;

        if (
          currentRoute === "/faculty" &&
          ![kFacultyRole, kValidatorRole, kCollegeSecretaryRole].includes(role)
        ) {
          router.push("/404");
        } else if (currentRoute === "/admin" && role !== kAdminRole) {
          router.push("/404");
        } else if (
          currentRoute === "/validate-workloads" &&
          role !== kValidatorRole
        ) {
          router.push("/404");
        } else if (
          (currentRoute === "/login" || currentRoute === "/") &&
          role === kAdminRole
        ) {
          router.replace("/admin");
        } else if (
          (currentRoute === "/login" || currentRoute === "/") &&
          role === kValidatorRole
        ) {
          router.replace("/validate-workloads");
        } else if (
          ((currentRoute === "/login" || currentRoute === "/") &&
            role === kFacultyRole) ||
          role === kCollegeSecretaryRole
        ) {
          router.replace("/faculty");
        }
        setUserRole(role);
      });
    }
  }, [user, loading]);
  return [user, loading, error, userRole, userData];
}
