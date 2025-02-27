import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, ScrollView, Modal } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import styles from "./logstyles";
import Sidebar from './components/sidebar';

const { width } = Dimensions.get("window");
const isTablet = width > 900;

export default function LogsScreen() {
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(70); // Default sidebar width when collapsed

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/logs/");
      const logs = await response.json();
      setLogs(logs);
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

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <Sidebar setSidebarWidth={setSidebarWidth} />

      {/* Main Content */}
      <View style={[styles.mainContent, { marginLeft: sidebarWidth }]}>
        <Text style={styles.title}>Logs</Text>
        <ScrollView contentContainerStyle={styles.listContainer}>
          {logs.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardContent}>
                <View style={styles.row}>
                  <FontAwesome name="clock-o" size={24} color="#666" style={styles.iconClock} />
                  <Text style={styles.date}>{item.log_date}</Text>
                  <Text style={styles.time}>{item.log_time}</Text>
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
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/")}>
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
                <Text style={styles.modalDate}>{selectedLog.date}</Text>
                <Text style={styles.modalText}>Patient ID - 0012345AB</Text>
                <Text style={styles.modalDescription}>Add Description of Changes Here</Text>
              </>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal visible={logoutModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalText}>Are you sure you want to log out?</Text>
            <View style={styles.modalButtonContainer}>
              {/* Cancel Button */}
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              {/* Log Out Button */}
              <TouchableOpacity 
                style={[styles.modalButton, styles.logoutButton]} 
                onPress={handleLogout}
              >
                <Text style={styles.modalButtonText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}