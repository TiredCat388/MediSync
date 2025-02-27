import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import styles from "./loginstyles";

const { width } = Dimensions.get("window");

const LoginScreen = () => {
  const [role, setRole] = useState(null);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Add state for error message
  const router = useRouter();

  useEffect(() => {
    if (role === "nurse") {
      router.push("/logs");
    }
  }, [role]);

  const handleLogin = async () => {
    try {
      const response = await fetch("http://192.168.1.4:8000/api-token-auth/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: id,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setErrorMessage("Invalid ID or password. Please try again."); // Set error message
        } else {
          setErrorMessage("Invalid ID or password. Please try again.");
        }
        return;
      }

      console.log("Token:", data.token);
      Alert.alert("Login successful!");
      // Navigate to logs screen
      router.push("/logs");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred. Please try again later."); // Set error message
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.upperHalf}>
        <View style={styles.logoContainer}>
          <View style={styles.circleBackground}>
            <Image
              source={require("../assets/images/medisync-logo.png")}
              style={styles.logo}
            />
          </View>
        </View>
      </View>

      <View style={styles.lowerHalf}>
        {!role ? (
          <>
            <Text style={styles.title}>Medisync</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={styles.roleButton}
                onPress={() => setRole("nurse")}
                activeOpacity={0.6}
              >
                <FontAwesome5 name="user-nurse" size={28} color="white" />
                <Text style={styles.roleText}>Nurse Log-In</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.roleButton}
                onPress={() => setRole("physician")}
                activeOpacity={0.6}
              >
                <FontAwesome5 name="user-md" size={28} color="white" />
                <Text style={styles.roleText}>Physician Log-In</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : role === "physician" ? (
          <>
            <Text style={styles.title}>Physician Login</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter ID"
              placeholderTextColor="rgba(0, 0, 0, 0.4)"
              value={id}
              onChangeText={setId}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              placeholderTextColor="rgba(0, 0, 0, 0.4)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {errorMessage ? ( // Conditionally render error message
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setRole(null)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
              >
                <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
      </View>
    </View>
  );
};

export default LoginScreen;