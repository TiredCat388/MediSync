import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, ScrollView, Modal } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import styles from "./archivestyle";
import Sidebar from './components/sidebar';

const { width } = Dimensions.get("window");
const isTablet = width > 900;

export default function ArchiveScreen() {
  const router = useRouter();
  const [archive, setArchive] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(70);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/logs/");
      const data = await response.json();
      setArchive(data);
    } catch (error) {
      console.error("Error fetching archive:", error);
    }
  };

  const handleViewPress = (entry) => {
    setSelectedEntry(entry);
    setModalVisible(true);
  };

  const handleLogout = () => {
    setLogoutModalVisible(false);
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Sidebar />

      {/* Main Content */}
      <View style={[styles.mainContent, { marginLeft: sidebarWidth }]}>
        <Text style={styles.title}>Archive</Text>
        <ScrollView contentContainerStyle={styles.listContainer}>
          {archive.map((item) => (
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
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/directory")}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Viewing Archive Entry */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>View</Text>
            {selectedEntry && (
              <>
                <Text style={styles.modalDate}>{selectedEntry.date}</Text>
                <Text style={styles.modalText}>Patient ID - 0012345AB</Text>
                <Text style={styles.modalDescription}>Add Description of Changes Here</Text>
              </>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Table with ScrollView */}
          <View
            style={{
              marginTop: 20,
              backgroundColor: "white",
              borderRadius: 15,
              borderWidth: 1,
              borderColor: "black",
              overflow: "hidden",
              maxHeight: 560, // Added maxHeight for table scroll
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            {/* Table Header */}
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "white",
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderColor: "black",
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  Patient ID
                </Text>
              </View>
              <View
                style={{
                  flex: 2,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  Patient Name
                </Text>
              </View>
              <View
                style={{
                  flex: 2,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  Archived Date
                </Text>
              </View>
              <View style={{ width: 50 }} />{" "}
              {/* Empty view for the removed button space */}
            </View>

            {/* ScrollView for Table Rows */}
            <ScrollView>
              <FlatList
                data={displayedPatients}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    disabled={!item.patient_number}
                    onPress={() => {
                      if (item.patient_number) {
                        router.push(
                          `/history?patient_number=${item.patient_number}`
                        );
                      }
                    }}
                    style={{
                      flexDirection: "row",
                      backgroundColor: item.patient_number
                        ? "white"
                        : "lightgrey",
                      borderBottomWidth: 1,
                      borderColor: "black",
                      minHeight: 35,
                    }}
                  >
                    {/* Patient ID */}
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRightWidth: 1,
                        borderColor: "black",
                        paddingHorizontal: 5,
                      }}
                    >
                      <Text style={{ fontSize: 15 }}>
                        {item.patient_number || ""}
                      </Text>
                    </View>

                    {/* Patient Name */}
                    <View
                      style={{
                        flex: 2,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRightWidth: 1,
                        borderColor: "black",
                        paddingHorizontal: 5,
                      }}
                    >
                      <Text style={{ fontSize: 15, textAlign: "center" }}>
                        {item.first_name && item.last_name
                          ? formatName(
                              item.first_name,
                              item.middle_name,
                              item.last_name
                            )
                          : ""}
                      </Text>
                    </View>

                    {/* Archived Date */}
                    <View
                      style={{
                        flex: 2,
                        alignItems: "center",
                        justifyContent: "center",
                        borderColor: "black",
                        paddingHorizontal: 5,
                      }}
                    >
                      <Text style={{ fontSize: 15 }}>
                        {item.date_archived
                          ? new Date(item.date_archived).toLocaleString(
                              "en-PH",
                              {
                                timeZone: "Asia/Manila",
                              }
                            )
                          : ""}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: 50,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    />
                  </TouchableOpacity>
                )}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
