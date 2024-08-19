import React, { useState } from "react";
import { Text, View } from "react-native";
import { CsTextField, CsButton } from "@/components/commons";
import { LoginCredentials } from "@/types";
import { isValidEmail, isValidPassword } from "@/utils/validators";

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!isValidPassword(password)) {
      setError(
        "Password must be at least 8 characters long and contain uppercase, lowercase letters, and numbers.",
      );
      return;
    }

    try {
      const credentials: LoginCredentials = { email, password };
      await onSubmit(credentials);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("Network Error")) {
          setError("Network error. Please check your connection.");
        } else if (err.message.includes("401")) {
          setError("Invalid credentials. Please try again.");
        } else {
          setError("An unexpected error occurred. Please try again later.");
        }
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <CsTextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        error={
          error && !isValidEmail(email)
            ? "Please enter a valid email address."
            : ""
        }
        autoCapitalize="none"
        returnKeyType="next"
      />
      <CsTextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
        error={
          error && !isValidPassword(password)
            ? "Password must be at least 8 characters long and contain uppercase, lowercase letters, and numbers."
            : ""
        }
        returnKeyType="done"
      />
      <CsButton
        onPress={handleLogin}
        title="Login"
        disabled={false}
        loading={false}
        variant="primary"
        size="medium"
        style={{ marginTop: 10 }}
      />
      {error && <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>}
    </View>
  );
}
