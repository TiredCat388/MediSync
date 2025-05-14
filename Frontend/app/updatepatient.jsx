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
import styles from "./updatepatientstyle"
import CustomAlert from "./components/alert"; 

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
    { label: "DAT (Diet As Tolerated)", value: "DAT" },
    { label: "Diabetic Diet", value: "Diabetic Diet" },   
    { label: "High Protein Diet", value: "High Protein Diet" },
    { label: "Low Protein Diet", value: "Low Protein Diet" },
    { label: "Low Sodium, Low Fat Diet", value: "Low Sodium, Low Fat Diet" },
    { label: "Low Potassium Diet", value: "Low Potassium Diet" },
    { label: "Soft Diet", value: "Soft Diet" },
    { label: "Full Liquid", value: "Full liquid" },
    { label: "Clear Liquid", value: "Clear liquid" },
    { label: "NGT Feeding", value: "NGT feeding" },
    {
      label: "Total Parenteral Nutrition (TPN)",
      value: "Total parenteral Nutrition",
    },
    { label: "NPO (Nothing By Mouth)", value: "NPO" },
    { label: "Others", value: "Others" },
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

  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/patients/by-number/${patient_number}/`
        );
        if (response.ok) {
          const data = await response.json();
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
            bloodType: data.blood_type || "",
            religion: data.religion || "",
            otherReligionSpecify: data.other_religion_details || "",
            height: data.height || "",
            weight: data.weight || "",
            diet: data.diet || "",
            ngtSpecify: data.ngt_details || "",
            otherDietSpecify: data.other_diet_details || "",
            emergencyFirstName: data.emergency_contact?.first_name || "",
            emergencySurname: data.emergency_contact?.last_name || "",
            relation: data.emergency_contact?.relation_to_patient || "",
            emergencyPhone: data.emergency_contact?.contact_number || "",
            chiefComplaint: data.chief_complaint || "",
            admittingDiagnosis: data.admitting_diagnosis || "",
            finalDiagnosis: data.final_diagnosis || "",
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

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/patients/${patient_number}/`,
        {
          method: "PUT", // Or "PATCH" for partial updates
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
            blood_type: formData.bloodType,
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
            final_diagnosis: formData.finalDiagnosis,
            ngt_details: formData.diet === "NGT insertion" || formData.diet === "NGT feeding" ? formData.ngtSpecify : undefined,
            other_diet_details: formData.diet === "Others" ? formData.otherDietSpecify : undefined,
            other_religion_details: formData.religion === "Other" ? formData.otherReligionSpecify : undefined,
          }),
        }
      );

      if (response.ok) {
        setUpdateSuccessMessage("Patient updated successfully!");
        setUpdateSuccessVisible(true);
        // Optionally, you can navigate back or show a success message
        // router.push("/viewpatient?patient_number=" + patient_number);
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
        <Text style={styles.loadingText}>Loading patient details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Sidebar onNavigate={() => {}} /> {/* Adjust navigation as needed */}
      <View
        style={[
          styles.contentContainer,
          { marginLeft: isSidebarExpanded ? 200 : 70 },
        ]}
      >
        <Text style={styles.screenTitle}>Update Patient</Text>
        <View style={styles.formContainer}>
          <ScrollView style={styles.column}>
            <Text style={styles.sectionTitle}>Patient Details <Text style={{ color: 'red', fontSize: 16 }}>* Required</Text></Text>
            <Text style={styles.label}>First Name <Text style={{ color: 'red' }}>*</Text></Text>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(text) => handleInputChange("firstName", text)}
            />
            <Text style={styles.label}>Middle Name</Text>
            <TextInput
              style={styles.input}
              value={formData.middleName}
              onChangeText={(text) => handleInputChange("middleName", text)}
            />
            <Text style={styles.label}>Surname <Text style={{ color: 'red' }}>*</Text></Text>
            <TextInput
              style={styles.input}
              value={formData.surname}
              onChangeText={(text) => handleInputChange("surname", text)}
            />
            <Text style={styles.label}>Sex <Text style={{ color: 'red' }}>*</Text></Text>
            <View>
              <RNPickerSelect
                items={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                ]}
                value={formData.sex}
                onValueChange={(value) => handleInputChange("sex", value)}
                placeholder={formData.sex ? {} : { label: "Select Sex", value: "" }}
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
            <Text style={styles.label}>
            Date of Birth <Text style={{ color: 'red' }}>*</Text>
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
            <View style={{ flex: 1, marginRight: 10 }}>
              <RNPickerSelect
                items={months}
                value={formData.birthMonth}
                onValueChange={(value) => handleInputChange("birthMonth", value)}
                placeholder={formData.birthMonth ? {} : { label: "MM", value: "" }}
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
              <View style={{ flex: 1, marginRight: 10 }}>
              <RNPickerSelect
                items={days}
                value={formData.birthDay}
                onValueChange={(value) => handleInputChange("birthDay", value)}
                placeholder={formData.birthDay ? {} : { label: "DD", value: "" }}
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
              <View style={{ flex: 1}}>
              <RNPickerSelect
                items={years}
                value={formData.birthYear}
                onValueChange={(value) => handleInputChange("birthYear", value)}
                placeholder={formData.birthYear ? {} : { label: "YYYY", value: "" }}
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
            </View>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              value={formData.age.toString()}
              editable={false}
            />
            <Text style={styles.label}>Blood Type <Text style={{ color: 'red' }}>*</Text></Text>
            <View>
              <RNPickerSelect
                items={[
                  { label: "A+", value: "A+" },
                  { label: "A-", value: "A-" },
                  { label: "B+", value: "B+" },
                  { label: "B-", value: "B-" },
                  { label: "AB+", value: "AB+" },
                  { label: "AB-", value: "AB-" },
                  { label: "O+", value: "O+" },
                  { label: "O-", value: "O-" },
                ]}
                value={formData.bloodType}
                onValueChange={(value) => handleInputChange("bloodType", value)}
                placeholder={formData.bloodType ? {} : { label: "Select Blood Type", value: "" }}
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
            <Text style={styles.label}>Religion</Text>
            <View>
              <RNPickerSelect
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
                onValueChange={(value) => handleInputChange("religion", value)}
                placeholder={formData.religion ? {} : { label: "Select Religion", value: "" }}
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
            {formData.religion === "Other" ? (
              <>
                <Text style={styles.label}>Specify Other Religion <Text style={{ color: 'red' }}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  value={formData.otherReligionSpecify}
                  onChangeText={(text) => handleInputChange("otherReligionSpecify", text)}
                  placeholder="Please specify your religion"
                />
              </>
            ) : null}
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.label}>Height (meters) <Text style={{ color: 'red' }}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="e.g., 1.70"
                  value={formData.height}
                  onChangeText={(text) => handleInputChange("height", text)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Weight (kg) <Text style={{ color: 'red' }}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="e.g., 65"
                  value={formData.weight}
                  onChangeText={(text) => handleInputChange("weight", text)}
                />
              </View>
            </View>
            <Text style={styles.label}>Diet <Text style={{ color: 'red' }}>*</Text></Text>
            <View>
              <RNPickerSelect
                items={dietOptions}
                value={formData.diet}
                onValueChange={(value) => handleInputChange("diet", value)}
                placeholder={formData.diet ? {} : { label: "Select Diet", value: "" }}
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
            {formData.diet === "NGT insertion" || formData.diet === "NGT feeding" ? (
              <>
                <Text style={styles.label}>Specify NGT Details <Text style={{ color: 'red' }}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  value={formData.ngtSpecify}
                  onChangeText={(text) => handleInputChange("ngtSpecify", text)}
                  placeholder="e.g., Size, Insertion Date"
                />
              </>
            ) : null}
            {formData.diet === "Others" ? (
              <>
                <Text style={styles.label}>Specify Other Diet <Text style={{ color: 'red' }}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  value={formData.otherDietSpecify}
                  onChangeText={(text) => handleInputChange("otherDietSpecify", text)}
                  placeholder="Please specify the diet"
                />
              </>
            ) : null}
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={formData.phoneNumber}
              onChangeText={(text) => handleInputChange("phoneNumber", text)}
              keyboardType="phone-pad"
            />
            <Text style={styles.label}>Bed Number <Text style={{ color: 'red' }}>*</Text></Text>
            <TextInput
              style={styles.input}
              value={formData.bedNumber}
              onChangeText={(text) => handleInputChange("bedNumber", text)}
              keyboardType="numeric"
            />
            <Text style={styles.label}>Room Number <Text style={{ color: 'red' }}>*</Text></Text>
            <TextInput
              style={styles.input}
              value={formData.roomNumber}
              onChangeText={(text) => handleInputChange("roomNumber", text)}
              keyboardType="numeric"
            />
            <Text style={styles.label}>Chief Complaint <Text style={{ color: 'red' }}>*</Text></Text>
            <TextInput
              style={[styles.input, { height: 150, textAlignVertical: "top" }]}
              multiline
              numberOfLines={4}
              value={formData.chiefComplaint}
              onChangeText={(text) => handleInputChange("chiefComplaint", text)}
            />
            <Text style={styles.label}>Admitting Diagnosis <Text style={{ color: 'red' }}>*</Text></Text>
            <TextInput
              style={[styles.input, { height: 150, textAlignVertical: "top" }]}
              multiline
              numberOfLines={4}
              value={formData.admittingDiagnosis}
              onChangeText={(text) => handleInputChange("admittingDiagnosis", text)}
            />
            <Text style={styles.label}>Final Diagnosis</Text>
            <TextInput
              style={[styles.input, { height: 150, textAlignVertical: "top" }]}
              multiline
              numberOfLines={4}
              value={formData.finalDiagnosis}
              onChangeText={(text) => handleInputChange("finalDiagnosis", text)}
            />
          </ScrollView>
          <View style={styles.divider} />
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Emergency Contact Details</Text>
            <Text style={styles.label}>First Name <Text style={{ color: 'red' }}>*</Text></Text>
            <TextInput
              style={styles.input}
              value={formData.emergencyFirstName}
              onChangeText={(text) => handleInputChange("emergencyFirstName", text)}
            />
            <Text style={styles.label}>Surname <Text style={{ color: 'red' }}>*</Text></Text>
            <TextInput
              style={styles.input}
              value={formData.emergencySurname}
              onChangeText={(text) => handleInputChange("emergencySurname", text)}
            />
            <Text style={styles.label}>Relation to Patient <Text style={{ color: 'red' }}>*</Text></Text>
            <TextInput
              style={styles.input}
              value={formData.relation}
              onChangeText={(text) => handleInputChange("relation", text)}
            />
            <Text style={styles.label}>Contact Number <Text style={{ color: 'red' }}>*</Text></Text>
            <TextInput
              style={styles.input}
              value={formData.emergencyPhone}
              onChangeText={(text) => handleInputChange("emergencyPhone", text)}
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
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleUpdate}
            style={[styles.button, styles.stayButton]}
          >
            <Text style={styles.buttonText}>Update Patient</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Update Success Alert */}
      <CustomAlert
        visible={updateSuccessVisible}
        message={updateSuccessMessage}
        onClose={() => {
          setUpdateSuccessVisible(false);
          router.push("/viewpatient?patient_number=" + patient_number);
        }}
      />
    </View>
  );
}
