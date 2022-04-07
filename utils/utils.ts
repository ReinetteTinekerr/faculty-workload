import { notification } from "antd";
import moment from "moment";

export function getSchoolYear(schoolYear: any) {
  if (schoolYear === undefined) return "";
  return (
    new Date(schoolYear[0]).getFullYear().toString() +
    " - " +
    new Date(schoolYear[1]).getFullYear().toString()
  );
}

export function getCurrentSchoolYear() {
  const date = new Date();
  const lowerYear =
    date < new Date(date.getFullYear(), 7, 1)
      ? date.getFullYear() - 1
      : date.getFullYear();
  const upperYear = lowerYear + 1;
  return lowerYear.toString() + " - " + upperYear.toString();
}

export function getCurrentSemester() {
  const currentSchoolYear = getCurrentSchoolYear();
  const currentYear = new Date().getFullYear().toString();
  const schoolYearArr = currentSchoolYear.split(" - ");
  if (schoolYearArr[0] === currentYear) {
    return "First Semester";
  } else {
    return "Second Semester";
  }
}

export function getDecrementedSchoolYear(schoolYear: string, i: number) {
  const schoolYearArr = schoolYear.split(" - ");
  return (
    (Number(schoolYearArr[0]) - i).toString() +
    " - " +
    (Number(schoolYearArr[1]) - i).toString()
  );
}
export function getIncrementedSchoolYear(schoolYear: string, i: number) {
  const schoolYearArr = schoolYear.split(" - ");
  return (
    (Number(schoolYearArr[0]) + i).toString() +
    " - " +
    (Number(schoolYearArr[1]) + i).toString()
  );
}

export function toTitleCase(str: string | undefined) {
  if (str === undefined) return "";
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
}

export function getDate(timestamp: number) {
  // return moment(new Date(timestamp.seconds * 1000)).format(
  //   "MMMM Do YYYY, h:mm a"
  // );
  return moment(new Date(timestamp)).format("LLL");
}

// export function getValidators(validatorsData: any, college: string) {
//   const validatorsWithoutDean = validatorsData.filter((member: any) => {
//     return member.position !== "Dean";
//   });

//   const dean = validatorsData.filter((member: any) => {
//     return (
//       member.position === "Dean" &&
//       member.college.toUpperCase() === college.toUpperCase()
//     );
//   });

//   const isuCommittee = validatorsData.filter((member: any) => {
//     return member.position === "University Workload Committee";
//   });

//   const validators = {
//     part1: [...dean, ...validatorsWithoutDean].sort(
//       (a, b) => a.positionIndex - b.positionIndex
//     ),
//     part2: isuCommittee,
//   };
//

//   return JSON.parse(JSON.stringify(validators));
// }

export function getValidators(
  validatorsData: any,
  college: string,
  selectedProgramChair: any
) {
  const validatorsWithoutDeanAndProgramChair = validatorsData.filter(
    (member: any) => {
      return (
        member.position !== "Dean" &&
        !member.position.includes("Program Chairman")
      );
    }
  );

  const dean = validatorsData.filter((member: any) => {
    return (
      member.position === "Dean" &&
      member.college.toUpperCase() === college.toUpperCase()
    );
  });
  console.log(dean, "dean");

  const objValidators = validatorsWithoutDeanAndProgramChair.reduce(
    (obj: any, item: any) => (
      (obj[item.uid] = { validated: false, ...item }), obj
    ),
    {}
  );

  const objValidatorsDean = dean.reduce(
    (obj: any, item: any) => (
      (obj[item.uid] = { validated: false, ...item }), obj
    ),
    {}
  );

  const programChair: any = {};
  programChair[selectedProgramChair.uid] = {
    validated: false,
    ...selectedProgramChair,
  };

  const validators = {
    ...objValidators,
    ...objValidatorsDean,
    ...programChair,
  };

  return JSON.parse(JSON.stringify(validators));
}

export function sumValidatorsValidation(validators: object) {
  const totalValidation = Object.values(validators).reduce(
    (accum: number, validator: any) => {
      return accum + validator.validated;
    },
    0
  );
  return totalValidation;
}

export function groupByKey(array: [any]): { string: [any] } {
  return array.reduce((obj, item) => {
    obj[item.workload.college] = obj[item.workload.college] || [];
    obj[item.workload.college].push(item);
    return obj;
    //   if(obj[key] === undefined) return hash;
    //   return Object.assign(hash, { [obj[key]]:( hash[obj[key]] || [] ).concat(obj)})
  }, {});
}

export function toSummaryObject(array: [any]) {
  return array
    .map((workload) => {
      const { college, name, totalFacultyWorkload, excessFacultyWorkload } =
        workload.workload;
      return { college, name, totalFacultyWorkload, excessFacultyWorkload };
    })
    .sort((a: any, b: any) => a.college - b.college);
}

export const openNotification = (title: string, description: string) => {
  notification.warning({
    key: "signature",
    message: title,
    description: description,
    // onClick: () => {
    //   console.log("Notification Clicked!");
    // },
  });
};

export const convertFileObjToDataUrl = (fileObj: any, imageUrl: any) => {
  let imageDataUrl: null | ArrayBuffer | string = null;
  let reader = new FileReader();
  reader.readAsDataURL(fileObj);
  reader.onload = (e) => {
    imageUrl = reader.result;
  };
};
