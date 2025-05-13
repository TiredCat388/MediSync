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
import styles from "./updatemedstyle";
import AsyncStorage from "@react-native-async-storage/async-storage"; // or your auth method
import CustomAlert from "./components/alert"; // Make sure the path is correct


export default function NewMedSched() {
  const router = useRouter();
  const { schedule_id, patient_number } = useLocalSearchParams();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [warningModalVisible, setWarningModalVisible] = useState(false);
  const [patientName, setPatientName] = useState(null);
  const [checkingRole, setCheckingRole] = useState(true);
  const [accessDeniedVisible, setAccessDeniedVisible] = useState(false);
  const [accessDeniedMessage, setAccessDeniedMessage] = useState("");
  const [addSuccessVisible, setAddSuccessVisible] = useState(false); // State for success alert
  const [addSuccessMessage, setAddSuccessMessage] = useState(""); // State for success message
  

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const role = await AsyncStorage.getItem("userRole");
        if (role !== "physician") {
          setAccessDeniedMessage(
            "Access denied: Only physicians can update medication."
          );
          setAccessDeniedVisible(true);
        }
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
    if (patient_number) {
      const fetchPatientName = async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/api/patients/${patient_number}/`
          );
          if (response.ok) {
            const data = await response.json();
            setPatientName(`${data.first_name} ${data.last_name}`);
          } else {
            console.error("Failed to fetch patient name");
          }
        } catch (error) {
          console.error("Error fetching patient name:", error);
        }
      };

      fetchPatientName();
    }
  }, [patient_number]);


    console.log("Schedule ID:", schedule_id);
    console.log("Patient Number:", patient_number);  

  const [formData, setFormData] = useState({
    medicineName: "",
    dosage: "",
    dosageUnit: "",
    timeHour: "",
    timeMinute: "",
    timePeriod: "",
    medicationNotes: "",
    physicianID: "",
    frequencyHour: "",
    frequencyMinute: "",
  });

  const [medications, setMedications] = useState([]); // List from DB
  const [filteredMedications, setFilteredMedications] = useState([]); // Filtered list
  const [query, setQuery] = useState("");


  useEffect(() => {
    if (schedule_id && patient_number) {
      const fetchMedicationDetails = async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/api/medications/${patient_number}/${schedule_id}/`
          );
          console.log("Fetch Response:", response);
          if (response.ok) {
            const data = await response.json();
            console.log("Fetched Data:", data);
            setFormData({
              medicineName: data.Medication_name,
              dosage: data.Dosage,
              dosageUnit: data.Dosage_Unit,
              timeHour: data.Medication_Time.split(":")[0],
              timeMinute: data.Medication_Time.split(":")[1],
              timePeriod:
                parseInt(data.Medication_Time.split(":")[0]) >= 12
                  ? "PM"
                  : "AM",
              medicationNotes: data.Medication_notes,
              physicianID: data.physicianID,
              frequencyHour: data.Frequency.split(":")[0],
              frequencyMinute: data.Frequency.split(":")[1],
            });
          } else {
            console.error("Failed to fetch medication details");
          }
        } catch (error) {
          console.error("Error fetching medication details:", error);
        }
      };

      fetchMedicationDetails();
    }
  }, [schedule_id, patient_number]);

  

  const handleInputChange = (text) => {
    setQuery(text);
    setFormData({ ...formData, medicineName: text });

    if (text.length > 0) {
      const filtered = medications.filter(
        (item) =>
          item.patient_number === patient_number && // Ensure it matches the patient
          item.Medication_name.toLowerCase().includes(text.toLowerCase())
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
    console.log("Form Data Before Submit:", formData);

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
        formData.timePeriod,
      );

      const frequency = `${formData.frequencyHour.padStart(2,"0")}:${formData.frequencyMinute.padStart(2, "0")}`;

      const requestData = {
        Medication_name: formData.medicineName,
        Dosage: formData.dosage,
        Dosage_Unit: formData.dosageUnit,
        Medication_Time: medicationTime,
        Frequency: frequency,
        Medication_notes: formData.medicationNotes,
        physicianID: formData.physicianID,
      };

      const url = schedule_id
        ? `http://127.0.0.1:8000/api/medications/${patient_number}/${schedule_id}/`
        : `http://127.0.0.1:8000/api/medications/${patient_number}/`;
      const method = schedule_id ? "PUT" : "POST";

      console.log("Request URL:", url);
      console.log("Request Method:", method);
      console.log("Request Data:", requestData);

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();
      console.log("Response Data:", responseData);

      if (response.ok) {
        setAddSuccessMessage("Medication updated successfully!");
        setAddSuccessVisible(true);
      } else {
        console.error("Error:", responseData);
        alert(
          `Failed to save medication: ${responseData.error || "Unknown error"}`
        );
      }
    } catch (error) {   
      console.error("Full Error:", JSON.stringify(error, null, 2));
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
        <Text style={styles.screenTitle}>Update Medication Schedule</Text>
        <View style={styles.formContainer}>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>
              {schedule_id && patientName
                ? `FOR: ${patientName} | Schedule ID - ${schedule_id}`
                : "Loading schedule and patient info..."}
            </Text>

            {/* Medication Name with Autocomplete */}
            <Text style={styles.label}>Medication Name</Text>
            <View style={styles.autocompleteContainer}>
              <Autocomplete
                data={filteredMedications}
                value={formData.medicineName} // Pre-fill medication name
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
                value={formData.dosage} // Pre-fill dosage
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
                  value={formData.dosageUnit} // Pre-fill dosage unit
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
              value={formData.medicationNotes} // Pre-fill medication notes
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
            onPress={() => router.back()}
            style={[styles.button, styles.leaveButton]}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleRegister}
            style={[styles.button, styles.stayButton]}
          >
            <Text style={styles.buttonText}>Update Medication</Text>
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
                <Text style={styles.modalButtonText}>Update</Text>
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