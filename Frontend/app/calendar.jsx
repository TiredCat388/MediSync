import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, FlatList, Modal, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Sidebar from './components/sidebar';
import Constants from 'expo-constants';
import { SafeAreaView } from "react-native-safe-area-context";
import AppText from './components/AppText';
import styles from './stylesheets/calendarstyle';


const BASE_API = Constants.expoConfig.extra.BASE_API;

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
const datenow = new Date();


export default function CalendarApp() {
  const currenMonth = datenow.getMonth();
  const currenYear = datenow.getFullYear();

  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(3); 
  const [currentYear, setCurrentYear] = useState(2025);
  const [sidebarWidth, setSidebarWidth] = useState(70);
  const [medicationData, setMedicationData] = useState({});
  const router = useRouter();

  // Fetch medication data for all patients
  const fetchMedicationData = async () => {
  try {
    const response = await fetch(`${BASE_API}/api/medications`);
    if (!response.ok) {
      throw new Error("Failed to fetch medication data");
    }

    const data = await response.json();
    const formattedData = {};
    const patientNames = {};

    for (const med of data) {
      const medDate = med.Medication_start_date?.split("T")[0];
      if (!medDate) continue;
      if (!patientNames[med.patient_number]) {
        const patientResponse = await fetch(`${BASE_API}/api/patients/${med.patient_number}`);
        const patientData = await patientResponse.json();
        patientNames[med.patient_number] = `${patientData.first_name} ${patientData.last_name}`;
      }

      if (!formattedData[medDate]) {
        formattedData[medDate] = [];
      }

      formattedData[medDate].push({
        name: med.Medication_name,
        time: med.Medication_Time,
        patientId: med.patient_number,
        patientName: patientNames[med.patient_number],
        scheduleId: med.schedule_id,
        frequencyType: med.Frequency_type, 
      });
    }

    console.log("Formatted Data:", formattedData);
    setMedicationData(formattedData);
  } catch (error) {
    console.error("Error fetching medication data:", error);
  }
};
  

  useEffect(() => {
    fetchMedicationData();
  }, []);

  const handleDatePress = (date) => {
    setSelectedDate(date);
    setModalVisible(true);
  };

  const handleMonthChange = (direction) => {
    setCurrentMonth((prevMonth) => {
      let newMonth = prevMonth + direction;
      let newYear = currentYear;
      if (newMonth < 0) {
        newMonth = 11;
        newYear--;
      } else if (newMonth > 11) {
        newMonth = 0;
        newYear++;
      }
      setCurrentYear(newYear);
      return newMonth;
    });
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const dates = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDay + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });

  function getFrequencyColor(frequencyType) {
    switch (frequencyType) {
      case "OD":
        return "white";
      case "BID":
        return "yellow";
      case "TID":
        return "pink";
      case "QID":
        return "lightgreen";
      default:
        return "#e0e0e0";
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Sidebar setSidebarWidth={setSidebarWidth} />
        <View style={[styles.content, { marginLeft: sidebarWidth }]}>
          <AppText style={styles.headerText}>Calendar</AppText>

          {/* Legend */}
          <View style={styles.legendRow}>
            {[
              { label: "OID", color: "#F8F8F8", borderWidth: 1, borderColor: "#333333" },
              { label: "BID", color: "#FFDA07" },
              { label: "TID", color: "#EFA2CB" },
              { label: "QID", color: "#85D684" },
            ].map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendCircle,
                    { backgroundColor: item.color, borderWidth: item.borderWidth || 1, borderColor: item.borderColor || "#303030" }
                  ]}
                />
                <AppText style={styles.legendLabel}>{item.label}</AppText>
              </View>
            ))}
          </View>

          {/* Calendar Section */}
          <View style={styles.calendarSection}>
            {/* Calendar Header */}
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={() => handleMonthChange(-1)}>
                <Feather name="arrow-left-circle" size={30} color="white" />
              </TouchableOpacity>
              <AppText style={styles.calendarHeaderText}>
                {months[currentMonth]} {currentYear}
              </AppText>
              <TouchableOpacity onPress={() => handleMonthChange(1)}>
                <Feather name="arrow-right-circle" size={30} color="white" />
              </TouchableOpacity>
            </View>
            {/* Days of the Week */}
            <View style={styles.daysOfWeekRow}>
              {daysOfWeek.map((day) => (
                <AppText key={day} style={styles.dayOfWeek}>
                  {day}
                </AppText>
              ))}
            </View>
            {/* Calendar Grid */}
            <FlatList
              data={dates}
              numColumns={7}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => {
                const dateKey = item
                  ? `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(item).padStart(2, "0")}`
                  : null;
                const medications = dateKey && medicationData[dateKey] ? medicationData[dateKey] : [];
                return (
                  <TouchableOpacity
                    style={[
                      styles.calendarCell,
                      !item && styles.calendarCellDisabled,
                    ]}
                    onPress={() => item && handleDatePress(dateKey)}
                    disabled={!item}
                  >
                    {item && (
                      <>
                        <AppText style={styles.calendarCellDate}>{item}</AppText>
                        <View style={styles.calendarCellMedList}>
                          {medications.slice(0, 3).map((med, index) => (
                            <View key={index} style={styles.calendarCellMed}>
                              <AppText style={styles.calendarCellMedText} numberOfLines={1}>
                                {med.name} at {med.time} (Patient: {med.patientName}, Schedule ID: {med.scheduleId})
                              </AppText>
                            </View>
                          ))}
                          {medications.length > 3 && (
                            <AppText style={styles.calendarCellMore}>
                              +{medications.length - 3} more
                            </AppText>
                          )}
                        </View>
                      </>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>

          {/* Date Details Modal */}
          <Modal visible={modalVisible} transparent={true} animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <AppText style={styles.modalTitle}>
                  Details for {selectedDate}
                </AppText>
                <ScrollView style={styles.modalScroll}>
                  {medicationData[selectedDate] ? (
                    medicationData[selectedDate].map((med, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.modalMed}
                        onPress={() => {
                          router.push(
                            `/viewmed?schedule_id=${med.scheduleId}&patient_number=${med.patientId}`
                          );
                        }}
                      >
                        <AppText style={styles.modalMedText} numberOfLines={1}>
                          {med.name} at {med.time} (Patient: {med.patientName}, Schedule ID: {med.scheduleId})
                        </AppText>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <AppText>No medications for this day.</AppText>
                  )}
                </ScrollView>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.modalCloseButton}
                >
                  <AppText style={styles.modalCloseButtonText}>Close</AppText>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </SafeAreaView>
  );
}