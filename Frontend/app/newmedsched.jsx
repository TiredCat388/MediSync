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
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import AppText from './components/AppText';

const BASE_API = Constants.expoConfig.extra.BASE_API;

const frequencyOptions = [
  { label: "OD (Once Daily)", value: "OD" },
  { label: "BID (Twice Daily)", value: "BID" },
  { label: "TID (Thrice Daily)", value: "TID" },
  { label: "QID (Four times Daily)", value: "QID" },
  { label: "Other", value: "Other" },
];

const months = [
  { label: "January", value: "01" },
  { label: "February", value: "02" },
  { label: "March", value: "03" },
  { label: "April", value: "04" },
  { label: "May", value: "05" },
  { label: "June", value: "06" },
  { label: "July", value: "07" },
  { label: "August", value: "08" },
  { label: "September", value: "09" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

export default function NewMedSched() {
  const router = useRouter();
  const { patient_number } = useLocalSearchParams();
  const [today, setToday] = useState(new Date());
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [warningModalVisible, setWarningModalVisible] = useState(false);
  const [accessDeniedVisible, setAccessDeniedVisible] = useState(false);
  const [accessDeniedMessage, setAccessDeniedMessage] = useState("");
  const [addSuccessVisible, setAddSuccessVisible] = useState(false); // State for success alert
  const [addSuccessMessage, setAddSuccessMessage] = useState(""); // State for success message
  const [patientName, setPatientName] = useState(null);

  const hour = today.getHours() > 12 ? today.getHours() - 12 : today.getHours();

  const [formData, setFormData] = useState({
    medicineName: "",
    medicationForm: "",
    medicationStrength: "",
    medicationUnit: "",
    medicationRoute: "",
    timeHour: String(hour).padStart(2, "0"),
    timeMinute: String(today.getMinutes()).padStart(2, "0"),
    timePeriod: today.getHours() >= 12 ? "PM" : "AM",
    medicationNotes: "",
    physicianID: "",
    frequencyDay: "",
    frequencyType: "",
    frequencyHour: "",
    frequencyMinute: "",
    medicationDay: String(today.getDate()).padStart(2, "0"), // "25"
    medicationMonth: String(today.getMonth() + 1).padStart(2, "0"), // "05"
    medicationYear: String(today.getFullYear()), // "2025"
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
  const [physicianId, setPhysicianId] = useState("");

  // Update your checkAccess useEffect
  useEffect(() => {
    setToday(new Date());
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
    const updates = {
      frequencyType: value,
    };

    if (value !== "Other") {
      updates.frequencyDay = "";
      updates.frequencyHour = "";
      updates.frequencyMinute = "";
    }

    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
  };

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

      const frequencyDay = formData.frequencyDay || "0";
      const frequencyHour =
        formData.frequencyHour != null
          ? formData.frequencyHour.toString().padStart(2, "0")
          : "00";
      const frequencyMinute =
        formData.frequencyMinute != null
          ? formData.frequencyMinute.toString().padStart(2, "0")
          : "00";

      const frequency = `${frequencyDay} ${frequencyHour}:${frequencyMinute}:00`;

      const requestData = {
        Medication_name: formData.medicineName,
        Medication_form: formData.medicationForm,
        Medication_Route: formData.medicationRoute,
        Medication_strength: formData.medicationStrength,
        Medication_unit: formData.medicationUnit,
        Medication_Time: medicationTime,
        Medication_start_date: `${formData.medicationYear}-${formData.medicationMonth}-${formData.medicationDay}`,
        Medication_end_date:
          formData.medicationEndYear &&
          formData.medicationEndMonth &&
          formData.medicationEndDay
            ? `${formData.medicationEndYear}-${formData.medicationEndMonth}-${formData.medicationEndDay}`
            : null,
        Frequency: frequency,
        Frequency_type: formData.frequencyType,
        Medication_notes: formData.medicationNotes,
        patient_number: parseInt(patient_number),
        physicianID: formData.physicianID || "default_physician",
        // Add these fields for "Other" frequency
        ...(formData.frequencyType === "Other" && {
          day: parseInt(formData.frequencyDay || "0", 10),
          hour: parseInt(formData.frequencyHour || "0", 10),
          minutes: parseInt(formData.frequencyMinute || "0", 10),
        }),
      };

      console.log(
        "🧾 Request data being sent to backend:",
        JSON.stringify(requestData, null, 2)
      );

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
    <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>
      <Sidebar onNavigate={(destination) => router.push(destination)} />
      <View
        style={[
          styles.contentContainer,
          { marginLeft: isSidebarExpanded ? 200 : 70 },
        ]}
      >
        <AppText style={styles.screenTitle}>New Medication Schedule</AppText>
        <View style={styles.formContainer}>
          <ScrollView
            style={{ flex: 1 }}>
            <View style={styles.column}>
              <AppText style={styles.sectionTitle}>
                {patient_number
                  ? patientName
                    ? `FOR: ${patientName} | Patient ID - ${patient_number}`
                    : `FOR: Patient ID - ${patient_number}`
                  : "FOR: Patient ID - Loading..."}
              </AppText>

              {/* Medication Name with Autocomplete */}
              <AppText style={styles.label}>
                Medication Name <AppText style={{ color: "#5879A5" }}>*</AppText>{" "}
              </AppText>
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
                        <AppText style={styles.autocompleteText}>{item}</AppText>
                      </TouchableOpacity>
                    ),
                  }}
                  containerStyle={styles.autocompleteWrapper}
                  inputContainerStyle={styles.autocompleteInput}
                />
              </View>

              <AppText style={[styles.label]}>
                Medication form <AppText style={{ color: "#5879A5" }}>*</AppText>{" "}
              </AppText>
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

              <AppText style={[styles.label]}>
                Medication Route <AppText style={{ color: "#5879A5" }}>*</AppText>{" "}
              </AppText>
              <View style={styles.PickerContainer}>
                <RNPickerSelect
                  Icon={() => (
                    <Icon name="arrow-drop-down" size={20} color="gray" />
                  )}
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
                  useNativeAndroidPickerStyle={false}
                />
              </View>

              <AppText style={styles.label}>
                Medication Strength <AppText style={{ color: "#5879A5" }}>*</AppText>{" "}
              </AppText>
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
                    borderRadius: 8,
                    borderWidth: 1,
                    flex: 1,
                    height: 36,
                    padding: 8,
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
                      setFormData({ ...formData, medicationUnit: value })
                    }
                    placeholder={
                      formData.medicationUnit
                        ? {}
                        : { label: "Unit", value: "" }
                    }
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                  />
                </View>
              </View>

              <AppText style={styles.label}>
                Medication Start Date{" "}
                <AppText style={{ color: "#5879A5" }}>*</AppText>{" "}
              </AppText>
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

              <AppText style={styles.label}>Medication End Date</AppText>
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
 
              <AppText style={styles.label}>
                Time of Medication <AppText style={{ color: "#5879A5" }}>*</AppText>{" "}
              </AppText>
              <View style={styles.dobContainer}>
                <View style={styles.PickerContainer}>
                  <RNPickerSelect
                    Icon={() => (
                      <Icon name="arrow-drop-down" size={20} color="gray" />
                    )}
                    items={Array.from({ length: 13 }, (_, index) => ({
                      label: index.toString().padStart(2, "0"),
                      value: index.toString().padStart(2, "0"),
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

              <AppText style={styles.label}>
                Frequency <AppText style={{ color: "#5879A5" }}>*</AppText>{" "}
              </AppText>
              <RNPickerSelect
                Icon={() => (
                  <Icon name="arrow-drop-down" size={20} color="gray" />
                )}
                items={frequencyOptions}
                value={formData.frequencyType}
                onValueChange={handleFrequencyChange}
                placeholder={
                  formData.frequencyType
                    ? {}
                    : { label: "Select frequency", value: "" }
                }
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
              />

             {formData.frequencyType === "Other" && (
  <View>
    <AppText style={styles.label}>
      Set Frequency Interval
      <AppText style={{ color: "#5879A5" }}>*</AppText>{" "}
    </AppText>
    <View style={styles.dobContainer}>
      <View style={styles.PickerContainer}>
        <RNPickerSelect
          disabled={
            formData.frequencyType !== "Other" &&
            formData.frequencyType !== ""
          }
          Icon={() => (
            <Icon name="arrow-drop-down" size={20} color="gray" />
          )}
          items={[
            ...Array.from({ length: 31 }, (_, i) => ({
              label: i.toString().padStart(2, "0"),
              value: i.toString(),
            })),
          ]}
          value={formData.frequencyDay}
          onValueChange={(value) =>
            setFormData({ ...formData, frequencyDay: value })
          }
          placeholder={{ label: "Days", value: "" }}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
        />
      </View>
    </View>
  </View>
)}
            
            </View>
          </ScrollView>
          <View style={styles.divider} />

          <View style={styles.column}>
            <AppText style={styles.sectionTitle}>Additional Information</AppText>
            <AppText style={styles.label}>
              Medication Notes <AppText style={{ color: "#5879A5" }}>*</AppText>{" "}
            </AppText>
            <TextInput
              style={styles.input}
              multiline
              numberOfLines={4}
              onChangeText={(text) =>
                setFormData({ ...formData, medicationNotes: text })
              }
              value={formData.medicationNotes}
            />
            <AppText style={styles.label}>
              Physician ID <AppText style={{ color: "#5879A5" }}>*</AppText>{" "}
            </AppText>
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
            <AppText style={styles.buttonText}>Cancel</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleRegister}
            style={[styles.button, styles.stayButton]}
          >
            <AppText style={styles.buttonText}>Add Medication</AppText>
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
            <AppText style={styles.modalTitle}>Cancel Medication Schedule</AppText>
            <AppText style={styles.modalMessage}>
              Are you sure you want to cancel scheduling this medication?
            </AppText>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.stayButton]}
                onPress={() => setModalVisible(false)}
              >
                <AppText style={styles.modalButtonText}>Stay</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.leaveButton]}
                onPress={() => {
                  setModalVisible(false);
                  router.push(`/viewpatient?patient_number=${patient_number}`);
                }}
              >
                <AppText style={styles.modalButtonText}>Leave</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Warning Modal for Incomplete Form */}
      <Modal visible={warningModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <AppText style={styles.modalTitle}>Incomplete Form</AppText>
            <AppText style={styles.modalMessage}>
              Some details are missing. Are you sure you want to proceed?
            </AppText>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.stayButton]}
                onPress={() => {
                  setWarningModalVisible(false);
                  handleRegister(); // Proceed with registration despite missing fields
                }}
              >
                <AppText style={styles.modalButtonText}>Proceed</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.leaveButton]}
                onPress={() => setWarningModalVisible(false)}
              >
                <AppText style={styles.modalButtonText}>Stay</AppText>
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
    </SafeAreaView>
  );
}
