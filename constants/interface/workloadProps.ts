import { Dispatch, SetStateAction } from "react";
import { AuthUser } from "./firebaseUser";
import { UserProfileProps, WorkloadDataProps } from "./formProps";

export interface ShowModalProps extends AuthUser, UserProfileProps {
  visible?: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  workloads?: any;
  workloadsInProgress?: any;
  approvedWorkloads?: any;
  facultyMembers?: UserProfileProps[] | null;
  selectedSchoolYear?: string;
  setSelectedSchoolYear?: any;
}
