import React, { useEffect, useState, useRef } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import Sidebar from "./components/sidebar";
import { Checkbox } from "react-native-paper";
import styles from "./stylesheets/clockstyle";
import Constants from "expo-constants";
import Clock from "./components/analogclock";
import { SafeAreaView } from "react-native-safe-area-context";
import AppText from './components/AppText';

const BASE_API = Constants.expoConfig.extra.BASE_API;

const AnalogClock = () => {
  const sidebarWidth = 70;
  const upcomingRef = useRef([]);
  const administeredKeys = useRef(new Set());
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
  const [medicationList, setMedicationList] = useState([]);

  const toggleExpand = (id) => {
    setExpandedAlerts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAdministerPress = (scheduleId) => {
    const alertToAdminister =
      upcomingAlerts.find((a) => a.id === scheduleId) ||
      pendingAlerts.find((a) => a.id === scheduleId);

    if (!alertToAdminister) return;

    // Create a unique key for this schedule and dose time
    const alertKey = `${scheduleId}_${alertToAdminister.next_dose_time}`;
    administeredKeys.current.add(alertKey);

    setUpcomingAlerts((prev) =>
      prev.filter((alert) => alert.id !== scheduleId)
    );
    setPendingAlerts((prev) =>
      prev.filter((alert) => alert.id !== scheduleId)
    );

    setHistoryAlerts((prev) => [
      ...prev,
      {
        ...alertToAdminister,
        status: "administered",
        administered: true,
      },
    ]);

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
    if (!alertTime) return false;
    const [alertHours, alertMinutes] = (alertTime || "").split(":").map(Number);
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
        // Fetch both medication schedules and only non-archived patients
        const [medsResponse, patientsResponse] = await Promise.all([
          fetch(`${BASE_API}/api/medications`),
          fetch(`${BASE_API}/api/patients?is_archived=false`),
        ]);

        if (!medsResponse.ok || !patientsResponse.ok) {
          throw new Error("Failed to fetch meds or patients");
        }

        const medsData = await medsResponse.json();
        const patientsData = await patientsResponse.json();

        // Index patients by patientID for fast lookup
        const patientMap = {};
        patientsData.forEach((p) => {
          patientMap[p.patient_number] = p;
        });

        // Combine the medication and patient data
        const enrichedAlerts = medsData
          .filter((med) => patientMap[med.patient_number]) // Only meds for non-archived patients
          .map((med) => {
            const patient = patientMap[med.patient_number] || {};
            return {
              ...med,
              patient_first_name: patient.first_name || "",
              patient_middle_name: patient.middle_name || "",
              patient_last_name: patient.last_name || "",
              room_number: patient.room_number || "N/A",
            };
          });

        setMedicationList(enrichedAlerts);

        // Initial filter for upcoming
        const now = new Date();
        const initialUpcoming = enrichedAlerts.filter(alert => {
          const alertDate = new Date(alert.next_dose_time);
          const diffMs = alertDate - now;
          const alertKey = `${alert.id}_${alert.next_dose_time}`;
          return !administeredKeys.current.has(alertKey) && diffMs > 0 && diffMs <= 3600000;
        });
        setUpcomingAlerts(initialUpcoming);

        // Initial filter for pending
        const initialPending = enrichedAlerts.filter(alert => {
          const alertDate = new Date(alert.next_dose_time);
          const diffMs = alertDate - now;
          const alertKey = `${alert.id}_${alert.next_dose_time}`;
          return !administeredKeys.current.has(alertKey) && diffMs <= 0;
        });
        setPendingAlerts(initialPending);

      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };

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
      upcomingAlerts.find((a) => a.id === selectedCancelId) ||
      pendingAlerts.find((a) => a.id === selectedCancelId);

    if (cancelledAlert) {
      // Remove from upcoming and pending
      setUpcomingAlerts((prev) =>
        prev.filter((a) => a.id !== selectedCancelId)
      );
      setPendingAlerts((prev) =>
        prev.filter((a) => a.id !== selectedCancelId)
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
    
    // Function to update upcoming and pending lists
    const updateAlerts = () => {
      const now = new Date();
      const updatedUpcoming = [];
      const newlyPending = [];
      const timestamp = new Date().toISOString();
      console.log(`[Updated medication][${timestamp}]`);

      // Clean up old administered keys
      administeredKeys.current.forEach((key) => {
        const [, nextDoseTime] = key.split("_");
        if (new Date(nextDoseTime) < now) {
          administeredKeys.current.delete(key);
        }
      });

      medicationList.forEach((alert) => {
        const alertDate = new Date(alert.next_dose_time);
        const diffMs = alertDate - now;
        const alertKey = `${alert.id}_${alert.next_dose_time}`;

        if (!administeredKeys.current.has(alertKey)) {
          if (diffMs > 0 && diffMs <= 3600000) {
            updatedUpcoming.push(alert);
          } else if (diffMs <= 0) {
            newlyPending.push({ ...alert, status: "pending" });
          }
        }
      });

      setUpcomingAlerts(updatedUpcoming);
      setPendingAlerts(newlyPending);

      // --- Clear old history entries for schedule_ids with new next_dose_time ---
      setHistoryAlerts((prevHistory) => {
        const latestDoseMap = {};
        medicationList.forEach(alert => {
          latestDoseMap[alert.id] = alert.next_dose_time;
        });
        // Only keep history entries that either:
        // - have a schedule_id not in the current medicationList
        // - or have the same next_dose_time as the latest for that schedule_id
        return prevHistory.filter(
          entry =>
            !latestDoseMap[entry.id] ||
            entry.next_dose_time === latestDoseMap[entry.id]
        );
      });
    };

    // Calculate ms until the next minute
    const now = new Date();
    const msUntilNextMinute = 60000 - (now.getTime() % 60000);

    // Start at the next minute
    const timeout = setTimeout(() => {
      updateAlerts();
      const interval = setInterval(updateAlerts, 60000);
      // Store interval id if you want to clear it later
    }, msUntilNextMinute);

    return () => {
      clearTimeout(timeout);
      // If you store interval id, clearInterval here as well
    };
  }, [medicationList]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Sidebar />
        <View style={[styles.header, { marginLeft: sidebarWidth }]}>
          <AppText style={styles.headerText}>Alerts List</AppText>
        </View>
        <View style={[styles.mainRow, { marginLeft: sidebarWidth }]}>
          <View style={styles.alertPanel}>
            <View style={styles.tabHeader}>
              {["upcoming", "pending", "history"].map((tab, index) => (
                <AppText
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
                </AppText>
              ))}
            </View>
            <View style={styles.tabContent}>
              <ScrollView style={styles.alertList}>
                {sortedAlerts.length === 0 ? (
                  <AppText style={styles.noAlerts}>No alerts</AppText>
                ) : (
                  sortedAlerts.map((alert) => {
                    const scheduleId = alert.id;
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
                          <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                              <AppText style={styles.alertText}>
                                Patient: {alert.patient_last_name.toUpperCase()}, {alert.patient_first_name} - {alert.Medication_name}
                              </AppText>
                              <AppText style={[styles.alertText, { paddingRight: 10 }]}>
                                {(() => {
                                  const [date, timeWithZone] = alert.next_dose_time.split("T");
                                  const time = timeWithZone?.split("+")[0];
                                  return `${date} | ${time}`;
                                })()}
                              </AppText>
                            </View>

                            {isExpanded && (
                              <>
                                <AppText style={[styles.alertText]}>
                                  Room{" "}{alert.room_number}
                                </AppText>
                                <AppText style={[styles.alertText]}>
                                  Medication Form: {alert.Medication_form}
                                </AppText>
                                <AppText style={[styles.alertText]}>
                                  Strength: {alert.Medication_strength} {alert.Medication_unit}
                                </AppText>
                                <AppText style={[styles.alertText]}>
                                  Medication Route: {alert.Medication_route}
                                </AppText>
                                <AppText style={[styles.alertText]}>
                                  Frequency: {alert.Frequency_type === 'Other'
                                    ? `${alert.frequency_days ? `${alert.frequency_days} Day${alert.frequency_days > 1 ? 's' : ''} ` : ''}` +
                                    `${alert.frequency_hours ? `${alert.frequency_hours} Hour${alert.frequency_hours > 1 ? 's' : ''} ` : ''}` +
                                    `${alert.frequency_minutes ? `${alert.frequency_minutes} Minute${alert.frequency_minutes > 1 ? 's' : ''}` : ''}`
                                    : alert.Frequency_type}
                                </AppText>
                                <AppText style={[styles.alertText]}>
                                  Physician: {alert.physicianID}
                                </AppText>
                                <AppText style={[styles.alertText]}>
                                  Notes: {alert.Medication_notes}
                                </AppText>
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
                                        <AppText style={styles.buttonText}>
                                          Administer
                                        </AppText>
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
                                        <AppText style={styles.buttonText}>
                                          Cancel
                                        </AppText>
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
              <AppText style={styles.modalTitle}>Cancel Medication</AppText>
              <AppText>Please provide a reason for cancellation:</AppText>
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
                  <AppText style={styles.modalButton}>Back</AppText>
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
                  <AppText style={styles.modalButton}>Confirm</AppText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default AnalogClock;
