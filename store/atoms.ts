/**
 * @file This file defines Jotai atoms for managing global application state.
 *
 * Atoms are the fundamental building blocks of Jotai, representing a single,
 * immutable piece of state. They can be read and updated from anywhere in the
 * application, providing a centralized and reactive way to manage data.
 *
 * This file organizes atoms into logical groups based on their functionality,
 * making it easier to understand and maintain the application's state management.
 */

import { ColorSchemeName } from "react-native";
import { atom } from "jotai";
import { atomWithMMKV } from "./mmkvStorage";
import {
  AuthState,
  User,
  School,
  Class,
  Student,
  Teacher,
  AttendanceSession,
  ParticipationSession,
  Homework,
  Incident,
  ClassSchedule,
} from "@/types";

// Theme Atoms
/**
 * Atom representing the user's preferred color scheme.
 *
 * @default "light"
 */
export const userColorSchemeAtom = atomWithMMKV<ColorSchemeName>(
  "userColorScheme",
  "light",
);

// Expo Token
/**
 * Atom storing the user's Expo push token.
 *
 * Used for sending push notifications.
 */
export const expoTokenAtom = atomWithMMKV<string | undefined>(
  "expoToken",
  undefined,
);

// Auth Atoms
/**
 * Atom representing the user's authentication state.
 *
 * Contains information about the currently logged-in user, authentication status,
 * and authentication token.
 */
export const authStateAtom = atomWithMMKV<AuthState>("authState", {
  user: null,
  isAuthenticated: false,
  authToken: null,
});

/**
 * Atom derived from `authStateAtom`, providing direct access to the current user.
 */
export const currentUserAtom = atom(
  (get) => get(authStateAtom).user,
  (get, set, newUser: User | null) =>
    set(authStateAtom, { ...get(authStateAtom), user: newUser }),
);

// School Atoms
/**
 * Atom storing information about the currently selected school.
 */
export const currentSchoolAtom = atomWithMMKV<School | null>(
  "currentSchool",
  null,
);

/**
 * Atom storing a list of classes associated with the current school.
 */
export const schoolClassesAtom = atomWithMMKV<Class[]>("schoolClasses", []);

/**
 * Atom representing the currently selected class.
 */
export const currentClassAtom = atomWithMMKV<Class | null>(
  "currentClass",
  null,
);

/**
 * Atom representing the current teacher.
 */
export const currentTeacherAtom = atomWithMMKV<Teacher | null>(
  "currentTeacher",
  null,
);

/**
 * Atom storing a list of students belonging to the current class.
 */
export const studentsListAtom = atomWithMMKV<Student[]>("studentsList", []);

/**
 * Atom storing the class schedule for the current class.
 */
export const currentScheduleAtom = atomWithMMKV<ClassSchedule | null>(
  "currentSchedule",
  null,
);

/**
 * Atom storing the class schedule for the current class.
 */
export const classScheduleAtom = atomWithMMKV<ClassSchedule[]>(
  "classSchedule",
  [],
);

/**
 * Atom storing a list of teachers associated with the current class.
 */
export const teachersListAtom = atomWithMMKV<Teacher[]>("teachersList", []);

// Attendance Atoms
/**
 * Atom representing the currently active attendance session.
 */
export const currentAttendanceSessionAtom =
  atomWithMMKV<AttendanceSession | null>("currentAttendanceSession", null);

/**
 * Atom storing a history of past attendance sessions.
 */
export const attendanceHistoryAtom = atomWithMMKV<AttendanceSession[]>(
  "attendanceHistory",
  [],
);

// Participation Atoms
/**
 * Atom representing the currently active participation session.
 */
export const currentParticipationSessionAtom =
  atomWithMMKV<ParticipationSession | null>(
    "currentParticipationSession",
    null,
  );

/**
 * Atom storing a history of past participation sessions.
 */
export const participationHistoryAtom = atomWithMMKV<ParticipationSession[]>(
  "participationHistory",
  [],
);

// Homework Atoms
/**
 * Atom storing a list of homework assignments.
 */
export const homeworkListAtom = atomWithMMKV<Homework[]>("homeworkList", []);

// Incident Atoms
/**
 * Atom storing a list of incidents.
 */
export const incidentListAtom = atomWithMMKV<Incident[]>("incidentList", []);

// UI State Atoms
/**
 * Atom indicating whether the application is currently in offline mode.
 */
export const isOfflineModeAtom = atom(false);

/**
 * Atom representing the current synchronization status.
 */
export const syncStatusAtom = atom<"idle" | "syncing" | "error">("idle");

// Derived Atoms
/**
 * Atom derived from `studentsListAtom`, providing the total number of students.
 */
export const studentCountAtom = atom((get) => get(studentsListAtom).length);

/**
 * Atom derived from `homeworkListAtom`, providing the number of active homework assignments.
 */
export const activeHomeworkCountAtom = atom((get) => {
  const now = new Date();
  return get(homeworkListAtom).filter((hw) => new Date(hw.dueDate) > now)
    .length;
});
