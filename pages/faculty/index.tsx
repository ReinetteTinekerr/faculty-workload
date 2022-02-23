import { NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import LoadingScreen from "components/layout/loadingScreen";
import { ActiveComponent } from "constants/enums/activeComponent";
import WorkloadIndex from "components/routes/faculty/WorkloadIndex";
import { ActiveComponentContext } from "context/activeComponentContext";
import WorkloadItem from "components/routes/faculty/WorkloadItem";
import UserProfile from "components/routes/faculty/UserProfile";
import { useAuthSession } from "utils/hooks";
import { UserProfileProps } from "constants/interface/formProps";
import {
  getCollegeFacultyMembers,
  getWorkloadsBySchoolYear,
} from "../../firebase/firestoreQueries";
import { getCurrentSchoolYear } from "utils/utils";
// import {
//   getApprovedUserWorkloads,
//   getDraftsUserWorkloads,
//   getUserWorkloadsInProgress,
// } from "../../firebase/firestoreQueries";

const Faculty: NextPage = () => {
  const [user, loading, error, userRole, userData] = useAuthSession();
  const { activeComponent, selectedItem } = useContext(ActiveComponentContext)!;
  const [facultyMembers, setFacultyMembers] = useState<
    UserProfileProps[] | null
  >(null);

  const [workloads, setWorkloads] = useState<any>(null);
  const storedSchoolYear = localStorage.getItem("schoolYear");
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<string>(
    !storedSchoolYear ? getCurrentSchoolYear() : storedSchoolYear
  );

  useEffect(() => {
    if (!userData || userData.role !== "COLLEGE_SECRETARY") return;
    const unsubscribe = getCollegeFacultyMembers(
      userData.campusId,
      userData.college,
      setFacultyMembers
    );

    return () => {
      unsubscribe();
    };
  }, [userData]);

  useEffect(() => {
    if (!userData || !user) return;
    const unsubscribe = getWorkloadsBySchoolYear(
      user.uid,
      userData.campus,
      setWorkloads,
      userData.role,
      userData.college,
      selectedSchoolYear
    );
    console.log("workloads");

    return () => {
      console.log("done");
      unsubscribe();
    };
  }, [userData, user, selectedSchoolYear]);

  if (loading || !userRole || !userData || !user) {
    return <LoadingScreen />;
  }

  // update to browser router
  switch (activeComponent) {
    case ActiveComponent.WorkloadIndex:
      return (
        <WorkloadIndex
          user={user}
          userData={userData}
          facultyMembers={facultyMembers}
          workloads={workloads}
          selectedSchoolYear={selectedSchoolYear}
          setSelectedSchoolYear={setSelectedSchoolYear}
        />
      );
    case ActiveComponent.WorkloadItem:
      return (
        <WorkloadItem
          campusId={userData.campusId}
          workload={selectedItem!}
          positionIndex={userData.positionIndex}
          role={userRole}
        />
      );
    case ActiveComponent.Profile:
      return <UserProfile userData={userData} />;

    default:
      return <LoadingScreen />;
  }
};

export default Faculty;
