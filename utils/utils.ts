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

export function getDecrementedSchoolYear(schoolYear: string, i: number) {
  const schoolYearArr = schoolYear.split(" - ");
  return (
    (Number(schoolYearArr[0]) - i).toString() +
    " - " +
    (Number(schoolYearArr[1]) - i).toString()
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

export function getValidators(validatorsData: any, college: string) {
  const validatorsWithoutDean = validatorsData.filter((member: any) => {
    return member.position !== "Dean";
  });

  const dean = validatorsData.filter((member: any) => {
    return (
      member.position === "Dean" &&
      member.college.toUpperCase() === college.toUpperCase()
    );
  });
  const objValidators = validatorsWithoutDean.reduce(
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

  // const validators = {
  //   part1: [...dean, ...validatorsWithoutDean].sort(
  //     (a, b) => a.positionIndex - b.positionIndex
  //   ),
  //   part2: isuCommittee,
  // };
  const validators = { ...objValidators, ...objValidatorsDean };

  return JSON.parse(JSON.stringify(validators));
}
