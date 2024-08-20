import { AttendanceStatus } from "@/types/attendance";

export interface School {
  id: string;
  cycleId: string;
  name: string;
  code: string;
}

export interface Class {
  id: string;
  name: string;
  grade: string;
  schoolId: string;
}

export interface Student {
  id: string; // UUID
  parentId: string; // UUID
  idNumber: string;
  fullName: string;
  firstName: string;
  lastName: string;
  status?: AttendanceStatus;
}

export interface Teacher {
  id: string; // UUID
  fullName: string;
  phone: string;
}

export interface Schedule {
  // TODO: implement
}
