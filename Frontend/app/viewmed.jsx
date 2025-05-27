import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Sidebar from "./components/sidebar";
import styles from "./stylesheets/updatemedstyle";
import Constants from "expo-constants";
import { ScrollView } from "react-native";

const BASE_API = Constants.expoConfig.extra.BASE_API;

const frequencyOptions = [
  { label: "OD (Once Daily)", value: "OD" },
  { label: "BID (Twice Daily)", value: "BID" },
  { label: "TID (Thrice Daily)", value: "TID" },
  { label: "QID (Four times Daily)", value: "QID" },
  { label: "Other", value: "Other" },
];

export default function ViewMedSched() {
  const router = useRouter();
  const { schedule_id, patient_number } = useLocalSearchParams();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [patientName, setPatientName] = useState(null);
  const [formData, setFormData] = useState({
    medicineName: "",
    medicationForm: "",
    medicationStrength: "",
    medicationUnit: "",
    medicationRoute: "",
    timeHour: "",
    timeMinute: "",
    timePeriod: "AM",
    medicationNotes: "",
    physicianID: "",
    frequencyDay: "0",
    frequencyType: "",
    frequencyHour: "0",
    frequencyMinute: "0",
    medicationMonth: "",
    medicationDay: "",
    medicationYear: "",
    medicationEndMonth: "",
    medicationEndDay: "",
    medicationEndYear: "",
  });

  useEffect(() => {
    if (patient_number) {
      const fetchPatientName = async () => {
        try {
          const response = await fetch(
            `${BASE_API}/api/patients/${patient_number}/`
          );
          if (response.ok) {
            const data = await response.json();
            setPatientName(`${data.first_name} ${data.last_name}`);
          }
        } catch (error) {
          // Handle error
        }
      };
      fetchPatientName();
    }
  }, [patient_number]);

  useEffect(() => {
    if (schedule_id && patient_number) {
      const fetchMedicationDetails = async () => {
        try {
          const response = await fetch(
            `${BASE_API}/api/medications/${patient_number}/${schedule_id}/`
          );
          console.log("Fetched medication data:", response);
          if (response.ok) {
            const data = await response.json();
            console.log("Fetched medication data:", data);
            const [timeHour = "00", timeMinute = "00"] =
              data.Medication_Time?.split(":") || ["00", "00"];
            let timePeriod = "AM";
            const hourNum = parseInt(timeHour);
            if (hourNum >= 12) {
              timePeriod = "PM";
            }
            const [frequencyHour = "00", frequencyMinute = "00"] =
              data.Frequency?.split(":") || ["00", "00"];
            setFormData({
              medicineName: data.Medication_name,
              medicationForm: data.Medication_form,
              medicationStrength: data.Medication_strength,
              medicationUnit: data.Medication_unit,
              medicationRoute: data.Medication_route,
              timeHour:
                hourNum > 12
                  ? (hourNum - 12).toString().padStart(2, "0")
                  : hourNum.toString().padStart(2, "0"),
              timeMinute: timeMinute,
              timePeriod: timePeriod,
              medicationNotes: data.Medication_notes,
              physicianID: data.physicianID,
              frequencyDay: "0",
              frequencyType: data.Frequency_type || "",
              frequencyHour: frequencyHour,
              frequencyMinute: frequencyMinute,
              medicationMonth: data.Medication_start_date.split("-")[1],
              medicationDay: data.Medication_start_date.split("-")[2],
              medicationYear: data.Medication_start_date.split("-")[0],
              medicationEndMonth: data.Medication_end_date?.split("-")[1] || "",
              medicationEndDay: data.Medication_end_date?.split("-")[2] || "",
              medicationEndYear: data.Medication_end_date?.split("-")[0] || "",
            });
          }
        } catch (error) {
          // Handle error
        }
      };
      fetchMedicationDetails();
    }
  }, [schedule_id, patient_number]);

  const pickerSelectStyles = {
    inputAndroid: styles.input,
    placeholder: {
      color: "#999",
    },
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

  const handleBack = () => {
    router.push("/calendar");
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
        <Text style={styles.screenTitle}>View Medication Schedule</Text>
        <View style={styles.formContainer}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>
                {schedule_id && patientName
                  ? `FOR: ${patientName} | Schedule ID - ${schedule_id}`
                  : "Loading schedule and patient info..."}
              </Text>

              <Text style={styles.label}>Medication Name</Text>
              <Text style={styles.input}>{formData.medicineName}</Text>

              <Text style={styles.label}>Medication Form</Text>
              <Text style={styles.input}>{formData.medicationForm}</Text>

              <Text style={styles.label}>Medication Route</Text>
              <Text style={styles.input}>{formData.medicationRoute}</Text>

              <Text style={styles.label}>Medication Strength</Text>
              <Text style={styles.input}>
                {formData.medicationStrength} {formData.medicationUnit}
              </Text>

              <Text style={styles.label}>Medication Start Date</Text>
              <Text style={styles.input}>
                {formData.medicationMonth}/
                {formData.medicationDay}/
                {formData.medicationYear}
              </Text>

              <Text style={styles.label}>Medication End Date</Text>
              <Text style={styles.input}>
                {formData.medicationEndMonth &&
                formData.medicationEndDay &&
                formData.medicationEndYear
                  ? `${formData.medicationEndMonth}/${formData.medicationEndDay}/${formData.medicationEndYear}`
                  : "N/A"}
              </Text>

              <Text style={styles.label}>Time of Medication</Text>
              <Text style={styles.input}>
                {formData.timeHour}:{formData.timeMinute} {formData.timePeriod}
              </Text>

              <Text style={styles.label}>Frequency</Text>
              <Text style={styles.input}>{formData.frequencyType}</Text>

              {formData.frequencyType === "Other" && (
                <Text style={styles.input}>
                  Every {formData.frequencyDay} days, {formData.frequencyHour}{" "}
                  hours, {formData.frequencyMinute} minutes
                </Text>
              )}

              <Text style={styles.label}>Medication Notes</Text>
              <Text style={styles.input}>{formData.medicationNotes}</Text>

              <Text style={styles.label}>Physician ID</Text>
              <Text style={styles.input}>{formData.physicianID}</Text>
            </View>
          </ScrollView>
          <View style={styles.divider} />

          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            <Text style={styles.label}>Medication Notes</Text>
            <TextInput
              style={styles.input}
              multiline
              numberOfLines={4}
              value={formData.medicationNotes}
              editable={false}
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
            onPress={handleBack}
            style={[styles.button, styles.stayButton]}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
