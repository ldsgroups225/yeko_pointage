import { DATE_FORMAT, TIME_FORMAT } from "../config/constants";
import { format, parse, isValid, differenceInMinutes } from "date-fns";

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
