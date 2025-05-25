import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Sidebar from "./components/sidebar";
import RNPickerSelect from "react-native-picker-select";
import Autocomplete from "react-native-autocomplete-input";
import styles from "./stylesheets/updatemedstyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomAlert from "./components/alert";
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

const frequencyIntervals = {
  OD: { days: 1, hours: 0, minutes: 0 },
  BID: { days: 0, hours: 12, minutes: 0 }, // Changed from 10 to 12 for BID (every 12 hours)
  TID: { days: 0, hours: 8, minutes: 0 }, // Changed from 5 to 8 for TID (every 8 hours)
  QID: { days: 0, hours: 6, minutes: 0 }, // Changed from 4 to 6 for QID (every 6 hours)
};

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
  const [addSuccessVisible, setAddSuccessVisible] = useState(false);
  const [addSuccessMessage, setAddSuccessMessage] = useState("");
  const [medications, setMedications] = useState([]);
  const [filteredMedications, setFilteredMedications] = useState([]);
  const [query, setQuery] = useState("");

  const [formData, setFormData] = useState({
    medicineName: "",
    medicationForm: "",
    medicationStrength: "",
    medicationUnit: "",
    medicationRoute: "",
    timeHour: "",
    timeMinute: "",
    timePeriod: "AM", // Added default value
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

  const handleFrequencyChange = (value) => {
    const updates = {
      frequencyType: value,
    };

    if (value !== "Other") {
      updates.timeHour = "08";
      updates.timeMinute = "00";
      updates.timePeriod = "AM";
    }
    if (value in frequencyIntervals) {
      const { days, hours, minutes } = frequencyIntervals[value];
      updates.frequencyDay = days.toString();
      updates.frequencyHour = hours.toString().padStart(2, "0");
      updates.frequencyMinute = minutes.toString().padStart(2, "0");
    } else {
      updates.timeHour = "";
      updates.timeMinute = "";
      updates.timePeriod = "";
      updates.frequencyDay = "";
      updates.frequencyHour = "";
      updates.frequencyMinute = "";
    }
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Get both role and user ID in parallel
        const [role, userId] = await Promise.all([
          AsyncStorage.getItem("userRole"),
          AsyncStorage.getItem("userId"), // or "physicianId" depending on your storage
        ]);

        console.log("User role:", role, "User ID:", userId);

        if (role !== "physician") {
          setAccessDeniedMessage(
            "Access denied: Only physicians can update medication."
          );
          setAccessDeniedVisible(true);
          return;
        }

        // Set physician ID in form data
        setFormData((prev) => ({
          ...prev,
          physicianID: userId || "unknown-physician", // Fallback if null
        }));
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
            `${BASE_API}/api/patients/${patient_number}/`
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

  useEffect(() => {
    if (schedule_id && patient_number) {
      const fetchMedicationDetails = async () => {
        try {
          const response = await fetch(
            `${BASE_API}/api/medications/${patient_number}/${schedule_id}/`
          );
          if (response.ok) {
            const data = await response.json();

            const userId = await AsyncStorage.getItem("userId");

            const [timeHour = "00", timeMinute = "00"] =
              data.Medication_Time?.split(":") || ["00", "00"]; // Fallback to 00:00 if null
            let timePeriod = "AM";
            const hourNum = parseInt(timeHour);
            if (hourNum >= 12) {
              timePeriod = "PM";
            }

            const [frequencyHour = "00", frequencyMinute = "00"] =
              data.Frequency?.split(":") || ["00", "00"]; // Fallback to 00:00 if null
            
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
              physicianID: data.physicianID, // Use the value from the backend!
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
          item.patient_number === patient_number &&
          item.Medication_name.toLowerCase().includes(text.toLowerCase())
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

  const handleRegister = async () => {
    console.log("Form Data Before Submit:", formData);

    const requiredFields = [
      "medicineName",
      "medicationForm",
      "medicationStrength",
      "medicationUnit",
      "medicationRoute",
      "timeHour",
      "timeMinute",
      "timePeriod",
      "frequencyType",
      "frequencyHour",
      "frequencyMinute",
      "medicationMonth",
      "medicationDay",
      "medicationYear",
    ];

    

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
        Medication_form: formData.medicationForm,
        Medication_route: formData.medicationRoute,
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
      };

      const url = schedule_id
        ? `${BASE_API}/api/medications/${patient_number}/${schedule_id}/`
        : `${BASE_API}/api/medications/${patient_number}/`;
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
              <View style={styles.autocompleteContainer}>
                <Autocomplete
                  data={filteredMedications}
                  value={formData.medicineName}
                  editable={false}
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

                <Text style={[styles.label]}>
                  Medication form <Text style={{ color: "#5879A5" }}>*</Text>{" "}
                </Text>
                <View style={styles.PickerContainer}>
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
                    placeholder={{
                      label: "Select Medication form...",
                      value: "",
                    }}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                    disabled={true}
                  />
                </View>

                <Text style={[styles.label]}>
                  Medication Route <Text style={{ color: "#5879A5" }}>*</Text>{" "}
                </Text>
                <View style={styles.PickerContainer}>
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
                    useNativeAndroidPickerStyle={false}
                    disabled={true}
                  />
                </View>

                <Text style={styles.label}>
                  Medication Strength{" "}
                  <Text style={{ color: "#5879A5" }}>*</Text>{" "}
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
                    value={formData.medicationStrength?.toString() || ""}
                    editable={false}
                    onChangeText={(text) =>
                      setFormData({ ...formData, medicationStrength: text })
                    }
                  />
                  <View style={styles.PickerContainer}>
                    <RNPickerSelect
                      items={[
                        { label: "mL", value: "ml" },
                        { label: "mcg", value: "mcg" },
                        { label: "mg", value: "mg" },
                        { label: "%", value: "%" },
                        { label: "g", value: "g" },
                      ]}
                      value={formData.medicationUnit}
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
                      disabled={true}
                    />
                  </View>
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
                    items={months}
                    value={formData.medicationMonth}
                    onValueChange={(value) =>
                      setFormData({ ...formData, medicationMonth: value })
                    }
                    placeholder={{ label: "MM", value: "" }}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                    disabled={true}
                  />
                </View>
                {/* Day */}
                <View style={styles.PickerContainer}>
                  <RNPickerSelect
                    items={days}
                    value={formData.medicationDay}
                    onValueChange={(value) =>
                      setFormData({ ...formData, medicationDay: value })
                    }
                    placeholder={{ label: "DD", value: "" }}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                    disabled={true}
                  />
                </View>
                {/* Year */}
                <View style={styles.PickerContainer}>
                  <RNPickerSelect
                    items={years}
                    value={formData.medicationYear}
                    onValueChange={(value) =>
                      setFormData({ ...formData, medicationYear: value })
                    }
                    placeholder={{ label: "YYYY", value: "" }}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                    disabled={true}
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
                    items={months}
                    value={formData.medicationEndMonth}
                    onValueChange={(value) =>
                      setFormData({ ...formData, medicationEndMonth: value })
                    }
                    placeholder={{ label: "MM", value: "" }}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                    disabled={true}
                  />
                </View>
                {/* Day */}
                <View style={styles.PickerContainer}>
                  <RNPickerSelect
                    items={days}
                    value={formData.medicationEndDay}
                    onValueChange={(value) =>
                      setFormData({ ...formData, medicationEndDay: value })
                    }
                    placeholder={{ label: "DD", value: "" }}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                    disabled={true}
                  />
                </View>
                {/* Year */}
                <View style={styles.PickerContainer}>
                  <RNPickerSelect
                    items={years}
                    value={formData.medicationEndYear}
                    onValueChange={(value) =>
                      setFormData({ ...formData, medicationEndYear: value })
                    }
                    placeholder={{ label: "YYYY", value: "" }}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                    disabled={true}
                  />
                </View>
              </View>

              <Text style={styles.label}>
                Time of Medication <Text style={{ color: "#5879A5" }}>*</Text>{" "}
              </Text>
              <View style={styles.dobContainer}>
                <View style={styles.PickerContainer}>
                  <RNPickerSelect
                    disabled={
                      formData.frequencyType != "Other" &&
                      formData.frequencyType != ""
                    }
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
                    disabled={
                      formData.frequencyType != "Other" &&
                      formData.frequencyType != ""
                    }
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
                    disabled={
                      formData.frequencyType != "Other" &&
                      formData.frequencyType != ""
                    }
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
                              disabled={true}
                            />
              
                            {formData.frequencyType === "Other" && (
                              <View>
                                <Text style={styles.label}>
                                  Set Frequency Interval
                                  <Text style={{ color: "#5879A5" }}>*</Text>{" "}
                                </Text>
                                <View style={styles.dobContainer}>
                                  <View style={styles.PickerContainer}>
                                    <RNPickerSelect
                                      disabled={
                                        formData.frequencyType != "Other" &&
                                        formData.frequencyType != ""
                                      }
                                      
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
              
                                  <View style={styles.PickerContainer}>
                                    <RNPickerSelect
                                      disabled={
                                        formData.frequencyType != "Other" &&
                                        formData.frequencyType != ""
                                      }
                                      
                                      items={[
                                        ...Array.from({ length: 24 }, (_, i) => ({
                                          label: i.toString().padStart(2, "0"),
                                          value: i.toString().padStart(2, "0"),
                                        })),
                                      ]}
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
                                      disabled={
                                        formData.frequencyType != "Other" &&
                                        formData.frequencyType != ""
                                      }
                                      
                                      items={[
                                        ...Array.from({ length: 60 }, (_, i) => ({
                                          label: i.toString().padStart(2, "0"),
                                          value: i.toString().padStart(2, "0"),
                                        })),
                                      ]}
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
                            )}
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
              onChangeText={(text) =>
                setFormData({ ...formData, medicationNotes: text })
              }
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
