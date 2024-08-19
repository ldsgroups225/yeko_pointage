import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/configure-tablet");
      } else {
        router.replace("/(auth)/qr-scan");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return null;
}
