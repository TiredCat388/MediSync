import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, Button,ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Sidebar from './components/sidebar';
import Constants from 'expo-constants';

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
  const [currentMonth, setCurrentMonth] = useState(currenMonth); // April (0-indexed)
  const [currentYear, setCurrentYear] = useState(currenYear);
  const [sidebarWidth, setSidebarWidth] = useState(70); // Default sidebar width when collapsed
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
    <View style={{ flex: 1, flexDirection: "row" }}>
      <Sidebar setSidebarWidth={setSidebarWidth} />

      {/* Main Calendar Content */}
      <ScrollView style={{ flex: 1, padding: 40, marginLeft: sidebarWidth }}>
        <Text style={{ fontSize: 30, fontWeight: "bold", margin: 8 }}>
          Calendar
        </Text>

        {/* Calendar Section */}
        <View
          style={{
            backgroundColor:"#5879A5",
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 8,
            margin: 8,
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            height: 630,
          }}
        >
          {/* Calendar Header */}
          <View
            style={{
              backgroundColor: "#5879A5",
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              padding: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity onPress={() => handleMonthChange(-1)}>
              <Feather name="arrow-left-circle" size={30} color="white" />
            </TouchableOpacity>
            <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
              {months[currentMonth]} {currentYear}
            </Text>
            <TouchableOpacity onPress={() => handleMonthChange(1)}>
              <Feather name="arrow-right-circle" size={30} color="white" />
            </TouchableOpacity>
          </View>

          {/* Days of the Week */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              backgroundColor: "white",
              padding: 4,
              borderBottomWidth: 1,
              borderColor: "#ccc",
            }}
          >
            {daysOfWeek.map((day) => (
              <Text
                key={day}
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontWeight: "600",
                  padding: 4,
                }}
              >
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <FlatList
            data={dates}
            numColumns={7}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              const dateKey = item
                ? `${currentYear}-${String(currentMonth + 1).padStart(
                    2,
                    "0"
                  )}-${String(item).padStart(2, "0")}`
                : null;

              const medications =
                dateKey && medicationData[dateKey]
                  ? medicationData[dateKey]
                  : [];

              return (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    aspectRatio: 1,
                    borderWidth: 0.5,
                    borderColor: "#ccc",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor: item ? "white" : "#e0e0e0",
                    padding: 4,
                  }}
                  onPress={() => item && handleDatePress(dateKey)}
                  disabled={!item}
                >
                  {item && (
                    <>
                      <Text style={{ fontSize: 16, marginBottom: 2 }}>
                        {item}
                      </Text>
                      <View
                        style={{
                          width: "100%",
                          alignItems: "center",
                          marginTop: 2,
                        }}
                      >
                        {medications.slice(0, 3).map((med, index) => (
                          <View
                            key={index}
                            style={{
                              backgroundColor: getFrequencyColor(
                                med.frequencyType
                              ), // <-- Use the color
                              paddingHorizontal: 7,
                              paddingVertical: 7,
                              borderRadius: 3,
                              marginVertical: 1,
                              width: "100%",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 12,
                                textAlign: "flex-start",
                                color: "#000",
                                fontWeight: "bold",
                              }}
                              numberOfLines={1}
                            >
                              {med.name} at {med.time} (Patient:{" "}
                              {med.patientName}, Schedule ID: {med.scheduleId})
                            </Text>
                          </View>
                        ))}
                        {medications.length > 3 && (
                          <Text style={{ fontSize: 14, color: "#5879A5" }}>
                            +{medications.length - 3} more
                          </Text>
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
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 500,
                height: 500,
                padding: 20,
                backgroundColor: "white",
                borderRadius: 10,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Details for {selectedDate}
              </Text>

              <ScrollView style={{ marginVertical: 10 }}>
                {medicationData[selectedDate] ? (
                  medicationData[selectedDate].map((med, index) => (
                    <TouchableOpacity
                      key={index}
                      style={{
                        backgroundColor: getFrequencyColor(
                                med.frequencyType
                              ), 
                        padding: 10,
                        borderRadius: 5,
                        marginVertical: 5,
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                      }}
                      onPress={() => {
                        router.push(
                          `/viewmed?schedule_id=${med.scheduleId}&patient_number=${med.patientId}`
                        );
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          textAlign: "flex-start",
                          color: "#000",
                          fontWeight: "bold",
                        }}
                        numberOfLines={1}
                      >
                        {med.name} at {med.time} (Patient:{" "}
                        {med.patientName}, Schedule ID: {med.scheduleId})
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text>No medications for this day.</Text>
                )}
              </ScrollView>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  backgroundColor: '#ff0000',
                  paddingVertical: 10,
                  borderRadius: 5,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: 'white', fontWeight:'bold', fontSize: 16 }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}