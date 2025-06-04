import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Sidebar from "./components/sidebar";
import RNPickerSelect from "react-native-picker-select";
import styles from "./stylesheets/updatepatientstyle";
import CustomAlert from "./components/alert";
import Constants from 'expo-constants';
import { SafeAreaView } from "react-native-safe-area-context";
import AppText from './components/AppText';
import Icon from 'react-native-vector-icons/MaterialIcons';


const BASE_API = Constants.expoConfig.extra.BASE_API;

export default function UpdatePatientScreen() {
  const router = useRouter();
  const { patient_number } = useLocalSearchParams();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    surname: "",
    sex: "",
    birthMonth: "",
    birthDay: "",
    birthYear: "",
    phoneNumber: "",
    bedNumber: "",
    roomNumber: "",
    age: "",
    bloodType: "",
    religion: "",
    otherReligionSpecify: "",
    height: "",
    weight: "",
    diet: "",
    ngtSpecify: "",
    otherDietSpecify: "",
    emergencyFirstName: "",
    emergencySurname: "",
    relation: "",
    emergencyPhone: "",
    chiefComplaint: "",
    admittingDiagnosis: "",
    finalDiagnosis: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateSuccessVisible, setUpdateSuccessVisible] = useState(false); // State for success alert (Renamed for clarity)
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState(""); // State for success message

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

  const dietOptions = [
    { label: "Diet As Tolerated", value: "DAT" },
    { label: "Diabetic Diet", value: "DB" },
    { label: "High Protein Diet", value: "HPD" },
    { label: "Low Protein Diet", value: "LPD" },
    { label: "Low Sodium, Low Fat Diet", value: "LSLFD" },
    { label: "Low Potassium Diet", value: "LPTD" },
    { label: "Soft Diet", value: "SD" },
    { label: "Full Liquid", value: "FL" },
    { label: "Clear Liquid", value: "CL" },
    { label: "NGT Feeding", value: "NGTF" },
    { label: "Total Parenteral Nutrition (TPN)", value: "TPN" },
    { label: "Nothing By Mouth", value: "NPO" },
    { label: "Other", value: "other" },
  ];

  const days = Array.from({ length: 31 }, (_, index) => ({
    label: (index + 1).toString().padStart(2, "0"),
    value: (index + 1).toString().padStart(2, "0"),
  }));

  const years = Array.from({ length: 150 }, (_, index) => ({
    label: (new Date().getFullYear() - index).toString(),
    value: (new Date().getFullYear() - index).toString(),
  }));

  const calculateAge = (birthYear, birthMonth, birthDay) => {
    const today = new Date();
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    if (formData.birthYear && formData.birthMonth && formData.birthDay) {
      const age = calculateAge(
        formData.birthYear,
        formData.birthMonth,
        formData.birthDay
      );
      setFormData((prevData) => ({ ...prevData, age: age.toString() }));
    }
  }, [formData.birthYear, formData.birthMonth, formData.birthDay]);

  const handleDietChange = (value) => {
    if (value === "NGTF") {
      setFormData({ ...formData, diet: "ngt:", ngtSpecify: "" });
    } else if (value === "other") {
      setFormData({ ...formData, diet: "other:", otherDietSpecify: "" });
    } else {
      setFormData({
        ...formData,
        diet: value,
        ngtSpecify: "",
        otherDietSpecify: "",
      });
    }
  };

  const handleDietSpecifyChange = (text, type) => {
    if (type === "ngt") {
      setFormData({ ...formData, diet: `ngt:${text}`, ngtSpecify: text });
    } else {
      setFormData({
        ...formData,
        diet: `other:${text}`,
        otherDietSpecify: text,
      });
    }
  };

  const displayDiet = (diet) => {
    if (!diet) return "";
    if (diet.startsWith("ngt:")) {
      return `NGT Feeding - ${diet.replace("ngt:", "")}`;
    }
    if (diet.startsWith("other:")) {
      return `Other - ${diet.replace("other:", "")}`;
    }
    const option = dietOptions.find((opt) => opt.value === diet);
    return option ? option.label : diet;
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${BASE_API}/api/patients/by-number/${patient_number}/`
        );
        if (response.ok) {
          const data = await response.json();
          // Handle diet data
          let diet = data.diet || "";
          let ngtSpecify = "";
          let otherDietSpecify = "";

          if (diet.startsWith("ngt:")) {
            ngtSpecify = diet.replace("ngt:", "");
          } else if (diet.startsWith("other:")) {
            otherDietSpecify = diet.replace("other:", "");
          }

          setFormData({
            firstName: data.first_name || "",
            middleName: data.middle_name || "",
            surname: data.last_name || "",
            sex: data.sex || "",
            birthMonth: data.date_of_birth
              ? data.date_of_birth.split("-")[1]
              : "",
            birthDay: data.date_of_birth
              ? data.date_of_birth.split("-")[2]
              : "",
            birthYear: data.date_of_birth
              ? data.date_of_birth.split("-")[0]
              : "",
            phoneNumber: data.contact_number || "",
            bedNumber: data.bed_number ? data.bed_number.toString() : "",
            roomNumber: data.room_number ? data.room_number.toString() : "",
            age: data.age ? data.age.toString() : "",
            bloodType: data.blood_group || "",
            religion: data.religion || "",
            otherReligionSpecify: data.other_religion_details || "",
            height: data.height || "",
            weight: data.weight || "",
            diet: diet,
            ngtSpecify: ngtSpecify,
            otherDietSpecify: otherDietSpecify,
            emergencyFirstName: data.emergency_contact?.first_name || "",
            emergencySurname: data.emergency_contact?.last_name || "",
            relation: data.emergency_contact?.relation_to_patient || "",
            emergencyPhone: data.emergency_contact?.contact_number || "",
            chiefComplaint: data.chief_complaint || "",
            admittingDiagnosis: data.admitting_diagnosis || "",
            finalDiagnosis: data.Final_diagnosis || "",
          });
        } else {
          const errorData = await response.json();
          setError(`Failed to fetch patient: ${JSON.stringify(errorData)}`);
        }
      } catch (err) {
        setError(`Failed to fetch patient: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (patient_number) {
      fetchPatientData();
    }
  }, [patient_number]);

  const pickerSelectStyles = {
    inputAndroid: styles.input,
    inputIOS: styles.input,
    placeholder: {
      color: "#999",
    },
    iconContainer: {
      top: 10,
      right: 12,
    },
  }; 

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BASE_API}/api/patients/${patient_number}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: formData.firstName,
            middle_name: formData.middleName,
            last_name: formData.surname,
            sex: formData.sex,
            date_of_birth: `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`,
            contact_number: formData.phoneNumber,
            bed_number: formData.bedNumber
              ? parseInt(formData.bedNumber)
              : null,
            room_number: formData.roomNumber
              ? parseInt(formData.roomNumber)
              : null,
            age: formData.age ? parseInt(formData.age) : null,
            blood_group: formData.bloodType,
            religion: formData.religion,
            height: formData.height,
            weight: formData.weight,
            diet: formData.diet,
            emergency_contact: {
              first_name: formData.emergencyFirstName,
              last_name: formData.emergencySurname,
              relation_to_patient: formData.relation,
              contact_number: formData.emergencyPhone,
            },
            chief_complaint: formData.chiefComplaint,
            admitting_diagnosis: formData.admittingDiagnosis,
            Final_diagnosis: formData.finalDiagnosis,
          }),
        }
      );

      if (response.ok) {
        setUpdateSuccessMessage("Patient updated successfully!");
        setUpdateSuccessVisible(true);
      } else {
        const errorData = await response.json();
        setError(`Failed to update patient: ${JSON.stringify(errorData)}`);
      }
    } catch (err) {
      setError(`Failed to update patient: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <AppText style={styles.loadingText}>Loading patient details...</AppText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <AppText style={styles.errorText}>Error: {error}</AppText>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Sidebar onNavigate={() => {}} /> {/* Adjust navigation as needed */}
        <View
          style={[
            styles.contentContainer,
            { marginLeft: isSidebarExpanded ? 200 : 70 },
          ]}
        >
          <AppText style={styles.screenTitle}>Update Patient</AppText>
          <View style={styles.formContainer}>
            <ScrollView style={styles.column}>
              <AppText style={styles.sectionTitle}>
                Patient Details{" "}
                <AppText style={{ color: "#5879A5", fontSize: 16 }}>
                  * Required
                </AppText>
              </AppText>
              <AppText style={styles.label}>
                First Name <AppText style={{ color: "#5879A5" }}>*</AppText>
              </AppText>
              <TextInput
                style={styles.input}
                value={formData.firstName}
                onChangeText={(text) => handleInputChange("firstName", text)}
              />
              <AppText style={styles.label}>Middle Name</AppText>
              <TextInput
                style={styles.input}
                value={formData.middleName}
                onChangeText={(text) => handleInputChange("middleName", text)}
              />
              <AppText style={styles.label}>
                Surname <AppText style={{ color: "#5879A5" }}>*</AppText>
              </AppText>
              <TextInput
                style={styles.input}
                value={formData.surname}
                onChangeText={(text) => handleInputChange("surname", text)}
              />
              <AppText style={styles.label}>
                Sex <AppText style={{ color: "#5879A5" }}>*</AppText>
              </AppText>
              <View>
                <RNPickerSelect
                  items={[
                    { label: "Male", value: "M" },
                    { label: "Female", value: "F" },
                  ]}
                  value={formData.sex}
                  onValueChange={(value) => handleInputChange("sex", value)}
                  placeholder={
                    formData.sex ? {} : { label: "Select Sex", value: "" }
                  }
                  style={{
                    inputAndroid: styles.input,
                    inputIOS: styles.input,
                    inputWeb: styles.input,
                    placeholder: {
                      color: "#999",
                    },
                  }}
                />
              </View>
              <AppText style={styles.label}>
                Date of Birth <AppText style={{ color: "#5879A5" }}>*</AppText>
              </AppText>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1, marginRight: 10 }}>
                  <RNPickerSelect
                    Icon={() => (
                      <Icon name="arrow-drop-down" size={20} color="gray" />
                    )}
                    items={months}
                    value={formData.birthMonth}
                    onValueChange={(value) =>
                      handleInputChange("birthMonth", value)
                    }
                    placeholder={
                      formData.birthMonth ? {} : { label: "MM", value: "" }
                    }
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                  />
                </View>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <RNPickerSelect
                    Icon={() => (
                      <Icon name="arrow-drop-down" size={20} color="gray" />
                    )}
                    items={days}
                    value={formData.birthDay}
                    onValueChange={(value) =>
                      handleInputChange("birthDay", value)
                    }
                    placeholder={
                      formData.birthDay ? {} : { label: "DD", value: "" }
                    }
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <RNPickerSelect
                    Icon={() => (
                      <Icon name="arrow-drop-down" size={20} color="gray" />
                    )}
                    items={years}
                    value={formData.birthYear}
                    onValueChange={(value) =>
                      handleInputChange("birthYear", value)
                    }
                    placeholder={
                      formData.birthYear ? {} : { label: "YYYY", value: "" }
                    }
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                  />
                </View>
              </View>
              <AppText style={styles.label}>Age</AppText>
              <TextInput
                style={styles.input}
                value={formData.age.toString()}
                editable={false}
              />
              <AppText style={styles.label}>
                Blood Type <AppText style={{ color: "#5879A5" }}>*</AppText>
              </AppText>
              <View>
                <RNPickerSelect
                  Icon={() => (
                    <Icon name="arrow-drop-down" size={20} color="gray" />
                  )}
                  items={[
                    { label: "A+", value: "A+" },
                    { label: "A-", value: "A-" },
                    { label: "B+", value: "B+" },
                    { label: "B-", value: "B-" },
                    { label: "AB+", value: "AB+" },
                    { label: "AB-", value: "AB-" },
                    { label: "O+", value: "O+" },
                    { label: "O-", value: "O-" },
                    { label: "Rhnull", value: "Rhnull" },
                  ]}
                  value={formData.bloodType}
                  onValueChange={(value) =>
                    handleInputChange("bloodType", value)
                  }
                  placeholder={
                    formData.bloodType
                      ? {}
                      : { label: "Select Blood Type", value: "" }
                  }
                  style={pickerSelectStyles}
                  useNativeAndroidPickerStyle={false}
                />
              </View>
              <AppText style={styles.label}>Religion</AppText>
              <View>
                <RNPickerSelect
                  Icon={() => (
                    <Icon name="arrow-drop-down" size={20} color="gray" />
                  )}
                  items={[
                    { label: "Catholic", value: "Catholic" },
                    { label: "Protestant", value: "Protestant" },
                    { label: "Muslim", value: "Muslim" },
                    { label: "Buddhist", value: "Buddhist" },
                    { label: "Hindu", value: "Hindu" },
                    { label: "Atheist", value: "Atheist" },
                    { label: "Agnostic", value: "Agnostic" },
                    { label: "Other", value: "Other" },
                  ]}
                  value={formData.religion}
                  onValueChange={(value) =>
                    handleInputChange("religion", value)
                  }
                  placeholder={
                    formData.religion
                      ? {}
                      : { label: "Select Religion", value: "" }
                  }
                  style={pickerSelectStyles}
                  useNativeAndroidPickerStyle={false}
                />
              </View>
              {formData.religion === "Other" ? (
                <>
                  <AppText style={styles.label}>
                    Specify Other Religion{" "}
                    <AppText style={{ color: "red" }}>*</AppText>
                  </AppText>
                  <TextInput
                    style={styles.input}
                    value={formData.otherReligionSpecify}
                    onChangeText={(text) =>
                      handleInputChange("otherReligionSpecify", text)
                    }
                    placeholder="Please specify your religion"
                  />
                </>
              ) : null}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1, marginRight: 10 }}>
                  <AppText style={styles.label}>
                    Height (meters){" "}
                    <AppText style={{ color: "#5879A5" }}>*</AppText>
                  </AppText>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="e.g., 1.70"
                    value={formData.height}
                    onChangeText={(text) => handleInputChange("height", text)}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText style={styles.label}>
                    Weight (kg){" "}
                    <AppText style={{ color: "#5879A5" }}>*</AppText>
                  </AppText>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="e.g., 65"
                    value={formData.weight}
                    onChangeText={(text) => handleInputChange("weight", text)}
                  />
                </View>
              </View>
              <AppText style={styles.label}>
                Diet <AppText style={{ color: "#5879A5" }}>*</AppText>
              </AppText>
              <View>
                <RNPickerSelect
                  Icon={() => (
                    <Icon name="arrow-drop-down" size={20} color="gray" />
                  )}
                  items={dietOptions}
                  value={formData.diet.split(":")[0]}
                  onValueChange={handleDietChange}
                  placeholder={
                    formData.diet ? {} : { label: "Select Diet", value: "" }
                  }
                  style={pickerSelectStyles}
                  useNativeAndroidPickerStyle={false}
                />
              </View>
              {formData.diet.startsWith("ngt:") ? (
                <>
                  <AppText style={styles.label}>
                    Specify NGT Details{" "}
                    <AppText style={{ color: "red" }}>*</AppText>
                  </AppText>
                  <TextInput
                    style={styles.input}
                    value={formData.ngtSpecify}
                    onChangeText={(text) =>
                      handleDietSpecifyChange(text, "ngt")
                    }
                    placeholder="e.g., Formula"
                  />
                </>
              ) : null}
              {formData.diet.startsWith("other:") ? (
                <>
                  <AppText style={styles.label}>
                    Specify Other Diet{" "}
                    <AppText style={{ color: "red" }}>*</AppText>
                  </AppText>
                  <TextInput
                    style={styles.input}
                    value={formData.otherDietSpecify}
                    onChangeText={(text) =>
                      handleDietSpecifyChange(text, "other")
                    }
                    placeholder="Please specify the diet"
                  />
                </>
              ) : null}
              <AppText style={styles.label}>
                Contact Number <AppText style={{ color: "#5879A5" }}>*</AppText>
              </AppText>
              <TextInput
                style={styles.input}
                value={formData.phoneNumber}
                onChangeText={(text) => handleInputChange("phoneNumber", text)}
                keyboardType="phone-pad"
              />
              <AppText style={styles.label}>
                Bed Number <AppText style={{ color: "#5879A5" }}>*</AppText>
              </AppText>
              <TextInput
                style={styles.input}
                value={formData.bedNumber}
                onChangeText={(text) => handleInputChange("bedNumber", text)}
                keyboardType="numeric"
              />
              <AppText style={styles.label}>
                Room Number <AppText style={{ color: "#5879A5" }}>*</AppText>
              </AppText>
              <TextInput
                style={styles.input}
                value={formData.roomNumber}
                onChangeText={(text) => handleInputChange("roomNumber", text)}
                keyboardType="numeric"
              />
              <AppText style={styles.label}>
                Chief Complaint/s{" "}
                <AppText style={{ color: "#5879A5" }}>*</AppText>
              </AppText>
              <TextInput
                style={[
                  styles.input,
                  { height: 150, textAlignVertical: "top" },
                ]}
                multiline
                numberOfLines={4}
                value={formData.chiefComplaint}
                onChangeText={(text) =>
                  handleInputChange("chiefComplaint", text)
                }
              />
              <AppText style={styles.label}>
                Admitting Diagnosis{" "}
                <AppText style={{ color: "#5879A5" }}>*</AppText>
              </AppText>
              <TextInput
                style={[
                  styles.input,
                  { height: 150, textAlignVertical: "top" },
                ]}
                multiline
                numberOfLines={4}
                value={formData.admittingDiagnosis}
                onChangeText={(text) =>
                  handleInputChange("admittingDiagnosis", text)
                }
              />
              <AppText style={styles.label}>Final Diagnosis</AppText>
              <TextInput
                style={[
                  styles.input,
                  { height: 150, textAlignVertical: "top" },
                ]}
                multiline
                numberOfLines={4}
                value={formData.finalDiagnosis}
                onChangeText={(text) =>
                  handleInputChange("finalDiagnosis", text)
                }
              />
            </ScrollView>
            <View style={styles.divider} />
            <View style={styles.column}>
              <AppText style={styles.sectionTitle}>
                Emergency Contact Details
              </AppText>
              <AppText style={styles.label}>
                First Name <AppText style={{ color: "#5879A5" }}>*</AppText>
              </AppText>
              <TextInput
                style={styles.input}
                value={formData.emergencyFirstName}
                onChangeText={(text) =>
                  handleInputChange("emergencyFirstName", text)
                }
              />
              <AppText style={styles.label}>
                Surname <AppText style={{ color: "#5879A5" }}>*</AppText>
              </AppText>
              <TextInput
                style={styles.input}
                value={formData.emergencySurname}
                onChangeText={(text) =>
                  handleInputChange("emergencySurname", text)
                }
              />
              <AppText style={styles.label}>
                Relation to Patient{" "}
                <AppText style={{ color: "#5879A5" }}>*</AppText>
              </AppText>
              <TextInput
                style={styles.input}
                value={formData.relation}
                onChangeText={(text) => handleInputChange("relation", text)}
              />
              <AppText style={styles.label}>
                Contact Number <AppText style={{ color: "#5879A5" }}>*</AppText>
              </AppText>
              <TextInput
                style={styles.input}
                value={formData.emergencyPhone}
                onChangeText={(text) =>
                  handleInputChange("emergencyPhone", text)
                }
                keyboardType="phone-pad"
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() =>
                router.push("/viewpatient?patient_number=" + patient_number)
              }
              style={[styles.button, styles.leaveButton]}
            >
              <AppText style={styles.buttonText}>Cancel</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleUpdate}
              style={[styles.button, styles.stayButton]}
            >
              <AppText style={styles.buttonText}>Update Patient</AppText>
            </TouchableOpacity>
          </View>
        </View>
        <CustomAlert
          visible={updateSuccessVisible}
          message={updateSuccessMessage}
          onClose={() => {
            setUpdateSuccessVisible(false);
            router.push("/viewpatient?patient_number=" + patient_number);
          }}
        />
      </View>
    </SafeAreaView>
  );
}
