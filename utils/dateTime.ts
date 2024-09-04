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
import { fr } from "date-fns/locale";

/**
 * Formats a Date object or a date string to a localized date string.
 *
 * @param {Date | string} date - The Date object or date string to format.
 * @returns {string} The formatted date string.
 */
export function formatDate(date: Date | string): string {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return format(parsedDate, DATE_FORMAT, { locale: fr });
}

/**
 * Formats a Date object or a date string to a time string.
 *
 * @param {Date | string} date - The Date object or date string to format.
 * @returns {string} The formatted time string.
 */
export function formatTime(date: Date | string): string {
  if (typeof date === "string" && date.length === 5) return date;

  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return format(parsedDate, TIME_FORMAT);
}

/**
 * Parses a date string to a Date object.
 *
 * @param {string} dateString - The date string to parse.
 * @returns {Date | null} The parsed Date object, or null if the parsing fails.
 */
export function parseDate(dateString: string): Date | null {
  const parsedDate = parse(dateString, DATE_FORMAT, new Date());
  return isValid(parsedDate) ? parsedDate : null;
}

/**
 * Parses a time string to a Date object.
 *
 * @param {string} timeString - The time string to parse.
 * @returns {Date | null} The parsed Date object, or null if the parsing fails.
 */
export function parseTime(timeString: string): Date | null {
  const parsedTime = parse(timeString, TIME_FORMAT, new Date());
  return isValid(parsedTime) ? parsedTime : null;
}

/**
 * Calculates the duration in minutes between a start time and an arrival time.
 *
 * @param {Date} startTime - The start time.
 * @param {Date} arrivalTime - The arrival time.
 * @returns {number} The duration in minutes, or 0 if the arrival time is before the start time.
 */
export function calculateLateDuration(
  startTime: Date,
  arrivalTime: Date,
): number {
  return Math.max(0, differenceInMinutes(arrivalTime, startTime));
}

/**
 * Gets the current day of the week as a number (0-6, where 0 is Sunday).
 *
 * @returns {number} The current day of the week.
 */
export function getCurrentDayOfWeek(): number {
  return new Date().getDay();
}

/**
 * Gets the current time as a string in HH:mm format.
 *
 * @returns {string} The current time in HH:mm format.
 */
export function getCurrentTimeString(): string {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
}

/**
 * Formats a Date object to a time string in HH:mm format.
 *
 * @param {Date} date - The Date object to format.
 * @returns {string} The formatted time string in HH:mm format.
 */
export function formatTimeString(date: Date): string {
  return date.toTimeString().slice(0, 5);
}

/**
 * Parses a time string in HH:mm format to a Date object.
 *
 * @param {string} timeString - The time string in HH:mm format.
 * @returns {Date} The parsed Date object.
 */
export function parseTimeString(timeString: string): Date {
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

/**
 * Compares two time strings in HH:mm format.
 *
 * @param {string} time1 - The first time string.
 * @param {string} time2 - The second time string.
 * @returns {number} A negative number if time1 is before time2, 0 if they are equal, and a positive number if time1 is after time2.
 */
export function compareTimeStrings(time1: string, time2: string): number {
  const date1 = parseTimeString(time1);
  const date2 = parseTimeString(time2);
  return date1.getTime() - date2.getTime();
}

/**
 * Extracts the hour and minute (HH:mm) from an ISO 8601 date string.
 *
 * @param {string} dateString - The ISO 8601 date string to extract the time from.
 * @returns {string} The extracted hour and minute in the format "HH:mm".
 */
export function extractHourAndMinute(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, "HH:mm");
}

/**
 * Checks if the current time falls within a teacher's scheduled class.
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

/**
 * Converts a time string in the format "HH:MM" to an ISO 8601 timestamp.
 *
 * The date portion of the timestamp will be the current date.
 *
 * @param {string} timeString - The time string to convert, in the format "HH:MM".
 * @returns {string} The ISO 8601 timestamp representing the current date and the given time.
 */
export function convertToIsoTime(timeString: string): string {
  const [hours, minutes] = timeString.split(":").map(Number);

  const now = new Date();
  now.setHours(hours);
  now.setMinutes(minutes);
  now.setSeconds(0);
  now.setMilliseconds(0);

  return now.toISOString();
}
