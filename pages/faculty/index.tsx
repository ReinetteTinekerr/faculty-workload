import { NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import LoadingScreen from "components/layout/loadingScreen";
import { ActiveComponent } from "constants/enums/activeComponent";
import WorkloadIndex from "components/routes/faculty/WorkloadIndex";
import { ActiveComponentContext } from "context/activeComponentContext";
import WorkloadItem from "components/routes/faculty/WorkloadItem";
import UserProfile from "components/routes/faculty/UserProfile";
import { useAuthSession } from "utils/hooks";
import {
  getApprovedUserWorkloads,
  getUsersByCampusAndRole,
  getDraftsUserWorkloads,
  getUserWorkloadsInProgress,
} from "../../firebase/firestoreQueries";

const Faculty: NextPage = () => {
  const [user, loading, error, userRole, userData] = useAuthSession();
  const { activeComponent, selectedItem } = useContext(ActiveComponentContext)!;
  const [draftWorkloads, setDraftWorkloads] = useState<any>(null);
  const [workloadsInProgress, setWorkloadsInProgress] = useState<any>(null);
  const [approvedWorkloads, setApprovedWorkloads] = useState<any>(null);
  // const [workloads, setWorkloads] = useState<any>(null);

  useEffect(() => {
    if (!userData || !user) return;

    const unsubscribe1 = getDraftsUserWorkloads(
      user.uid,
      userData.campus,
      setDraftWorkloads
    );

    // return () => unsubscribe();
  }, [userData, user]);

  useEffect(() => {
    if (!userData || !user) return;

    const unsubscribe2 = getUserWorkloadsInProgress(
      user.uid,
      userData.campus,
      setWorkloadsInProgress
    );
  }, [userData, user]);

  useEffect(() => {
    if (!userData || !user) return;
    const unsubscribe = getApprovedUserWorkloads(
      user.uid,
      userData.campusId,
      setApprovedWorkloads
    );
  }, [userData, user]);

  if (loading || !userRole || !draftWorkloads || !userData) {
    return <LoadingScreen />;
  }

  switch (activeComponent) {
    case ActiveComponent.WorkloadIndex:
      return (
        <WorkloadIndex
          user={user}
          userData={userData}
          workloads={draftWorkloads}
          workloadsInProgress={workloadsInProgress}
          approvedWorkloads={approvedWorkloads}
        />
      );
    case ActiveComponent.WorkloadItem:
      return (
        <WorkloadItem
          campusId={userData.campusId}
          workload={selectedItem!}
          positionIndex={userData.positionIndex}
        />
      );
    case ActiveComponent.Profile:
      return <UserProfile userData={userData} />;
    case ActiveComponent.Loading:
      return <LoadingScreen />;
    default:
      return <LoadingScreen />;
  }
};

export default Faculty;
