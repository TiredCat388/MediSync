import { useEffect, useState } from "react";
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
import styles from "./registerstyle";

export default function NewMedSched() {
  const router = useRouter();
  const { patient_number } = useLocalSearchParams(); // Extract patient_number from the URL
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [warningModalVisible, setWarningModalVisible] = useState(false);

  const [formData, setFormData] = useState({
    medicineName: '',
    dosage: '',
    dosageUnit: '',
    timeHour: '',
    timeMinute: '',
    timePeriod: '',
    medicationNotes: '',
    physicianID: '',
    frequencyHour: '',
    frequencyMinute: '',
  });

  const [medications, setMedications] = useState([]); // List from DB
  const [filteredMedications, setFilteredMedications] = useState([]); // Filtered list
  const [query, setQuery] = useState("");


  // Handle input change & filter meds
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

  // Handle medication selection
  const handleSelectMedication = (medName) => {
    setQuery(medName);
    setFormData({ ...formData, medicineName: medName });
    setFilteredMedications([]);
  };

  const handleRegister = async () => {
    // Only check required fields
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

    // Convert 12-hour time to 24-hour format
    const convertTo24Hour = (hour, minute, period) => {
      let hour24 = parseInt(hour);
      if (period === "PM" && hour24 !== 12) {
        hour24 += 12;
      } else if (period === "AM" && hour24 === 12) {
        hour24 = 0;
      }
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
        Dosage: formData.dosage,
        Dosage_Unit: formData.dosageUnit,
        Medication_Time: medicationTime,
        Frequency: frequency,
        Medication_notes: formData.medicationNotes,
        patient_number: parseInt(patient_number), // Convert to integer
      };

      console.log("Sending data:", requestData);

      const response = await fetch("http://127.0.0.1:8000/api/medications/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      console.log("Response status:", response.status);
      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (response.ok) {
        alert("Medication added successfully!");
        router.push(`/viewpatient?patient_number=${patient_number}`);
      } else {
        console.error("Error adding medication:", responseData);
        // Display more detailed error message
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
                ? `FOR: Patient ID - ${patient_number}`
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

            <Text style={[styles.label, { marginTop: 50 }]}>Dosage</Text>
            <View style={styles.dobContainer}>
              <TextInput
                style={[styles.dobInput, { width: 60 }]}
                keyboardType="numeric"
                onChangeText={(text) =>
                  setFormData({ ...formData, dosage: text })
                }
              />
              <View style={{ width: 70 }}>
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
                  style={{
                    inputAndroid: styles.dobSelect,
                    inputIOS: styles.dobSelect,
                    inputWeb: styles.dobSelectWeb,
                  }}
                />
              </View>
            </View>

            <Text style={styles.label}>Time of Medication</Text>
            <View style={styles.dobContainer}>
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
                  inputAndroid: styles.dobSelect,
                  inputIOS: styles.dobSelect,
                  inputWeb: styles.dobSelectWeb,
                }}
              />

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
                  inputAndroid: styles.dobSelect,
                  inputIOS: styles.dobSelect,
                  inputWeb: styles.dobSelectWeb,
                }}
              />

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
                  inputAndroid: styles.dobSelect,
                  inputIOS: styles.dobSelect,
                  inputWeb: styles.dobSelectWeb,
                }}
              />
            </View>

            <Text style={styles.label}>Frequency</Text>
            <View style={styles.dobContainer}>
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
                  inputAndroid: styles.dobSelect,
                  inputIOS: styles.dobSelect,
                  inputWeb: styles.dobSelectWeb,
                }}
              />

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
                  inputAndroid: styles.dobSelect,
                  inputIOS: styles.dobSelect,
                  inputWeb: styles.dobSelectWeb,
                }}
              />
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
            />
            <Text style={styles.label}>Physician ID</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) =>
                setFormData({ ...formData, physicianID: text })
              }
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
                  router.back();
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
                  router.back();
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
    </View>
  );
}
