import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Svg, { Line, Circle, Text as SvgText } from "react-native-svg";
import Sidebar from "./components/sidebar";
import { useNotification } from "../notifcontext";
import { Checkbox } from "react-native-paper";
import styles from "./stylesheets/clockstyle";
import Constants from 'expo-constants';

const BASE_API = Constants.expoConfig.extra.BASE_API;

const AnalogClock = () => {
  const sidebarWidth = 70;
  const [time, setTime] = useState(new Date());
  const [upcomingAlerts, setUpcomingAlerts] = useState([]);
  const [pendingAlerts, setPendingAlerts] = useState([]);
  const [historyAlerts, setHistoryAlerts] = useState([]);
  const [timeLeftUpdates, setTimeLeftUpdates] = useState(new Date());
  const [activeTab, setActiveTab] = useState("upcoming");
  const [expandedAlerts, setExpandedAlerts] = useState({});
  const [checkedAlerts, setCheckedAlerts] = useState({});
  const { showNotification } = useNotification();
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedCancelId, setSelectedCancelId] = useState(null);
  const upcomingRef = React.useRef([]);
  const [activationTimes, setActivationTimes] = useState({});

  const toggleExpand = (id) => {
    setExpandedAlerts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleCheckbox = (id) => {
    const updatedStatus = checkedAlerts[id] ? "pending" : "administered";

    setCheckedAlerts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAdministeredPress = (id) => {
    const alert = upcomingAlerts.find((a) => a.schedule_id === id);
    if (!alert) return;

    setUpcomingAlerts((prev) => prev.filter((a) => a.schedule_id !== id));
    setHistoryAlerts((prev) => [...prev, { ...alert, status: "administered" }]);
    setCheckedAlerts((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const handlePendingAdministered = (id) => {
    const alert = pendingAlerts.find((a) => a.schedule_id === id);

    if (alert) {
      setPendingAlerts((prev) => prev.filter((a) => a.schedule_id !== id));
      setHistoryAlerts((prev) => [
        ...prev,
        { ...alert, status: "administered" },
      ]);
      setCheckedAlerts((prev) => ({
        ...prev,
        [id]: true,
      }));
    }
  };

  const moveAlertToPending = (id) => {
    const alert = upcomingAlerts.find((a) => a.schedule_id === id);
    if (!alert) return;

    const updatedAlert = { ...alert, status: "pending" };
    setUpcomingAlerts((prev) => prev.filter((a) => a.schedule_id !== id));
    setPendingAlerts((prev) => [...prev, updatedAlert]);
  };

  const moveAlertToHistory = (id) => {
    const alert = pendingAlerts.find((a) => a.schedule_id === id);
    setPendingAlerts((prev) => prev.filter((a) => a.schedule_id !== id));
    setHistoryAlerts((prev) => [...prev, alert]);
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

  const getTextColor = (alertTime, status) => {
    if (status === "pending") return "#333";
    return isCurrentTime(alertTime) ? "#333" : "#FFFFFF";
  };

  const isCurrentTime = (alertTime) => {
    const now = new Date();
    const [alertHours, alertMinutes] = alertTime.split(":").map(Number);

    return now.getHours() === alertHours && now.getMinutes() === alertMinutes;
  };

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTimeLeftUpdates(new Date()), 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch(`${BASE_API}/api/medications`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          setUpcomingAlerts(data);
        } else {
          // if API returned empty data, uses mock data
          setUpcomingAlerts([...mockData1, ...mockData2]);
        }
      } catch (error) {
        console.error("Fetch failed, using mock data instead:", error);
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
        medicationNotes: "ABC",
        room_number: "102",
        quantity: "5",
        Medication_Time: "21:41",
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
        medicationNotes: "ABC",
        room_number: "103",
        quantity: "7",
        Medication_Time: "4:09",
      },
    ];

    fetchAlerts();
  }, []);

  const isActiveAlert = (alert) => {
    const now = new Date();
    const [alertHours, alertMinutes] =
      alert.Medication_Time.split(":").map(Number);
    const isNow =
      now.getHours() === alertHours && now.getMinutes() === alertMinutes;

    if (isNow && !activationTimes[alert.schedule_id]) {
      setActivationTimes((prev) => ({
        ...prev,
        [alert.schedule_id]: new Date(),
      }));
    }

    return isNow;
  };

  const calculateTimeLeft = (alertTime) => {
    const now = timeLeftUpdates;
    const [alertHours, alertMinutes] = alertTime.split(":").map(Number);

    const alertDate = new Date(now);
    alertDate.setHours(alertHours, alertMinutes, 0, 0);

    const diff = alertDate - now;

    if (diff < 0) return "Administered";
    if (diff === 0) return "Now";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours > 0 ? `${hours}h ` : ""}${minutes}m`;
  };

  const checkAlertStatus = () => {
    const now = new Date();

    upcomingAlerts.forEach((alert) => {
      const id = alert.schedule_id;
      const activatedAt = activationTimes[id];

      // If active for >= 1 minute and not administered
      if (
        activatedAt &&
        !checkedAlerts[id] &&
        now - new Date(activatedAt) >= 1 * 60 * 1000 //adjust for testing
      ) {
        moveAlertToPending(id);

        // Clean up activation time
        setActivationTimes((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      checkAlertStatus();
    }, 60000);

    return () => clearInterval(interval);
  }, [activationTimes, checkedAlerts]);

  const getRotation = (unit, max) => (unit / max) * 360;
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

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

  const sortedAlerts = [...filteredAlerts]
    .map((alert) => ({
      ...alert,
      isActive: isActiveAlert(alert),
    }))
    .sort((a, b) => {
      // Put active alerts on top
      if (a.isActive !== b.isActive) {
        return a.isActive ? -1 : 1;
      }

      // Otherwise sort by time
      const [h1, m1] = a.Medication_Time.split(":").map(Number);
      const [h2, m2] = b.Medication_Time.split(":").map(Number);
      return h1 * 60 + m1 - (h2 * 60 + m2);
    });

  const handleCancelPress = (id) => {
    setSelectedCancelId(id);
    setCancelReason("");
    setIsCancelModalVisible(true);
  };

  const confirmCancellation = () => {
    const allAlerts = [...upcomingAlerts, ...pendingAlerts];
    const alert = allAlerts.find((a) => a.schedule_id === selectedCancelId);

    if (alert) {
      const updatedAlert = { ...alert, status: "cancelled", cancelReason };
      setUpcomingAlerts((prev) =>
        prev.filter((a) => a.schedule_id !== selectedCancelId)
      );
      setPendingAlerts((prev) =>
        prev.filter((a) => a.schedule_id !== selectedCancelId)
      );
      setHistoryAlerts((prev) => [...prev, updatedAlert]);
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

  return (
    <View style={styles.container}>
      <Sidebar />
      <View style={[styles.header,  { marginLeft: sidebarWidth }]}>
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
                  const isActive = alert.status === "active";
                  const isHistoryTab = activeTab === "history";
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
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          flex: 1,
                        }}
                      >
                        <Checkbox
                          status={
                            checkedAlerts[scheduleId] ? "checked" : "unchecked"
                          }
                          onPress={
                            activeTab !== "history"
                              ? () => toggleCheckbox(scheduleId)
                              : null
                          }
                          color={checkedAlerts[scheduleId] ? "#333" : "#CCCCCC"}
                          style={styles.checkboxPosition}
                        />
                        <View style={{ marginLeft: 10, flex: 1 }}>
                          <Text
                            style={[
                              styles.alertText,
                              { color: getTextColor(alert.Medication_Time) },
                            ]}
                          >
                            Schedule ID: {alert.patient_number} - {scheduleId}
                          </Text>
                          {isExpanded && (
                            <>
                              <Text
                                style={[
                                  styles.alertText,
                                  {
                                    color: getTextColor(alert.Medication_Time),
                                  },
                                ]}
                              >
                                {alert.patient_first_name} {alert.patient_middle_name} {alert.patient_last_name}
                                {/* pls keep like this para naay space in between the names */}
                              </Text>
                              <Text
                                style={[
                                  styles.alertText,
                                  {
                                    color: getTextColor(alert.Medication_Time),
                                  },
                                ]}
                              >
                                Room {alert.room_number}
                              </Text>
                              <Text
                                style={[
                                  styles.alertText,
                                  {
                                    color: getTextColor(alert.Medication_Time),
                                  },
                                ]}
                              >
                                {alert.medicationName}
                              </Text>
                              <Text
                                style={[
                                  styles.alertText,
                                  {
                                    color: getTextColor(alert.Medication_Time),
                                  },
                                ]}
                              >
                                Dosage: {alert.dosage} {alert.dosageUnit}
                              </Text>
                              <Text
                                style={[
                                  styles.alertText,
                                  {
                                    color: getTextColor(alert.Medication_Time),
                                  },
                                ]}
                              >
                                Notes: {alert.medicationNotes}
                              </Text>
                              {activeTab !== "history" && (
                                <View style={styles.buttonContainer}>
                                  <TouchableOpacity
                                    style={[
                                      styles.button,
                                      { backgroundColor: "#D9534F" },
                                    ]}
                                    onPress={() =>
                                      handleCancelPress(scheduleId)
                                    }
                                  >
                                    <Text style={styles.buttonText}>
                                      Cancel
                                    </Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    style={[
                                      styles.button,
                                      { backgroundColor: "#5879A5" },
                                    ]}
                                    onPress={() => {
                                      if (activeTab === "upcoming") {
                                        handleAdministeredPress(scheduleId);
                                      } else if (activeTab === "pending") {
                                        handlePendingAdministered(scheduleId);
                                      }
                                    }}
                                  >
                                    <Text style={styles.buttonText}>
                                      Administered
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
        <View style={styles.clockWrapper}>
          <Svg height="350" width="350" viewBox="0 0 300 300">
            <Circle
              cx="150"
              cy="150"
              r="142.5"
              stroke="black"
              strokeWidth="3"
              fill="none"
            />
            {[...Array(12)].map((_, i) => (
              <React.Fragment key={`tick-${i}`}>
                <Line
                  x1={150 + 135 * Math.cos((i * 30 - 90) * (Math.PI / 180))}
                  y1={150 + 135 * Math.sin((i * 30 - 90) * (Math.PI / 180))}
                  x2={150 + 142.5 * Math.cos((i * 30 - 90) * (Math.PI / 180))}
                  y2={150 + 142.5 * Math.sin((i * 30 - 90) * (Math.PI / 180))}
                  stroke="black"
                  strokeWidth="3"
                />
                <SvgText
                  x={150 + 120 * Math.cos((i * 30 - 90) * (Math.PI / 180))}
                  y={150 + 120 * Math.sin((i * 30 - 90) * (Math.PI / 180))}
                  fontSize="18"
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {i === 0 ? 12 : i}
                </SvgText>
              </React.Fragment>
            ))}
            <Line
              x1="150"
              y1="150"
              x2={
                150 +
                60 * Math.cos((getRotation(hours, 12) - 90) * (Math.PI / 180))
              }
              y2={
                150 +
                60 * Math.sin((getRotation(hours, 12) - 90) * (Math.PI / 180))
              }
              stroke="black"
              strokeWidth="6"
            />
            <Line
              x1="150"
              y1="150"
              x2={
                150 +
                90 * Math.cos((getRotation(minutes, 60) - 90) * (Math.PI / 180))
              }
              y2={
                150 +
                90 * Math.sin((getRotation(minutes, 60) - 90) * (Math.PI / 180))
              }
              stroke="black"
              strokeWidth="4.5"
            />
            <Line
              x1="150"
              y1="150"
              x2={
                150 +
                105 *
                Math.cos((getRotation(seconds, 60) - 90) * (Math.PI / 180))
              }
              y2={
                150 +
                105 *
                Math.sin((getRotation(seconds, 60) - 90) * (Math.PI / 180))
              }
              stroke="red"
              strokeWidth="3"
            />
          </Svg>
          <Text style={styles.digitalTime}>
            {time.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        {isCancelModalVisible && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Reason for Cancellation</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter reason here"
                value={cancelReason}
                onChangeText={setCancelReason}
                multiline
              />
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  onPress={() => setIsCancelModalVisible(false)}
                  style={[styles.modalButtons, styles.cancelButton]}
                >
                  <Text style={[styles.modalButton]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={confirmCancellation}
                  style={[styles.modalButtons, styles.confirmButton]}
                >
                  <Text style={[styles.modalButton]}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default AnalogClock;
