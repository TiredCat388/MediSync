import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Sidebar from "./components/sidebar";
import styles from "./stylesheets/updatemedstyle";
import Constants from "expo-constants";
import { ScrollView } from "react-native";
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
    <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>
      <Sidebar onNavigate={(destination) => router.push(destination)} />
      <View
        style={[
          styles.contentContainer,
          { marginLeft: isSidebarExpanded ? 200 : 70 },
        ]}
      >
        <AppText style={styles.screenTitle}>View Medication Schedule</AppText>
        <View style={styles.formContainer}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={styles.column}>
              <AppText style={styles.sectionTitle}>
                {schedule_id && patientName
                  ? `FOR: ${patientName} | Schedule ID - ${schedule_id}`
                  : "Loading schedule and patient info..."}
              </AppText>
              <AppText style={styles.label}>Medication Name</AppText>
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
                        <AppText style={styles.autocompleteText}>{item}</AppText>
                      </TouchableOpacity>
                    ),
                  }}
                  containerStyle={styles.autocompleteWrapper}
                  inputContainerStyle={styles.autocompleteInput}
                />

                <AppText style={[styles.label]}>
                  Medication form <AppText style={{ color: "#5879A5" }}>*</AppText>{" "}
                </AppText>
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

                <AppText style={[styles.label]}>
                  Medication Route <AppText style={{ color: "#5879A5" }}>*</AppText>{" "}
                </AppText>
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

                <AppText style={styles.label}>
                  Medication Strength{" "}
                  <AppText style={{ color: "#5879A5" }}>*</AppText>{" "}
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

              <AppText style={styles.label}>
                Time of Medication <AppText style={{ color: "#5879A5" }}>*</AppText>{" "}
              </AppText>
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
              <AppText style={styles.label}>
                              Frequency <AppText style={{ color: "#5879A5" }}>*</AppText>{" "}
                            </AppText>
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
                                <AppText style={styles.label}>
                                  Set Frequency Interval
                                  <AppText style={{ color: "#5879A5" }}>*</AppText>{" "}
                                </AppText>
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
            <AppText style={styles.sectionTitle}>Additional Information</AppText>
            <AppText style={styles.label}>Medication Notes</AppText>
            <TextInput
              style={styles.input}
              multiline
              numberOfLines={4}
              value={formData.medicationNotes}
              editable={false}
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
            onPress={handleBack}
            style={[styles.button, styles.stayButton]}
          >
            <AppText style={styles.buttonText}>Back</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </SafeAreaView>
  );
}
