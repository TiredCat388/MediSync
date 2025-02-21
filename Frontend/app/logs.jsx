import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styles from "./logstyles";

const { width, height } = Dimensions.get("window");
const isTablet = width > 900;

export default function LogsScreen() {
  const [logs, setLogs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
      fetchData()
  }, [])

  const fetchData = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/logs/")
    const logs = await response.json()
    setLogs(logs)
  }

  const handleViewPress = (log) => {
    setSelectedLog(log);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        <TouchableOpacity>
          <FontAwesome name="bars" size={24} color="gray" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome
            name="file-text-o"
            size={24}
            color="gray"
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome
            name="calendar"
            size={24}
            color="gray"
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome
            name="clock-o"
            size={24}
            color="gray"
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="cog" size={24} color="gray" style={styles.icon} />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image source={require("../assets/images/medisync-logo-bw.png")} style={styles.logo} />
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <Text style={styles.title}>Logs</Text>
        <ScrollView contentContainerStyle={styles.listContainer}>
          {logs.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardContent}>
                <View style={styles.row}>
                  <FontAwesome
                    name="clock-o"
                    size={24}
                    color="#666"
                    style={styles.iconClock}
                  />
                  <Text style={styles.date}>{item.log_date}</Text>
                  <Text style={styles.time}>{item.log_time}</Text>
                </View>
                <Text style={styles.changes}>{item.log_message}</Text>
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleViewPress(item)}
              >
                <Text style={styles.buttonText}>View</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.backButton}>
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
                <Text style={styles.modalDescription}>
                  Add Description of Changes Here
                </Text>
              </>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}