import { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminFirestore } from "../../firebase/adminApp";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { uid, password } = req.body;
  try {
    await adminAuth.updateUser(uid, { password });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(401).json({ success: false });
  }
}
