import { getItem, setItem } from "@/store/mmkvStorage";
import { AttendanceSession, Homework, ParticipationSession } from "@/types";

export async function syncData(): Promise<void> {
  await syncAttendance();
  await syncParticipation();
  await syncHomework();
}

async function syncAttendance(): Promise<void> {
  const localAttendance: AttendanceSession[] =
    (await getItem("localAttendance")) || [];
  // const response = await api.post("/sync/attendance", localAttendance);
  setItem("localAttendance", []);
  // Update local state with synced data
  // You might want to use Jotai atoms here to update the UI
}

async function syncParticipation(): Promise<void> {
  const localParticipation: ParticipationSession[] =
    (await getItem("localParticipation")) || [];
  // const response = await api.post("/sync/participation", localParticipation);
  setItem("localParticipation", []);
  // Update local state with synced data
}

async function syncHomework(): Promise<void> {
  const localHomework: Homework[] = (await getItem("localHomework")) || [];
  // const response = await api.post("/sync/homework", localHomework);
  setItem("localHomework", []);
  // Update local state with synced data
}

export async function getLastSyncTimestamp(): Promise<number> {
  return (await getItem("lastSyncTimestamp")) || 0;
}

export async function setLastSyncTimestamp(timestamp: number): Promise<void> {
  setItem("lastSyncTimestamp", timestamp);
}
