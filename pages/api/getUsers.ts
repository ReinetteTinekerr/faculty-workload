import { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminFirestore } from "../../firebase/adminApp";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const users = await listAllUsers(1);

  return res.status(200).json(users);
}
const listAllUsers = async (nextPageToken: any) => {
  // const users: any[] = [];
  const usersRef = await adminAuth.listUsers(1000);
  const users = usersRef.users.map((user) => {
    const { displayName, email, metadata, customClaims, uid } = user;
    const role = customClaims?.role;

    const { creationTime, lastSignInTime } = metadata;
    return { displayName, email, creationTime, lastSignInTime, role, uid };
  });
  // adminAuth.listUsers(1000).then((listUsersResult) => {
  //   listUsersResult.users.forEach((userRecord) => {
  //     console.log(userRecord.toJSON());
  //     const { displayName, email, metadata, customClaims, uid } = userRecord;
  //     users.push({ displayName, email, metadata, customClaims, uid });
  //   });
  // });
  return users;
};
