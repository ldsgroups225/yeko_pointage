import { DATE_FORMAT, TIME_FORMAT } from "@/config/constants";
import {
  format,
  parse,
  isValid,
  differenceInMinutes,
  parseISO,
  isAfter,
  isBefore,
  isEqual,
} from "date-fns";

export function formatDate(date: Date | string): string {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return format(parsedDate, DATE_FORMAT);
}

export function formatTime(date: Date | string): string {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return format(parsedDate, TIME_FORMAT);
}

export function parseDate(dateString: string): Date | null {
  const parsedDate = parse(dateString, DATE_FORMAT, new Date());
  return isValid(parsedDate) ? parsedDate : null;
}

export function parseTime(timeString: string): Date | null {
  const parsedTime = parse(timeString, TIME_FORMAT, new Date());
  return isValid(parsedTime) ? parsedTime : null;
}

export function calculateLateDuration(
  startTime: Date,
  arrivalTime: Date,
): number {
  return Math.max(0, differenceInMinutes(arrivalTime, startTime));
}

/**
 * Get the current day of the week as a number (0-6, where 0 is Sunday)
 */
export function getCurrentDayOfWeek(): number {
  return new Date().getDay();
}

/**
 * Get the current time as a string in HH:mm format
 */
export function getCurrentTimeString(): string {
  const now = new Date();
  return now.toTimeString().slice(0, 5); // Returns time in HH:mm format
}

/**
 * Format a Date object to a time string in HH:mm format
 */
export function formatTimeString(date: Date): string {
  return date.toTimeString().slice(0, 5);
}

/**
 * Parse a time string in HH:mm format to a Date object
 */
export function parseTimeString(timeString: string): Date {
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

/**
 * Compare two time strings in HH:mm format
 * @returns negative if time1 < time2, 0 if equal, positive if time1 > time2
 */
export function compareTimeStrings(time1: string, time2: string): number {
  const date1 = parseTimeString(time1);
  const date2 = parseTimeString(time2);
  return date1.getTime() - date2.getTime();
}

/**
 * Extracts the hour and minute (HH:mm) from an ISO 8601 date string.
 *
 * @param {string} dateString - The ISO 8601 date string to extract the time from. Example: "2024-08-19T07:00:00.000+00:00".
 * @returns {string} The extracted hour and minute in the format "HH:mm". Example: "07:00".
 */
export function extractHourAndMinute(dateString: string) {
  // Parse the ISO date string
  const date = parseISO(dateString);

  // Format the date to extract only the hour and minute
  return format(date, "HH:mm");
}

/**
 * Checks if the current time falls within a teacher's scheduled class and returns a customizable message.
 *
 * @template T - The type of the schedule object.
 * @param {string} userId - The ID of the teacher.
 * @param {Array<T>} schedules - The list of schedules to check against.
 * @param {string} [customMessage] - An optional custom message to display if no class is scheduled at the current time.
 * @returns {T|null} The schedule object if a class is scheduled at the current time, or null if no schedule is found, with a message if provided.
 */
export function checkScheduledClass<
  T extends {
    teacherId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  },
>(userId: string, schedules: T[], customMessage?: string): T | null {
  const schedule = schedules.find((s) => {
    const startTime = parse(
      extractHourAndMinute(s.startTime),
      "HH:mm",
      new Date(),
    );
    const currentDayOfWeek = getCurrentDayOfWeek();
    const currentTime = getCurrentTimeString();
    const endTime = parse(extractHourAndMinute(s.endTime), "HH:mm", new Date());
    const currentTimeParsed = parse(currentTime, "HH:mm", new Date());

    // Debug information
    console.info("==> [IS SAME TEACHER]:", s.teacherId === userId);
    console.info("==> [DAY OF WEEK]:", s.dayOfWeek);
    console.info("==> [CURRENT DAY OF WEEK]:", currentDayOfWeek);
    console.info("==> [CURRENT TIME]:", currentTime);
    console.info("==> [CURRENT TIME PARSED]:", currentTimeParsed);
    console.info("==> [START TIME]:", extractHourAndMinute(s.startTime));
    console.info("==> [END TIME]:", extractHourAndMinute(s.endTime));

    return (
      s.teacherId === userId &&
      s.dayOfWeek === currentDayOfWeek &&
      (isEqual(currentTimeParsed, startTime) ||
        isAfter(currentTimeParsed, startTime)) &&
      (isEqual(currentTimeParsed, endTime) ||
        isBefore(currentTimeParsed, endTime))
    );
  });

  if (!schedule) {
    const message =
      customMessage ||
      "No scheduled class for this teacher at the current time";
    console.error(message);
    return null;
  }

  return schedule;
}
