import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import styles from "./stylesheets/loginstyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const BASE_API = Constants.expoConfig.extra.BASE_API;

const { width } = Dimensions.get("window");

const LoginScreen = () => {
  const [role, setRole] = useState(null);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const redirectIfNurse = async () => {
      if (role === "nurse") {
        await AsyncStorage.setItem("userRole", "nurse");
        router.push("/directory");
      }
    };

    redirectIfNurse();
  }, [role]);

  const handleLogin = async () => {
    try {
      if (!role) {
        setErrorMessage("Please select a role.");
        return;
      }

      if (role === "nurse") {
        return;
      }

      if (role === "physician") {
        if (!id || !password) {
          setErrorMessage("ID and Password are required.");
          return;
        }

        const response = await fetch(`${BASE_API}/api/token/`, {
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
            setErrorMessage("Invalid ID or password. Please try again.");
          } else {
            setErrorMessage("An error occurred. Please try again later.");
          }
          return;
        }

        const token = data.access;

        // Store all user data including physician ID
        await AsyncStorage.multiSet([
          ["userRole", "physician"],
          ["userId", id], // Using the login ID as physician ID
          ["authToken", token],
          ["username", id], // Also storing username for future use
        ]);

        // Verify storage
        const storedData = await AsyncStorage.multiGet([
          "userRole",
          "userId",
          "authToken",
        ]);
        console.log("Stored login data:", {
          role: storedData[0][1],
          id: storedData[1][1],
          token: storedData[2][1],
        });

        Alert.alert("Login successful!");
        router.push("/directory");
      } else {
        setErrorMessage("Invalid role selected.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.upperHalf}>
            <View style={styles.logoContainer}>
              <View style={styles.circleBackground}>
                <Image
                  resizeMode="contain"
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
                    <FontAwesome5 name="user-nurse" size={28} color="#F8F8F8" />
                    <Text style={styles.roleText}>Nurse Log-In</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.roleButton}
                    onPress={() => setRole("physician")}
                    activeOpacity={0.6}
                  >
                    <FontAwesome5 name="user-md" size={28} color="#F8F8F8" />
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
                />

                <TextInput
                  style={styles.input}
                  placeholder="Enter Password"
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />

                {errorMessage ? (
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
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
