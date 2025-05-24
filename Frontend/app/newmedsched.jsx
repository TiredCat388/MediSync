import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Sidebar from "./components/sidebar";
import RNPickerSelect from "react-native-picker-select";
import Autocomplete from "react-native-autocomplete-input";
import styles from "./stylesheets/newmedschedstyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomAlert from "./components/alert";
import Constants from "expo-constants";
import { ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Or FontAwesome, Feather, etc.

const BASE_API = Constants.expoConfig.extra.BASE_API;

const frequencyOptions = [
  { label: "OD (Once Daily)", value: "OD" },
  { label: "BID (Twice Daily)", value: "BID" },
  { label: "TID (Thrice Daily)", value: "TID" },
  { label: "QID (Four times Daily)", value: "QID" },
  { label: "Other", value: "Other" },
];

const frequencyIntervals = {
  OD: { days: 1, hours: 0, minutes: 0 },
  BID: { days: 0, hours: 10, minutes: 0 },
  TID: { days: 0, hours: 5, minutes: 0 },
  QID: { days: 0, hours: 4, minutes: 0 },
};

export default function NewMedSched() {
  const router = useRouter();
  const { patient_number } = useLocalSearchParams();

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [warningModalVisible, setWarningModalVisible] = useState(false);
  const [accessDeniedVisible, setAccessDeniedVisible] = useState(false);
  const [accessDeniedMessage, setAccessDeniedMessage] = useState("");
  const [addSuccessVisible, setAddSuccessVisible] = useState(false); // State for success alert
  const [addSuccessMessage, setAddSuccessMessage] = useState(""); // State for success message
  const [selectedDays, setSelectedDays] = useState([]);
  const [patientName, setPatientName] = useState(null);

  const [formData, setFormData] = useState({
    medicineName: "",
    medicationForm: "",
    medicationStrength: "",
    medicationUnit: "",
    medicationRoute: "",
    timeHour: "",
    timeMinute: "",
    medicationNotes: "",
    physicianID: "",
    frequencyDay: "",
    frequencyType: "",
    frequencyHour: "",
    frequencyMinute: "",
    medicationMonth: "",
    medicationDay: "",
    medicationYear: "",
    medicationEndMonth: "",
    medicationEndDay: "",
    medicationEndYear: "",
  });

  const [medications, setMedications] = useState([]);
  const [frequencyType, setFrequencyType] = useState("");
  const [filteredMedications, setFilteredMedications] = useState([]);
  const [query, setQuery] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [checkingRole, setCheckingRole] = useState(true);

  // Add this near your other state declarations
  const [physicianId, setPhysicianId] = useState("");

  // Update your checkAccess useEffect
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const [role, userId] = await Promise.all([
          AsyncStorage.getItem("userRole"),
          AsyncStorage.getItem("userId"),
        ]);

        console.log("Retrieved from storage - Role:", role, "User ID:", userId);

        if (role !== "physician") {
          setAccessDeniedMessage(
            "Access denied: Only physicians can add medication."
          );
          setAccessDeniedVisible(true);
        } else {
          if (!userId) {
            console.warn("No physician ID found in storage");
            // Try alternative keys if needed
            const altId =
              (await AsyncStorage.getItem("physicianId")) ||
              (await AsyncStorage.getItem("user_id")) ||
              "unknown-physician";
            setPhysicianId(altId);
            setFormData((prev) => ({ ...prev, physicianID: altId }));
          } else {
            setPhysicianId(userId);
            setFormData((prev) => ({ ...prev, physicianID: userId }));
          }
        }

        setUserRole(role);
      } catch (error) {
        console.error("Error checking user role:", error);
        setAccessDeniedMessage("An error occurred while checking access.");
        setAccessDeniedVisible(true);
      } finally {
        setCheckingRole(false);
      }
    };

    checkAccess();
  }, [patient_number, router]);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await fetch(
          `${BASE_API}/api/patients/by-number/${patient_number}/`
        );
        const data = await response.json();
        if (response.ok) {
          setPatientName(`${data.first_name} ${data.last_name}`);
        } else {
          console.error("Failed to fetch patient:", data);
        }
      } catch (error) {
        console.error("Error fetching patient:", error);
      }
    };

    if (patient_number) {
      fetchPatientDetails();
    }
  }, [patient_number]);

  const toggleDay = (day) => {
    setSelectedDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

  const handleInputChange = (text) => {
    setQuery(text);
    setFormData({ ...formData, medicineName: text });

    if (text.length > 0) {
      const filtered = medications.filter((item) =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredMedications(filtered);
    } else {
      setFilteredMedications([]);
    }
  };

  const handleFrequencyChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      frequencyType: value,
    }));

    if (value !== "Other") {
      // Set time to 08:00 AM for presets
      setFormData({
        frequencyType: value,
        timeHour: "08",
        timeMinute: "00",
        timePeriod: "AM",
      });
    } 
    if (value in frequencyIntervals) {
      const { days, hours, minutes } = frequencyIntervals[value];
      setFormData((prev) => ({
        ...prev,
        frequencyDay: days.toString(),
        frequencyHour: hours.toString().padStart(2, "0"),
        frequencyMinute: minutes.toString().padStart(2, "0"),
      }));
    }
    else {
      // Clear time for Other (or keep previous, your choice)
      setFormData({
        frequencyType: value,
        timeHour: "",
        timeMinute: "",
        timePeriod: "",
        frequencyDay: "",
        frequencyHour: "",
        frequencyMinute: "",
      });
    }
  };

  const handleSelectMedication = (medName) => {
    setQuery(medName);
    setFormData({ ...formData, medicineName: medName });
    setFilteredMedications([]);
  };

  const months = Array.from({ length: 12 }, (_, i) => ({
    label: String(i + 1).padStart(2, "0"),
    value: String(i + 1).padStart(2, "0"),
  }));

  const days = Array.from({ length: 31 }, (_, i) => ({
    label: String(i + 1).padStart(2, "0"),
    value: String(i + 1).padStart(2, "0"),
  }));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => ({
    label: String(currentYear - i),
    value: String(currentYear - i),
  }));

  const pickerSelectStyles = {
    inputAndroid: styles.input,
    placeholder: {
      color: "#999",
    },
    iconContainer: {
      top: 10,
      right: 12,
    },
  };

  const handleRegister = async () => {
    if (userRole !== "physician") {
      setAccessDeniedMessage(
        "Access denied: Only physicians can add medication."
      );
      setAccessDeniedVisible(true);
      return;
    }

    const convertTo24Hour = (hour, minute, period) => {
      let hour24 = parseInt(hour);
      if (period === "PM" && hour24 !== 12) hour24 += 12;
      if (period === "AM" && hour24 === 12) hour24 = 0;
      return `${hour24.toString().padStart(2, "0")}:${minute.padStart(2, "0")}`;
    };

    try {
      const medicationTime = convertTo24Hour(
        formData.timeHour,
        formData.timeMinute,
        formData.timePeriod
      );

      const frequency = `${formData.frequencyHour.padStart(
        2,
        "0"
      )}:${formData.frequencyMinute.padStart(2, "0")}`;

      const requestData = {
        Medication_name: formData.medicineName,
        Medicationform: formData.Medication_form,
        Dosage: formData.dosage,
        Dosage_Unit: formData.dosageUnit,
        Medication_Time: medicationTime,
        Frequency: frequency,
        Days_of_Week: selectedDays,
        Medication_notes: formData.medicationNotes,
        patient_number: parseInt(patient_number),
        physicianID: formData.physicianID || "default_physician",
      };

      const response = await fetch(`${BASE_API}/api/medications/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();

      if (response.ok) {
        setAddSuccessMessage("Medication added successfully!");
        setAddSuccessVisible(true);
      } else {
        const errorMessage =
          responseData.detail ||
          (responseData.non_field_errors && responseData.non_field_errors[0]) ||
          Object.values(responseData)[0] ||
          "Please try again.";
        alert(`Failed to add medication: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error adding medication:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Sidebar onNavigate={(destination) => router.push(destination)} />
      <View
        style={[
          styles.contentContainer,
          { marginLeft: isSidebarExpanded ? 200 : 70 },
        ]}
      >
        <Text style={styles.screenTitle}>New Medication Schedule</Text>
        <View style={styles.formContainer}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>
                {patient_number
                  ? patientName
                    ? `FOR: ${patientName} | Patient ID - ${patient_number}`
                    : `FOR: Patient ID - ${patient_number}`
                  : "FOR: Patient ID - Loading..."}
              </Text>

              {/* Medication Name with Autocomplete */}
              <Text style={styles.label}>
                Medication Name <Text style={{ color: "#5879A5" }}>*</Text>{" "}
              </Text>
              <View style={styles.autocompleteContainer}>
                <Autocomplete
                  data={filteredMedications}
                  value={query}
                  onChangeText={handleInputChange}
                  flatListProps={{
                    keyExtractor: (_, idx) => idx.toString(),
                    renderItem: ({ item }) => (
                      <TouchableOpacity
                        style={styles.autocompleteItem}
                        onPress={() => handleSelectMedication(item)}
                      >
                        <Text style={styles.autocompleteText}>{item}</Text>
                      </TouchableOpacity>
                    ),
                  }}
                  containerStyle={styles.autocompleteWrapper}
                  inputContainerStyle={styles.autocompleteInput}
                />
              </View>

              <Text style={[styles.label]}>
                Medication form <Text style={{ color: "#5879A5" }}>*</Text>{" "}
              </Text>
              <View style={styles.PickerContainer}>
                <RNPickerSelect
                  Icon={() => (
                    <Icon name="arrow-drop-down" size={20} color="gray" />
                  )}
                  items={[
                    { label: "Tablet", value: "Tablet" },
                    { label: "Syrup", value: "Syrup" },
                    { label: "Injection", value: "Injection" },
                    { label: "Cream", value: "Cream" },
                    { label: "Ointment", value: "Ointment" },
                    { label: "Drops", value: "Drops" },
                    { label: "Inhaler", value: "Inhaler" },
                    { label: "Patch", value: "Patch" },
                    { label: "Other", value: "Other" },
                  ]}
                  value={formData.medicationForm}
                  onValueChange={(value) =>
                    setFormData({ ...formData, medicationForm: value })
                  }
                  placeholder={{
                    label: "Select Medication form...",
                    value: "",
                  }}
                  style={pickerSelectStyles}
                  useNativeAndroidPickerStyle={false}
                />
              </View>

              <Text style={[styles.label, { marginTop: 10 }]}>
                Medication Route
              </Text>
              <View>
                <RNPickerSelect
                  items={[
                    { label: "Oral", value: "Oral" },
                    { label: "Intramuscular", value: "Intramuscular" },
                    { label: "Intravenous", value: "Intravenous" },
                    { label: "Subcutaneous", value: "Subcutaneous" },
                    { label: "Topical", value: "Topical" },
                    { label: "Inhalation", value: "Inhalation" },
                    { label: "Sublingual", value: "Sublingual" },
                    { label: "Transdermal", value: "Transdermal" },
                    { label: "Rectal", value: "Rectal" },
                    { label: "Intranasal", value: "Intranasal" },
                    { label: "Ocular", value: "Ocular" },
                    { label: "Vaginal", value: "Vaginal" },
                    { label: "Other", value: "Other" },
                  ]}
                  value={formData.medicationRoute}
                  onValueChange={(value) =>
                    setFormData({ ...formData, medicationRoute: value })
                  }
                  placeholder={{
                    label: "Select Medication route...",
                    value: "",
                  }}
                  style={pickerSelectStyles}
                />
              </View>

              <Text style={styles.label}>
                Medication Strength <Text style={{ color: "#5879A5" }}>*</Text>{" "}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TextInput
                  style={{
                    marginRight: 10,
                    backgroundColor: "#F8F8F8",
                    marginBottom: 10,
                    flex: 1,
                    height: 36,
                  }}
                  value={formData.medicationStrength}
                  onChangeText={(text) =>
                    setFormData({ ...formData, medicationStrength: text })
                  }
                />
                <View style={styles.PickerContainer}>
                  <RNPickerSelect
                    Icon={() => (
                      <Icon name="arrow-drop-down" size={20} color="gray" />
                    )}
                    items={[
                      { label: "mL", value: "ml" },
                      { label: "mcg", value: "mcg" },
                      { label: "mg", value: "mg" },
                      { label: "%", value: "%" },
                      { label: "g", value: "g" },
                    ]}
                    value={formData.dosageUnit}
                    onValueChange={(value) =>
                      setFormData({ ...formData, dosageUnit: value })
                    }
                    placeholder={
                      formData.dosageUnit ? {} : { label: "Unit", value: "" }
                    }
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                  />
                </View>
              </View>

              <Text style={styles.label}>
                Medication Start Date{" "}
                <Text style={{ color: "#5879A5" }}>*</Text>{" "}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {/* Month */}
                <View style={styles.PickerContainer}>
                  <RNPickerSelect
                    Icon={() => (
                      <Icon name="arrow-drop-down" size={20} color="gray" />
                    )}
                    items={months}
                    value={formData.medicationMonth}
                    onValueChange={(value) =>
                      setFormData({ ...formData, medicationMonth: value })
                    }
                    placeholder={{ label: "MM", value: "" }}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                  />
                </View>
                {/* Day */}
                <View style={styles.PickerContainer}>
                  <RNPickerSelect
                    Icon={() => (
                      <Icon name="arrow-drop-down" size={20} color="gray" />
                    )}
                    items={days}
                    value={formData.medicationDay}
                    onValueChange={(value) =>
                      setFormData({ ...formData, medicationDay: value })
                    }
                    placeholder={{ label: "DD", value: "" }}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                  />
                </View>
                {/* Year */}
                <View style={styles.PickerContainer}>
                  <RNPickerSelect
                    Icon={() => (
                      <Icon name="arrow-drop-down" size={20} color="gray" />
                    )}
                    items={years}
                    value={formData.medicationYear}
                    onValueChange={(value) =>
                      setFormData({ ...formData, medicationYear: value })
                    }
                    placeholder={{ label: "YYYY", value: "" }}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                  />
                </View>
              </View>

              <Text style={styles.label}>Medication End Date</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {/* Month */}
                <View style={styles.PickerContainer}>
                  <RNPickerSelect
                    Icon={() => (
                      <Icon name="arrow-drop-down" size={20} color="gray" />
                    )}
                    items={months}
                    value={formData.medicationEndMonth}
                    onValueChange={(value) =>
                      setFormData({ ...formData, medicationEndMonth: value })
                    }
                    placeholder={{ label: "MM", value: "" }}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                  />
                </View>
                {/* Day */}
                <View style={styles.PickerContainer}>
                  <RNPickerSelect
                    Icon={() => (
                      <Icon name="arrow-drop-down" size={20} color="gray" />
                    )}
                    items={days}
                    value={formData.medicationEndDay}
                    onValueChange={(value) =>
                      setFormData({ ...formData, medicationEndDay: value })
                    }
                    placeholder={{ label: "DD", value: "" }}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                  />
                </View>
                {/* Year */}
                <View style={styles.PickerContainer}>
                  <RNPickerSelect
                    Icon={() => (
                      <Icon name="arrow-drop-down" size={20} color="gray" />
                    )}
                    items={years}
                    value={formData.medicationEndYear}
                    onValueChange={(value) =>
                      setFormData({ ...formData, medicationEndYear: value })
                    }
                    placeholder={{ label: "YYYY", value: "" }}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                  />
                </View>
              </View>

              <Text style={styles.label}>
                Time of Medication <Text style={{ color: "#5879A5" }}>*</Text>{" "}
              </Text>
              <View style={styles.dobContainer}>
                <View style={styles.PickerContainer}>
                  <RNPickerSelect
                  disabled={formData.frequencyType != "Other"}
                    Icon={() => (
                      <Icon name="arrow-drop-down" size={20} color="gray" />
                    )}
                    items={Array.from({ length: 12 }, (_, index) => ({
                      label: (index + 1).toString().padStart(2, "0"),
                      value: (index + 1).toString().padStart(2, "0"),
                    }))}
                    value={formData.timeHour}
                    onValueChange={(value) =>
                      setFormData({ ...formData, timeHour: value })
                    }
                    placeholder={{ label: "HH", value: "" }}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                  />
                </View>

                <View style={styles.PickerContainer}>
                  <RNPickerSelect
                  disabled={formData.frequencyType != "Other"}
                    Icon={() => (
                      <Icon name="arrow-drop-down" size={20} color="gray" />
                    )}
                    items={Array.from({ length: 60 }, (_, index) => ({
                      label: index.toString().padStart(2, "0"),
                      value: index.toString().padStart(2, "0"),
                    }))}
                    value={formData.timeMinute}
                    onValueChange={(value) =>
                      setFormData({ ...formData, timeMinute: value })
                    }
                    placeholder={{ label: "MM", value: "" }}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                  />
                </View>

                <View style={styles.PickerContainer}>
                  <RNPickerSelect
                  disabled={formData.frequencyType != "Other"}
                    Icon={() => (
                      <Icon name="arrow-drop-down" size={20} color="gray" />
                    )}
                    items={[
                      { label: "AM", value: "AM" },
                      { label: "PM", value: "PM" },
                    ]}
                    value={formData.timePeriod}
                    onValueChange={(value) =>
                      setFormData({ ...formData, timePeriod: value })
                    }
                    placeholder={{ label: "AM/PM", value: "" }}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                  />
                </View>
              </View>

              <Text style={styles.label}>
                Frequency <Text style={{ color: "#5879A5" }}>*</Text>{" "}
              </Text>
              <RNPickerSelect
        Icon={() => <Icon name="arrow-drop-down" size={20} color="gray" />}
        items={frequencyOptions}
        value={formData.frequencyType}
        onValueChange={handleFrequencyChange}
        placeholder={ formData.frequencyType ? {} :{ label: "Select frequency", value: "" }}
        style={pickerSelectStyles}
        useNativeAndroidPickerStyle={false}
      />
        <View style={{ marginTop: 20 }}>
          <Text style={{ marginTop: 20 }}>Set Frequency Interval</Text>
          <View style={styles.dobContainer}>
            <View style={styles.PickerContainer}>
              <RNPickerSelect
              disabled={formData.frequencyType != "Other"}
                Icon={() => <Icon name="arrow-drop-down" size={20} color="gray" />}
                items={[{ label: "0", value: "0" }, ...Array.from({ length: 8 }, (_, i) => ({
                  label: (i + 1).toString(),
                  value: (i + 1).toString(),
                }))]}
                value={formData.frequencyDay}
                onValueChange={(value) =>
                  setFormData({ ...formData, frequencyDay: value })
                }
                placeholder={{ label: "Days", value: "" }}
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
              />
            </View>

            <View style={styles.PickerContainer}>
              <RNPickerSelect
              disabled={formData.frequencyType != "Other"}
                Icon={() => <Icon name="arrow-drop-down" size={20} color="gray" />}
                items={[{ label: "0", value: "0" }, ...Array.from({ length: 24 }, (_, i) => ({
                  label: i.toString().padStart(2, "0"),
                  value: i.toString().padStart(2, "0"),
                }))]}
                value={formData.frequencyHour}
                onValueChange={(value) =>
                  setFormData({ ...formData, frequencyHour: value })
                }
                placeholder={{ label: "Hours", value: "" }}
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
              />
            </View>

            <View style={styles.PickerContainer}>
              <RNPickerSelect
              disabled={formData.frequencyType != "Other"}
                Icon={() => <Icon name="arrow-drop-down" size={20} color="gray" />}
                items={[{ label: "0", value: "0" }, ...Array.from({ length: 60 }, (_, i) => ({
                  label: i.toString().padStart(2, "0"),
                  value: i.toString().padStart(2, "0"),
                }))]}
                value={formData.frequencyMinute}
                onValueChange={(value) =>
                  setFormData({ ...formData, frequencyMinute: value })
                }
                placeholder={{ label: "Minutes", value: "" }}
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
              />
              </View>
              </View>
            </View>
            </View>
          </ScrollView>
          <View style={styles.divider} />

          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            <Text style={styles.label}>
              Medication Notes <Text style={{ color: "#5879A5" }}>*</Text>{" "}
            </Text>
            <TextInput
              style={styles.input}
              multiline
              numberOfLines={4}
              onChangeText={(text) =>
                setFormData({ ...formData, medicationNotes: text })
              }
              value={formData.medicationNotes}
            />
            <Text style={styles.label}>
              Physician ID <Text style={{ color: "#5879A5" }}>*</Text>{" "}
            </Text>
            <TextInput
              style={[styles.input]}
              value={formData.physicianID || "Loading..."}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={[styles.button, styles.leaveButton]}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleRegister}
            style={[styles.button, styles.stayButton]}
          >
            <Text style={styles.buttonText}>Add Medication</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Custom Access Denied Alert */}
      <CustomAlert
        visible={accessDeniedVisible}
        message={accessDeniedMessage}
        onClose={() => {
          setAccessDeniedVisible(false);
          router.replace("/viewpatient?patient_number=" + patient_number);
        }}
      />

      {/* Cancel Confirmation Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Cancel Medication Schedule</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to cancel scheduling this medication?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.stayButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Stay</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.leaveButton]}
                onPress={() => {
                  setModalVisible(false);
                  router.push(`/viewpatient?patient_number=${patient_number}`);
                }}
              >
                <Text style={styles.modalButtonText}>Leave</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Warning Modal for Incomplete Form */}
      <Modal visible={warningModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Incomplete Form</Text>
            <Text style={styles.modalMessage}>
              Some details are missing. Are you sure you want to proceed?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.stayButton]}
                onPress={() => {
                  setWarningModalVisible(false);
                  handleRegister(); // Proceed with registration despite missing fields
                }}
              >
                <Text style={styles.modalButtonText}>Proceed</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.leaveButton]}
                onPress={() => setWarningModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Stay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Medication Added Successfully Alert */}
      <CustomAlert
        visible={addSuccessVisible}
        message={addSuccessMessage}
        onClose={() => {
          setAddSuccessVisible(false);
          router.push(`/viewpatient?patient_number=${patient_number}`);
        }}
      />
    </View>
  );
}
