import api from "./api";
import { AttendanceRecord, AttendanceSession } from "@/types";
import { formatDate } from "@/utils/dateTime";

export async function startAttendanceSession(
  classId: string,
  date: Date,
): Promise<AttendanceSession> {
  const response = await api.post("/attendance/start", {
    classId,
    date: formatDate(date),
  });
  return response.data;
}

export async function endAttendanceSession(
  sessionId: string,
): Promise<AttendanceSession> {
  const response = await api.post(`/attendance/${sessionId}/end`);
  return response.data;
}

export async function recordAttendance(
  sessionId: string,
  record: AttendanceRecord,
): Promise<AttendanceRecord> {
  const response = await api.post(`/attendance/${sessionId}/record`, record);
  return response.data;
}

export async function getAttendanceHistory(
  classId: string,
  startDate: Date,
  endDate: Date,
): Promise<AttendanceSession[]> {
  const response = await api.get("/attendance/history", {
    params: {
      classId,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    },
  });
  return response.data;
}
