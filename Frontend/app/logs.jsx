import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Modal
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import styles from "./stylesheets/logstyles";
import Sidebar from './components/sidebar';
import Constants from 'expo-constants';
import { SafeAreaView } from "react-native-safe-area-context";
import AppText from './components/AppText';

const BASE_API = Constants.expoConfig.extra.BASE_API;

const { width } = Dimensions.get("window");
const isTablet = width > 900;

const formatTime = (timeString) => {
  return timeString.split(".")[0];
};

const mockLogs = [
  {
    id: 1,
    log_id: 101,
    log_date: "2025-05-27",
    log_time: "08:30:00.000",
    log_message: "Administered medication for Patient RES-002",
  },
  {
    id: 2,
    log_id: 102,
    log_date: "2025-05-26",
    log_time: "14:45:00.000",
    log_message: "Updated contact information for Patient XYZ-765",
  },
  {
    id: 3,
    log_id: 103,
    log_date: "2025-05-25",
    log_time: "09:15:00.000",
    log_message: "Added medication schedule for Patient ABC-123",
  },
];

export default function LogsScreen() {
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [patients, setPatients] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(70);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_API}/api/logs/`);
      let logs = await response.json();

      const patientResponse = await fetch(`${BASE_API}/api/patients/`);
      let patients = await patientResponse.json();

      logs = logs.sort((a, b) => a.log_id - b.log_id);
      setLogs(logs);
      setPatients(patients);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLogs(mockLogs);
    }
  };

  const handleViewPress = (log) => {
    setSelectedLog(log);
    setModalVisible(true);
  };

  const handleLogout = () => {
    setLogoutModalVisible(false);
    router.replace("/");
  };

  const getPatientLastName = (patientId) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient?.last_name || "Unknown";
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>
      <Sidebar />

      {/* Main Content */}
      <View style={[styles.mainContent, { marginLeft: sidebarWidth }]}>
        <View style={styles.header}>
          <AppText style={styles.headerText}>Logs</AppText>
        </View>
        <ScrollView contentContainerStyle={styles.listContainer}>
          {logs.length === 0 ? (
            <View style={styles.card}>
              <AppText style={styles.noLogsText}>No logs available.</AppText>
            </View>
          ) : (
            logs.map((item, index) => (
              <View key={item.id || index} style={styles.card}>
                <View style={styles.cardContent}>
                  <View style={styles.dateTimeContainer}>
                    <FontAwesome name="clock-o" size={24} color="#666" style={styles.iconClock} />
                    <AppText style={styles.date}>{item.log_date}</AppText>
                    <AppText style={styles.time}> - {formatTime(item.log_time)}</AppText>
                  </View>
                  <AppText style={styles.changes}>{item.log_message}</AppText>
                </View>
                <TouchableOpacity style={styles.button} onPress={() => handleViewPress(item)}>
                  <AppText style={styles.buttonText}>View</AppText>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>


        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/directory")}>
          <AppText style={styles.backButtonText}>Back</AppText>
        </TouchableOpacity>
      </View>

      {/* Modal for Viewing Log Details */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <AppText style={styles.modalTitle}>View</AppText>
            {selectedLog && (
              <>
                <AppText style={styles.modalDate}>{selectedLog.date}</AppText>
                <AppText style={styles.modalText}>Patient ID - 0012345AB</AppText>
                <AppText style={styles.modalDescription}>Add Description of Changes Here</AppText>
              </>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <AppText style={styles.closeButtonText}>Cancel</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    </SafeAreaView>
  );
}
