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

export function getDraftsUserWorkloads(
  userId: string,
  campusId: string,
  setWorkloads: any
) {
  const q = query(
    collection(db, "workloads", campusId, "workloads"),
    where("createdBy", "==", userId),
    where("validationProgress", "==", 0),
    orderBy("timestamp", "desc"),
    limit(10)
  );
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const items: any = [];
    querySnapshot.forEach((doc) => {
      items.push(doc.data());
    });

    setWorkloads(() => items);

    const source = querySnapshot.metadata.fromCache ? "local cache" : "server";

    console.log("workload Data came from " + source);
  });
  return unsubscribe;
}

export function getUserWorkloadsInProgress(
  userId: string,
  campusId: string,
  setWorkloadsInProgress: any
) {
  const q = query(
    collection(db, "workloads", campusId, "workloads"),
    where("createdBy", "==", userId),
    where("validationProgress", ">=", 1)
    // orderBy("timestamp", "desc")
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const items: any = [];
    querySnapshot.forEach((doc) => {
      items.push(doc.data());
    });

    setWorkloadsInProgress(() => items);
    const source = querySnapshot.metadata.fromCache ? "local cache" : "server";
    console.log("workload In Progress came from " + source);
  });
  return unsubscribe;
}

export function getApprovedUserWorkloads(
  userId: string,
  campusId: string,
  setApprovedWorkloads: any
) {
  const q = query(
    collection(db, "workloads", campusId, "workloads"),
    where("createdBy", "==", userId),
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

    console.log("Approved workloads  came from " + source);
  });
  return unsubscribe;
}

export async function uploadWorkloadToFirestore(
  workload: any,
  campusId: string,
  userId: string,
  validators: any,
  ownerSignature: string
) {
  const workloadRef = doc(collection(db, "workloads", campusId, "workloads"));
  const dataToUpload = {
    workload: JSON.parse(
      JSON.stringify({ ...workload, createdAt: Timestamp.now().toMillis() })
    ),
    timestamp: serverTimestamp(),
    createdBy: userId,
    ownerSignature,
    validationProgress: 0,
    approved: false,
    validators: validators,
    workloadId: workloadRef.id,
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
  console.log(campusId, positionIndex);

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
    console.log("workload In Progress came from " + source);
  });
}

export function getFacultyWorkloads(
  campusId: string,
  positionIndex: number,
  setFacultyWorkloads: any
) {
  const q = query(
    collection(db, "workloads", campusId, "workloads"),
    // where("validators", "array-contains", { uid: "" }),
    where("validationProgress", "==", positionIndex),
    orderBy("timestamp", "desc"),
    limit(10)
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
    usersSnapshots.forEach((snapshot) => {
      data.push(snapshot.data());
    });

    console.log("validators from cache");
    // console.log(usersSnapshots.metadata);

    return data;
  } catch (error) {
    const usersSnapshots = await getDocs(userValidatorsRef);
    usersSnapshots.forEach((user) => {
      data.push(user.data());
    });
  }

  return data;
}

export async function getUserProfileFromCacheElseServer(
  userId: string,
  fromServer: boolean
) {
  const userRef = doc(db, "users", userId);
  if (fromServer) {
    try {
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        console.log(userSnap.metadata);
        console.log("Document data:", userSnap.data());
        return userSnap.data();
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      return null;
    }
  } else {
    try {
      const doc = await getDocFromCache(userRef);
      console.log(doc.metadata, "from cache user");
      // doc.metadata.hasPendingWrites
      // console.log(doc.data());

      return doc.data();
    } catch (error) {
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        console.log(userSnap.metadata);
        console.log("Document data:", userSnap.data());
        return userSnap.data();
      } else {
        console.log("No such document!");
        return null;
      }
    }
  }
}

export async function submitWorkload(
  workloadId: string,
  campusId: string,
  toValidate?: boolean,
  validatorId?: string
) {
  console.log(workloadId, campusId);

  const workloadRef = doc(db, "workloads", campusId, "workloads", workloadId);
  if (toValidate) {
    await updateDoc(workloadRef, {
      validationProgress: increment(1),
      [`validators.${validatorId}.validated`]: true,
    });
  } else {
    await updateDoc(workloadRef, { validationProgress: increment(1) });
  }
}
