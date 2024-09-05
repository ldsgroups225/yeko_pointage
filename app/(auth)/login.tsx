import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import LoginForm from "@/components/LoginForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { LoginCredentials, UserRole } from "@/types";
import { useSchool } from "@/hooks";

export default function LoginScreen() {
  const { login, logout, user } = useAuth();
  const { verifyDirectorAccess } = useSchool();

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { schoolId } = useLocalSearchParams<{
    role: UserRole;
    schoolId: string;
  }>();

  const handleLogin = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      await login(credentials.email, credentials.password);

      if (!user || !user.id.length) return await logout();
      const isDirector = await verifyDirectorAccess(user.id, schoolId);

      if (isDirector) {
        return router.replace("/(director)/configure-tablet");
      } else {
        await logout();
      }

      // If login is successful, the root layout will handle the redirect
    } catch (err) {
      await logout();
      console.error("[E_LOGIN]:", err);
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to Yeko Pointage</Text>
      <LoginForm onSubmit={handleLogin} />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  qrButton: {
    backgroundColor: "#34C759",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  qrButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
