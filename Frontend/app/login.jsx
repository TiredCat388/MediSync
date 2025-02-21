import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Dimensions, Image 
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const LoginScreen = () => {
  const [role, setRole] = useState(null);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      {/* Logo Image (Centered Above All Elements) */}
      <Image source={require("../assets/images/medisync-logo.png")} style={styles.logo} />

      {!role ? (
        <>
          <Text style={styles.title}>Select Role:</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={styles.roleButton}
              onPress={() => setRole("nurse")}
              activeOpacity={0.6}
            >
              <FontAwesome5 name="user-nurse" size={28} color="white" />
              <Text style={styles.roleText}>Nurse</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.roleButton}
              onPress={() => setRole("physician")}
              activeOpacity={0.6}
            >
              <FontAwesome5 name="user-md" size={28} color="white" />
              <Text style={styles.roleText}>Physician</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.title}>
            {role === "nurse" ? "Nurse Login" : "Physician Login"}
          </Text>

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

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setRole(null)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={() => Alert.alert("Logging in...")}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  logo: {
    width: 150,  // Adjust size as needed
    height: 150,
    marginBottom: 30, // Space between logo and buttons
    resizeMode: "contain",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  roleContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 15,
  },
  roleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 10,
    width: width * 0.5,
    marginVertical: 10, // Space between buttons
  },
  roleText: {
    color: "white",
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    marginTop: 10,
    borderRadius: 10,
    width: width * 0.6,
    fontSize: 18,
    backgroundColor: "white",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.6,
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    paddingVertical: 15,
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
  },
  cancelText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
  },
  loginText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LoginScreen;
