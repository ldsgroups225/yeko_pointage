import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { CsTextField, CsButton, CsText } from "@/components/commons";
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
      setError("Entrer un email valide.");
      return;
    }

    if (!isValidPassword(password)) {
      setError(
        "Le mot de passe doit contenir au moins 8 caractères, dont des majuscules, des minuscules et des chiffres.",
      );
      return;
    }

    try {
      const credentials: LoginCredentials = { email, password };
      await onSubmit(credentials);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("Network Error")) {
          setError("Erreur réseau. Veuillez vérifier votre connexion.");
        } else if (err.message.includes("401")) {
          setError("Identifiants invalides. Veuillez réessayer.");
        } else {
          setError(
            "Une erreur inattendue s'est produite. Veuillez réessayer plus tard.",
          );
        }
      } else {
        setError(
          "Une erreur inattendue s'est produite. Veuillez réessayer plus tard.",
        );
      }
    }
  };

  return (
    <View style={styles.formContainer}>
      <CsTextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Entrer votre email"
        error={
          error && !isValidEmail(email)
            ? "Entrer un email vailde s'il vous plaît."
            : ""
        }
        autoCapitalize="none"
        returnKeyType="next"
      />
      <CsTextField
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        placeholder="Entrer votre mot de passe"
        secureTextEntry
        error={
          error && !isValidPassword(password)
            ? "8 caractères minimum (majuscules, minuscules, chiffres)."
            : ""
        }
        returnKeyType="done"
      />
      <CsButton
        onPress={handleLogin}
        title="Se connecter"
        disabled={false}
        loading={false}
        variant="primary"
        size="medium"
        style={{ marginTop: 10 }}
      />
      {error && <CsText style={styles.error}>{error}</CsText>}
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    gap: 20,
  },
  forgotPassword: {
    textAlign: "right",
    marginTop: 10,
    color: "#007bff",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});
