import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const LogsScreen = () => {
  const [logs, setLogs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/logs/");
    const logs = await response.json();
    setLogs(logs);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logs</Text>
      <ScrollView contentContainerStyle={styles.listContainer}>
        {logs.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.date}>{item.log_date}</Text>
            <Text style={styles.time}>{item.log_time}</Text>
            <Text style={styles.changes}>{item.log_message}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/login")}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "red",
    alignItems: "center",
    borderRadius: 5,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default LogsScreen;
