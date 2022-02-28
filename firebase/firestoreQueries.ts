import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocFromCache,
  getDocs,
  getDocsFromCache,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./clientApp";

// FACULTY
export async function unsubmitWorkload(workloadId: string, campusId: string) {
  const workloadRef = doc(db, "workloads", campusId, "workloads", workloadId);
  await updateDoc(workloadRef, { validationProgress: 0 });
}

export async function deleteWorkload(workloadId: string, campusId: string) {
  const workloadRef = doc(db, "workloads", campusId, "workloads", workloadId);
  await deleteDoc(workloadRef);
}

export function getWorkloadsBySchoolYear(
  userId: string,
  campusId: string,
  setWorkloads: any,
  role: string,
  college: string,
  schoolYear: string
) {
  const q =
    role == "FACULTY" || role == "VALIDATOR"
      ? query(
          collection(db, "workloads", campusId, "workloads"),
          where("createdBy", "==", userId),
          where("workload.schoolYear", "==", schoolYear),
          // where("validationProgress", "==", 0),
          orderBy("timestamp", "desc"),
          limit(3)
        )
      : query(
          collection(db, "workloads", campusId, "workloads"),
          where("workload.college", "==", college),
          where("workload.schoolYear", "==", schoolYear),
          orderBy("timestamp", "desc"),
          limit(120)
        );
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const items: any = [];
    querySnapshot.forEach((doc) => {
      items.push(doc.data());
    });

    setWorkloads(() => items);

    const source = querySnapshot.metadata.fromCache ? "local cache" : "server";
    console.log(source);
  });
  return unsubscribe;
}

export function getUserWorkloadsInProgress(
  userId: string,
  campusId: string,
  setWorkloadsInProgress: any,
  role: string,
  college: string
) {
  const q =
    role === "FACULTY"
      ? query(
          collection(db, "workloads", campusId, "workloads"),
          where("createdBy", "==", userId),
          where("validationProgress", ">=", 1),
          where("approved", "==", false)
          // orderBy("timestamp", "desc")
        )
      : query(
          collection(db, "workloads", campusId, "workloads"),
          where("workload.college", "==", college),
          where("validationProgress", ">=", 1),
          where("approved", "==", false)
        );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const items: any = [];
    querySnapshot.forEach((doc) => {
      items.push(doc.data());
    });

    setWorkloadsInProgress(() => items);
    const source = querySnapshot.metadata.fromCache ? "local cache" : "server";
  });
  return unsubscribe;
}

export function getApprovedUserWorkloads(
  userId: string,
  campusId: string,
  setApprovedWorkloads: any,
  role: string,
  college: string
) {
  const q =
    role === "FACULTY"
      ? query(
          collection(db, "workloads", campusId, "workloads"),
          where("createdBy", "==", userId),
          where("approved", "==", true)
          // orderBy("timestamp", "desc")
        )
      : query(
          collection(db, "workloads", campusId, "workloads"),
          where("workload.college", "==", college),
          where("approved", "==", true)
          // orderBy("timestamp", "desc")
        );
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const items: any = [];
    querySnapshot.forEach((doc) => {
      items.push(doc.data());
    });

    setApprovedWorkloads(() => items);
    const source = querySnapshot.metadata.fromCache ? "local cache" : "server";
  });
  return unsubscribe;
}

export function getCollegeFacultyMembers(
  campusId: string,
  college: string,
  setFacultyMembers: any
) {
  const q = query(
    collection(db, "users"),
    where("campus", "==", campusId),
    where("college", "==", college)
  );
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const items: any = [];
    querySnapshot.forEach((doc) => {
      items.push(doc.data());
    });

    setFacultyMembers(() => items);
    const source = querySnapshot.metadata.fromCache ? "local cache" : "server";
    console.log(source);
  });

  return unsubscribe;
}

export async function getProgramChairmanMembers(campusId: string) {
  const programChairman = "Program Chairman";
  const programChairs: any[] = [];
  const q = query(
    collection(db, "users"),
    where("campus", "==", campusId),
    where("position", ">=", programChairman),
    where("position", "<", programChairman + "\uf8ff")
  );
  const docs = await getDocs(q);
  docs.forEach((doc) => {
    if (doc.exists()) {
      programChairs.push(doc.data());
    }
  });
  return programChairs;
}

export async function uploadWorkloadToFirestore(
  workload: any,
  campusId: string,
  userId: string,
  validators: any,
  ownerSignature: string,
  programChairUID: string
) {
  const workloadRef = doc(collection(db, "workloads", campusId, "workloads"));
  const dataToUpload = {
    workload: JSON.parse(
      JSON.stringify({ ...workload, createdAt: Timestamp.now().toMillis() })
    ),
    timestamp: serverTimestamp(),
    createdBy: userId,
    ownerSignature,
    // validationProgress: -1,
    submitted: false,
    approved: false,
    validators: validators,
    workloadId: workloadRef.id,
    programChairUID,
  };
  const docRef = await setDoc(workloadRef, dataToUpload);
  return dataToUpload;
}

// VALIDATOR
export function getValidatedWorkloads(
  campusId: string,
  positionIndex: number,
  setValidatedWorkloads: any
) {
  const q = query(
    collection(db, "workloads", campusId, "workloads"),
    where("validationProgress", ">", positionIndex)
  );
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const items: any[] = [];
    querySnapshot.forEach((doc) => {
      items.push(doc.data());
    });
    setValidatedWorkloads(() => items);
    const source = querySnapshot.metadata.fromCache ? "local cache" : "server";
  });
}

export function getFacultyWorkloads(
  campusId: string,
  setFacultyWorkloads: any,
  selectedSchoolYear: string,
  selectedSemester: string
) {
  const q = query(
    collection(db, "workloads", campusId, "workloads"),
    // where("validationProgress", "==", positionIndex),
    where("workload.semester", "==", selectedSemester),
    where("workload.schoolYear", "==", selectedSchoolYear),
    orderBy("timestamp", "desc"),
    limit(2000)
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const items: any = [];
    querySnapshot.forEach((doc) => {
      items.push(doc.data());
    });

    setFacultyWorkloads(items);
  });
  return unsubscribe;
}

export function getProgramChairs(
  campusId: string,
  schoolYear: string,
  uid: string,
  setFacultyWorkloads: any,
  selectedSemester: string
) {
  const q = query(
    collection(db, "workloads", campusId, "workloads"),
    where("workload.schoolYear", "==", schoolYear),
    where("workload.semester", "==", selectedSemester),
    where("programChairUID", "==", uid),
    orderBy("timestamp", "desc"),
    limit(2000)
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const items: any[] = [];
    querySnapshot.forEach((doc) => {
      if (doc.exists()) {
        items.push(doc.data());
      }
    });
    setFacultyWorkloads(items);
    console.log(items, "items");
  });

  return unsubscribe;
}

// ADMIN
export async function getCampusWorkloads(
  campusId: string,
  setCampusWorkloads: any
) {
  const q = query(
    collection(db, "workloads", campusId, "workloads"),
    orderBy("timestamp", "desc"),
    limit(30)
  );
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const items: any[] = [];
    querySnapshot.forEach((doc) => {
      items.push(doc.data());
    });
    setCampusWorkloads(() => items);
  });
  return unsubscribe;
}

export async function getUserProfile(uid: string) {
  // add caching
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
}

export async function updateUserProfile(uid: string, profile: object) {
  const userRef = doc(db, "users", uid);
  try {
    await setDoc(userRef, { ...profile }, { merge: true });
  } catch (error) {
    console.log(error);
  }
}

// SHARED
export async function updateUserSignature(uid: string, url: string) {
  const userRef = doc(db, "users", uid);

  await setDoc(userRef, { signature: url }, { merge: true });
  // await updateDoc(userRef, { signature: url });
}

export async function getUsersByCampusAndRole(campusId: string, role: string) {
  const data: any[] = [];
  const userValidatorsRef = query(
    collection(db, "users"),
    where("campus", "==", campusId),
    where("role", "==", role)
    // orderBy("positionIndex", "asc")
  );

  try {
    const usersSnapshots = await getDocsFromCache(userValidatorsRef);
    if (usersSnapshots.empty) throw "no data from cache";
    if (usersSnapshots.size <= 5) throw "insufficient validators";
    usersSnapshots.forEach((snapshot) => {
      data.push(snapshot.data());
    });

    //

    return data;
  } catch (error) {
    const usersSnapshots = await getDocs(userValidatorsRef);
    usersSnapshots.forEach((user) => {
      data.push(user.data());
    });
  }

  return data;
}

export async function getUsersByCampusAndRoleAndCollege(campusId: string) {}

export async function getUserProfileFromCacheElseServer(
  userId: string,
  fromServer: boolean
) {
  const userRef = doc(db, "users", userId);
  if (fromServer) {
    try {
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return userSnap.data();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  } else {
    try {
      const doc = await getDocFromCache(userRef);

      // doc.metadata.hasPendingWrites
      //

      return doc.data();
    } catch (error) {
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return userSnap.data();
      } else {
        return null;
      }
    }
  }
}

export async function submitWorkload(
  workloadId: string,
  campusId: string,
  toValidate?: boolean,
  validatorId?: string,
  validators?: any
) {
  //
  // isReadyForApproval(validators);

  const workloadRef = doc(db, "workloads", campusId, "workloads", workloadId);
  if (toValidate) {
    let approved = false;
    if (isReadyForApproval(validators)) approved = true;

    await updateDoc(workloadRef, {
      // validationProgress: increment(1),
      submitted: true,
      [`validators.${validatorId}.validated`]: true,
      approved: approved,
    });
  } else {
    await updateDoc(workloadRef, { submitted: true });
  }
}

function isReadyForApproval(validators: object) {
  const validatedArr = Object.values(validators).map(
    (validator) => validator.validated
  );
  const sumValidated = validatedArr.reduce((prev, curr) => prev + curr);

  return sumValidated + 1 >= validatedArr.length;
}
