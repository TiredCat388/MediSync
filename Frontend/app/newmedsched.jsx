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
import styles from "./newmedschedstyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomAlert from "./components/alert";

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
    timePeriod: "",
    medicationNotes: "",
    physicianID: "",
    frequencyHour: "",
    frequencyMinute: "",
    frequencyPeriod: "",
    medicationMonth: "",
    medicationDay: "",
    medicationYear: "",
    medicationEndMonth: "",
    medicationEndDay: "",
    medicationEndYear: "",
  });

  const [medications, setMedications] = useState([]);
  const [filteredMedications, setFilteredMedications] = useState([]);
  const [query, setQuery] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const role = await AsyncStorage.getItem("userRole");
        if (role !== "physician") {
          setAccessDeniedMessage(
            "Access denied: Only physicians can add medication."
          );
          setAccessDeniedVisible(true);
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
          `${config('BASE_API')}/api/patients/by-number/${patient_number}/`
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
    inputIOS: styles.input,
    inputWeb: styles.input,
    placeholder: {
      color: "#999",
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

    const requiredFields = [
      "medicineName",
      "dosage",
      "dosageUnit",
      "timeHour",
      "timeMinute",
      "timePeriod",
      "medicationNotes",
      "frequencyHour",
      "frequencyMinute",
    ];
    const hasEmptyFields = requiredFields.some(
      (field) => !formData[field] || formData[field].trim() === ""
    );

    if (hasEmptyFields) {
      setWarningModalVisible(true);
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

      const response = await fetch("${config('BASE_API')}/api/medications/", {
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
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>
              {patient_number
                ? patientName
                  ? `FOR: ${patientName} | Patient ID - ${patient_number}`
                  : `FOR: Patient ID - ${patient_number}`
                : "FOR: Patient ID - Loading..."}
            </Text>

            {/* Medication Name with Autocomplete */}
            <Text style={styles.label}>Medication Name</Text>
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

            <Text style={[styles.label, { marginTop: 10 }]}>
              Medication form
            </Text>
              <View style={{}}>
                <RNPickerSelect
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
                  placeholder={{ label: "Select Medication form...", value: "" }}
                  style={pickerSelectStyles}
                />
            </View>

            <Text style={styles.label}>Medication Strength</Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ flex: 1, marginRight: 10 }}>
                <RNPickerSelect
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
                  placeholder={{ label: "Select an item...", value: "" }}
                  style={pickerSelectStyles}
                />
              </View>

              <View style={{ flex: 1 }}>
                <RNPickerSelect
                  items={[
                    { label: "ml", value: "ml" },
                    { label: "tablets", value: "tablets" },
                    { label: "pills", value: "pills" },
                    { label: "mg", value: "mg" },
                    { label: "drops", value: "drops" },
                  ]}
                  value={formData.dosageUnit}
                  onValueChange={(value) =>
                    setFormData({ ...formData, dosageUnit: value })
                  }
                  placeholder={{ label: "Unit", value: "" }}
                  style={pickerSelectStyles}
                />
              </View>
            </View>
            
            <Text style={styles.label}>Medication Start Date</Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              {/* Month */}
              <View style={{ flex: 1, marginRight: 10 }}>
                <RNPickerSelect
                  items={months}
                  value={formData.medicationMonth}
                  onValueChange={(value) =>
                    setFormData({ ...formData, medicationMonth: value })
                  }
                  placeholder={{ label: "MM", value: "" }}
                  style={pickerSelectStyles}
                />
              </View>
              {/* Day */}
              <View style={{ flex: 1, marginRight: 10 }}>
                <RNPickerSelect
                  items={days}
                  value={formData.medicationDay}
                  onValueChange={(value) =>
                    setFormData({ ...formData, medicationDay: value })
                  }
                  placeholder={{ label: "DD", value: "" }}
                  style={pickerSelectStyles}
                />
              </View>
              {/* Year */}
              <View style={{ flex: 1 }}>
                <RNPickerSelect
                  items={years}
                  value={formData.medicationYear}
                  onValueChange={(value) =>
                    setFormData({ ...formData, medicationYear: value })
                  }
                  placeholder={{ label: "YYYY", value: "" }}
                  style={pickerSelectStyles}
                />
              </View>
            </View>

            <Text style={styles.label}>Time of Medication</Text>
            <View style={styles.dobContainer}>
              <View style={styles.timePickerContainer}>
                <RNPickerSelect
                  items={Array.from({ length: 12 }, (_, index) => ({
                    label: (index + 1).toString().padStart(2, "0"),
                    value: (index + 1).toString().padStart(2, "0"),
                  }))}
                  value={formData.timeHour}
                  onValueChange={(value) =>
                    setFormData({ ...formData, timeHour: value })
                  }
                  placeholder={{ label: "HH", value: "" }}
                  style={{
                    inputAndroid: styles.timePicker,
                    inputIOS: styles.timePicker,
                    inputWeb: styles.timePickerWeb,
                  }}
                />
              </View>
              <View style={{ width: 10 }} /> {/* Spacer */}
              <View style={styles.timePickerContainer}>
                <RNPickerSelect
                  items={Array.from({ length: 60 }, (_, index) => ({
                    label: index.toString().padStart(2, "0"),
                    value: index.toString().padStart(2, "0"),
                  }))}
                  value={formData.timeMinute}
                  onValueChange={(value) =>
                    setFormData({ ...formData, timeMinute: value })
                  }
                  placeholder={{ label: "MM", value: "" }}
                  style={{
                    inputAndroid: styles.timePicker,
                    inputIOS: styles.timePicker,
                    inputWeb: styles.timePickerWeb,
                  }}
                />
              </View>
              <View style={{ width: 10 }} /> {/* Spacer */}
              <View style={styles.timePickerContainer}>
                <RNPickerSelect
                  items={[
                    { label: "AM", value: "AM" },
                    { label: "PM", value: "PM" },
                  ]}
                  value={formData.timePeriod}
                  onValueChange={(value) =>
                    setFormData({ ...formData, timePeriod: value })
                  }
                  placeholder={{ label: "AM/PM", value: "" }}
                  style={{
                    inputAndroid: styles.timePicker,
                    inputIOS: styles.timePicker,
                    inputWeb: styles.timePickerWeb,
                  }}
                />
              </View>
            </View>

            <Text style={styles.label}>Frequency</Text>
            <View style={styles.dobContainer}>
              <View style={styles.frequencyPickerContainer}>
                <RNPickerSelect
                  items={Array.from({ length: 24 }, (_, index) => ({
                    label: index.toString().padStart(2, "0"),
                    value: index.toString().padStart(2, "0"),
                  }))}
                  value={formData.frequencyHour}
                  onValueChange={(value) =>
                    setFormData({ ...formData, frequencyHour: value })
                  }
                  placeholder={{ label: "HH", value: "" }}
                  style={{
                    inputAndroid: styles.frequencyPicker,
                    inputIOS: styles.frequencyPicker,
                    inputWeb: styles.frequencyPickerWeb,
                  }}
                />
              </View>
              <View style={{ width: 10 }} /> {/* Spacer */}
              <View style={styles.frequencyPickerContainer}>
                <RNPickerSelect
                  items={Array.from({ length: 12 }, (_, index) => ({
                    label: (index * 5).toString().padStart(2, "0"),
                    value: (index * 5).toString().padStart(2, "0"),
                  }))}
                  value={formData.frequencyMinute}
                  onValueChange={(value) =>
                    setFormData({ ...formData, frequencyMinute: value })
                  }
                  placeholder={{ label: "MM", value: "" }}
                  style={{
                    inputAndroid: styles.frequencyPicker,
                    inputIOS: styles.frequencyPicker,
                    inputWeb: styles.frequencyPickerWeb,
                  }}
                />
              </View>
            </View>

            <Text style={styles.label}>Days of the Week</Text>
            <View style={styles.daysContainer}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    selectedDays.includes(day) && styles.dayButtonSelected,
                  ]}
                  onPress={() => toggleDay(day)}
                >
                  <Text
                    style={[
                      styles.dayButtonText,
                      selectedDays.includes(day) &&
                        styles.dayButtonTextSelected,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            <Text style={styles.label}>Medication Notes</Text>
            <TextInput
              style={styles.input}
              multiline
              numberOfLines={4}
              onChangeText={(text) =>
                setFormData({ ...formData, medicationNotes: text })
              }
              value={formData.medicationNotes}
            />
            <Text style={styles.label}>Physician ID</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) =>
                setFormData({ ...formData, physicianID: text })
              }
              value={formData.physicianID}
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
