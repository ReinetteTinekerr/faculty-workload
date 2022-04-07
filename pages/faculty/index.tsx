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
  getProgramChairmanMembers,
  getWorkloadsBySchoolYear,
} from "../../firebase/firestoreService";
import { getCurrentSchoolYear, openNotification } from "utils/utils";
import { kCollegeSecretaryRole } from "constants/constants";

const Faculty: NextPage = () => {
  const [user, loading, error, userRole, userData] = useAuthSession();
  const { activeComponent, selectedItem } = useContext(ActiveComponentContext)!;
  const [programChairMembers, setProgramChairMembers] = useState<any[]>();
  const [facultyMembers, setFacultyMembers] = useState<
    UserProfileProps[] | null
  >(null);

  const [workloads, setWorkloads] = useState<any>(null);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<string>("");

  useEffect(() => {
    const storedSchoolYear = localStorage.getItem("schoolYear");
    setSelectedSchoolYear(
      !storedSchoolYear ? getCurrentSchoolYear() : storedSchoolYear
    );
  }, []);

  useEffect(() => {
    if (!userData) return;
    getProgramChairmanMembers(userData.campusId).then((data) => {
      console.log("data: ", data);
      setProgramChairMembers(data);
    });
  }, [userData]);

  useEffect(() => {
    if (!userData || userData.role !== kCollegeSecretaryRole) return;
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

  if (!userData.signature) {
    openNotification(
      "No Signature",
      "Please provide a signature on your profile"
    );
  }

  // update to browser router
  switch (activeComponent) {
    case ActiveComponent.WorkloadIndex:
      return (
        <WorkloadIndex
          user={user}
          userData={userData}
          facultyMembers={facultyMembers}
          programChairMembers={programChairMembers}
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
