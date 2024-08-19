import { useAtom } from "jotai";
import { syncStatusAtom } from "@/store/atoms";
import * as syncService from "@/services/sync";

export function useOfflineSync() {
  const [syncStatus, setSyncStatus] = useAtom(syncStatusAtom);

  const syncData = async () => {
    setSyncStatus("syncing");
    try {
      await syncService.syncData();
      setSyncStatus("idle");
      await syncService.setLastSyncTimestamp(Date.now());
    } catch (error) {
      console.error("Sync failed:", error);
      setSyncStatus("error");
      throw error;
    }
  };

  const getLastSyncTime = async () => {
    return await syncService.getLastSyncTimestamp();
  };

  return {
    syncStatus,
    syncData,
    getLastSyncTime,
  };
}
