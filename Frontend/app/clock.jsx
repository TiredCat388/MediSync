import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Button,
} from "react-native";
import Sidebar from "./components/sidebar";
import { Checkbox } from "react-native-paper";
import styles from "./stylesheets/clockstyle";
import Constants from "expo-constants";
import Clock from "./components/analogclock";

const BASE_API = Constants.expoConfig.extra.BASE_API;

const AnalogClock = () => {
  const sidebarWidth = 70;
  const upcomingRef = useRef([]);
  const [time, setTime] = useState(new Date());
  const [upcomingAlerts, setUpcomingAlerts] = useState([]);
  const [pendingAlerts, setPendingAlerts] = useState([]);
  const [historyAlerts, setHistoryAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [expandedAlerts, setExpandedAlerts] = useState({});
  const [checkedAlerts, setCheckedAlerts] = useState({});
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedCancelId, setSelectedCancelId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedAlerts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAdministerPress = (scheduleId) => {
    // Try to find alert in upcoming or pending
    const alertToAdminister =
      upcomingAlerts.find((a) => a.schedule_id === scheduleId) ||
      pendingAlerts.find((a) => a.schedule_id === scheduleId);

    if (!alertToAdminister) return; // nothing found

    // Remove from upcoming and pending
    setUpcomingAlerts((prev) =>
      prev.filter((alert) => alert.schedule_id !== scheduleId)
    );
    setPendingAlerts((prev) =>
      prev.filter((alert) => alert.schedule_id !== scheduleId)
    );

    // Add to history with status administered
    setHistoryAlerts((prev) => [
      ...prev,
      {
        ...alertToAdminister,
        status: "administered",
      },
    ]);

    // Check the alert
    setCheckedAlerts((prev) => ({
      ...prev,
      [scheduleId]: true,
    }));
  };

  const getCardStyle = (alertTime) => {
    if (activeTab === "upcoming") {
      if (isCurrentTime(alertTime)) {
        return { backgroundColor: "#FAFAFA" };
      }
      return { backgroundColor: "#B8CBDB" };
    }
    if (activeTab === "history") {
      return { backgroundColor: "#9a9a9a" };
    }
    return { backgroundColor: "#FAFAFA" };
  };

  const isCurrentTime = (alertTime) => {
    if (!alertTime) return false; // <-- Add this guard
    const [alertHours, alertMinutes] = alertTime.split(":").map(Number);
    const now = new Date();
    return now.getHours() === alertHours && now.getMinutes() === alertMinutes;
  };

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch alerts once (can keep mock fallback)
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        // Fetch both medication schedules and patient info
        const [medsResponse, patientsResponse] = await Promise.all([
          fetch(`${BASE_API}/api/medications`),
          fetch(`${BASE_API}/api/patients`),
        ]);

        if (!medsResponse.ok || !patientsResponse.ok) {
          throw new Error("Failed to fetch meds or patients");
        }

        const medsData = await medsResponse.json();
        console.log("Fetched medications:", medsData);
        const patientsData = await patientsResponse.json();

        // Index patients by patientID for fast lookup
        const patientMap = {};
        patientsData.forEach((p) => {
          patientMap[p.patientID] = p;
        });

        // Combine the medication and patient data
        const enrichedAlerts = medsData.map((med) => {
          const patient = patientMap[med.patientID] || {};
          return {
            ...med,
            patient_first_name: patient.first_name || "",
            patient_middle_name: patient.middle_name || "",
            patient_last_name: patient.last_name || "",
            room_number: patient.room_number || "N/A",
            // medicationName may already be in med, if not add fallback here
          };
        });

        setUpcomingAlerts(enrichedAlerts);
      } catch (error) {
        console.error("Fetch failed:", error);
        // You may want to use mock data here as fallback
        setUpcomingAlerts([...mockData1, ...mockData2]);
      }
    };

    const mockData1 = [
      {
        patientID: "AB256",
        schedule_id: "SCH123",
        patient_first_name: "Jane",
        patient_middle_name: "Bee",
        patient_last_name: "Smith",
        medicationName: "Ibuprofen",
        dosage: "2",
        dosageUnit: "tablets",
        medicationNotes:
          "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
        room_number: "102",
        quantity: "5",
        Medication_Time: "13:12",
      },
    ];

    const mockData2 = [
      {
        patientID: "AB123",
        schedule_id: "SCH122",
        patient_first_name: "John",
        patient_middle_name: "Adam",
        patient_last_name: "Doe",
        medicationName: "Paracetamol",
        dosage: "500",
        dosageUnit: "mg",
        medicationNotes:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        room_number: "103",
        quantity: "7",
        Medication_Time: "13:12",
      },
    ];

    fetchAlerts();
  }, []);

  const activeAlerts =
    activeTab === "upcoming"
      ? upcomingAlerts
      : activeTab === "pending"
      ? pendingAlerts
      : activeTab === "history"
      ? historyAlerts
      : [];

  const filteredAlerts = activeAlerts.filter((alert) => {
    if (activeTab === "upcoming") return true;
    if (activeTab === "pending") return alert.status === "pending";
    if (activeTab === "history")
      return alert.status === "administered" || alert.status === "cancelled";
    return false;
  });

  // Keep sorting by time and isActive if needed
  const sortedAlerts = [...filteredAlerts]
    .map((alert) => ({
      ...alert,
      isActive: isCurrentTime(alert.Medication_Time),
    }))
    .sort((a, b) => {
      if (a.isActive !== b.isActive) {
        return a.isActive ? -1 : 1;
      }
      const [h1, m1] = a.Medication_Time.split(":").map(Number);
      const [h2, m2] = b.Medication_Time.split(":").map(Number);
      return h1 * 60 + m1 - (h2 * 60 + m2);
    });

  // Cancel modal handling stays but no moving of alerts between lists
  const handleCancelPress = (id) => {
    setSelectedCancelId(id);
    setCancelReason("");
    setIsCancelModalVisible(true);
  };

  const confirmCancellation = () => {
    // Try to find alert in upcoming or pending
    const cancelledAlert =
      upcomingAlerts.find((a) => a.schedule_id === selectedCancelId) ||
      pendingAlerts.find((a) => a.schedule_id === selectedCancelId);

    if (cancelledAlert) {
      // Remove from upcoming and pending
      setUpcomingAlerts((prev) =>
        prev.filter((a) => a.schedule_id !== selectedCancelId)
      );
      setPendingAlerts((prev) =>
        prev.filter((a) => a.schedule_id !== selectedCancelId)
      );

      // Add to history with status cancelled and reason
      setHistoryAlerts((prev) => [
        ...prev,
        {
          ...cancelledAlert,
          status: "cancelled",
          cancelReason,
        },
      ]);
    }

    setIsCancelModalVisible(false);
    setSelectedCancelId(null);
    setCancelReason("");
  };

  useEffect(() => {
    if (activeTab === "history") {
      setExpandedAlerts({});
    }
  }, [activeTab]);

  useEffect(() => {
    upcomingRef.current = upcomingAlerts;
  }, [upcomingAlerts]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const updatedUpcoming = [];
      const newlyPending = [];

      upcomingRef.current.forEach((alert) => {
        const [alertHour, alertMinute] =
          alert.Medication_Time.split(":").map(Number);
        const alertDate = new Date();
        alertDate.setHours(alertHour, alertMinute, 0, 0);

        const diffInMinutes = (now - alertDate) / (1000 * 60);

        if (diffInMinutes > 1) {
          newlyPending.push({ ...alert, status: "pending" });
        } else {
          updatedUpcoming.push(alert);
        }
      });

      if (newlyPending.length > 0) {
        setUpcomingAlerts(updatedUpcoming);
        setPendingAlerts((prev) => [...prev, ...newlyPending]);
      }
    }, 60 * 1000); // run every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Sidebar />
      <View style={[styles.header, { marginLeft: sidebarWidth }]}>
        <Text style={styles.headerText}>Alerts List</Text>
      </View>
      <View style={[styles.mainRow, { marginLeft: sidebarWidth }]}>
        <View style={styles.alertPanel}>
          <View style={styles.tabHeader}>
            {["upcoming", "pending", "history"].map((tab, index) => (
              <Text
                key={tab}
                style={[
                  styles.tabText,
                  activeTab === tab ? styles.activeTab : styles.inactiveTab,
                  index === 0 && { marginRight: 8 },
                  index === 2 && { marginLeft: 8 },
                ]}
                onPress={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            ))}
          </View>
          <View style={styles.tabContent}>
            <ScrollView style={styles.alertList}>
              {sortedAlerts.length === 0 ? (
                <Text style={styles.noAlerts}>No alerts</Text>
              ) : (
                sortedAlerts.map((alert) => {
                  const scheduleId = alert.schedule_id;
                  const isExpanded = expandedAlerts[scheduleId];
                  return (
                    <TouchableOpacity
                      key={scheduleId}
                      style={[
                        styles.alertItem,
                        getCardStyle(alert.Medication_Time),
                      ]}
                      onPress={() => toggleExpand(scheduleId)}
                      activeOpacity={0.9}
                    >
                      <View style={{ flexDirection: "row", flex: 1 }}>
                        <View style={{ alignSelf: "flex-start" }}>
                          <Checkbox
                            status={
                              activeTab === "history"
                                ? alert.status === "administered"
                                  ? "checked"
                                  : "unchecked"
                                : checkedAlerts[scheduleId]
                                ? "checked"
                                : "unchecked"
                            }
                            onPress={null}
                            color={
                              checkedAlerts[scheduleId] ? "#333" : "#CCCCCC"
                            }
                            style={styles.checkboxPosition}
                          />
                        </View>
                        <View style={{ marginLeft: 10, flex: 1 }}>
                          <Text style={[styles.alertText]}>
                            Schedule ID: {alert.patient_number} - {scheduleId}
                          </Text>
                          {isExpanded && (
                            <>
                              <Text style={[styles.alertText]}>
                                {alert.patient_first_name}{" "}
                                {alert.patient_middle_name}{" "}
                                {alert.patient_last_name} - Room{" "}
                                {alert.room_number}
                              </Text>
                              <Text style={[styles.alertText]}>
                                Medication: {alert.Medication_name}
                              </Text>
                              <Text style={[styles.alertText]}>
                                Medication Form: {alert.Medication_form}
                              </Text>
                              <Text style={[styles.alertText]}>
                                Strength: {alert.Medication_strength} {alert.Medication_unit}
                              </Text>
                              <Text style={[styles.alertText]}>
                                Notes: {alert.Medication_notes}
                              </Text>
                              {(activeTab === "upcoming" ||
                                activeTab === "pending") && (
                                <View style={styles.tabButtonContainer}>
                                  <TouchableOpacity
                                    style={[
                                      styles.tabButton,
                                      styles.confirmButton,
                                    ]}
                                    onPress={() =>
                                      handleAdministerPress(scheduleId)
                                    }
                                  >
                                    <Text style={styles.buttonText}>
                                      Administer
                                    </Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    style={[
                                      styles.tabButton,
                                      styles.cancelButton,
                                    ]}
                                    onPress={() =>
                                      handleCancelPress(scheduleId)
                                    }
                                  >
                                    <Text style={styles.buttonText}>
                                      Cancel
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              )}
                            </>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          </View>
        </View>
        <View style={styles.clockPanel}>
          <Clock style={{ alignSelf: "center", marginVertical: 20 }} />
          <View style={styles.clock}></View>
        </View>
      </View>

      <Modal
        visible={isCancelModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCancelModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Cancel Medication</Text>
            <Text>Please provide a reason for cancellation:</Text>
            <TextInput
              style={styles.modalInput}
              multiline
              placeholder="Enter reason"
              value={cancelReason}
              onChangeText={setCancelReason}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButtons]}
                onPress={() => setIsCancelModalVisible(false)}
              >
                <Text style={styles.modalButton}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButtons,
                  styles.confirmButton,
                  !cancelReason.trim() && {
                    backgroundColor: "#808080",
                    opacity: 0.5,
                  },
                ]}
                onPress={confirmCancellation}
                disabled={!cancelReason.trim()}
              >
                <Text style={styles.modalButton}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AnalogClock;
