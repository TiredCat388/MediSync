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

const BASE_API = Constants.expoConfig.extra.BASE_API;

const { width } = Dimensions.get("window");
const isTablet = width > 900;

const formatTime = (timeString) => {
  return timeString.split(".")[0];
};

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
    <View style={styles.container}>
      <Sidebar />

      {/* Main Content */}
      <View style={[styles.mainContent, { marginLeft: sidebarWidth }]}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Logs</Text>
        </View>
        <ScrollView contentContainerStyle={styles.listContainer}>
          {logs.map((item, index) => (
            <View key={item.id || index} style={styles.card}>
              <View style={styles.cardContent}>
                <View style={styles.dateTimeContainer}>
                  <FontAwesome name="clock-o" size={24} color="#666" style={styles.iconClock} />
                  <Text style={styles.date}>{item.log_date}</Text>
                  <Text style={styles.time}> - {formatTime(item.log_time)}</Text>
                </View>
                <Text style={styles.changes}>{item.log_message}</Text>
              </View>
              <TouchableOpacity style={styles.button} onPress={() => handleViewPress(item)}>
                <Text style={styles.buttonText}>View</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/directory")}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Viewing Log Details */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>View</Text>
            {selectedLog && (
              <>
                <Text style={styles.modalDate}>{selectedLog.log_date}</Text>
                <Text style={styles.modalText}>
                  Patient: {getPatientLastName(selectedLog.patient_id)}
                </Text>
                <Text style={styles.modalDescription}>
                  {selectedLog.extended_log || "No additional description."}
                </Text>
              </>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
