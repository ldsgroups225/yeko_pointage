import { ISemester } from "./semester";

export interface IMetaDataDTO {
  schoolId: string | null;
  schoolYearId: number | null;
  semesterId: number | null;
  subjectId: string | null;
  teacherId: string | null;
  classId: string | null;
  semesters: ISemester[];
}
