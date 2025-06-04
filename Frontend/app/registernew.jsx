import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import { useRouter } from "expo-router";
import Sidebar from "./components/sidebar";
import RNPickerSelect from "react-native-picker-select";
import styles from "./stylesheets/registerstyle";
import CustomAlert from "./components/alert"; 
import { ScrollView } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Constants from 'expo-constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from "react-native-safe-area-context";
import AppText from './components/AppText';


const BASE_API = Constants.expoConfig.extra.BASE_API;

export default function RegisterNewPatient() {
  const router = useRouter();
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

  const [modalVisible, setModalVisible] = useState(false);
  const [warningModalVisible, setWarningModalVisible] = useState(false);
  const [registrationSuccessVisible, setRegistrationSuccessVisible] =
    useState(false); // State for success alert
  const [registrationSuccessMessage, setRegistrationSuccessMessage] =
    useState("");
  const isFormFilled = Object.values(formData).some(
    (value) => value !== null && value !== ""
  );

  const requiredFields = {
    firstName: "First Name",
    surname: "Surname",
    sex: "Sex",
    birthYear: "Birth Year",
    birthMonth: "Birth Month",
    birthDay: "Birth Day",
    phoneNumber: "Phone Number",
    bedNumber: "Bed Number",
    roomNumber: "Room Number",
    bloodType: "Blood Type",
    height: "Height",
    weight: "Weight",
    diet: "Diet",
    emergencyFirstName: "Emergency Contact First Name",
    emergencySurname: "Emergency Contact Surname",
    relation: "Relation to Patient",
    emergencyPhone: "Emergency Contact Phone",
    chiefComplaint: "Chief Complaint",
    admittingDiagnosis: "Admitting Diagnosis"
  };

  const isFormComplete = () => {
    // Check required fields
    for (const [field, label] of Object.entries(requiredFields)) {
      const value = formData[field];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        setWarningModalVisible(true);
        setRegistrationSuccessMessage(`Please fill in the required field: ${label}`);
        return false;
      }
    }

    // Check conditional required fields
    if (formData.religion === "Other" && !formData.otherReligionSpecify) {
      setWarningModalVisible(true);
      setRegistrationSuccessMessage("Please specify your religion");
      return false;
    }

    if (formData.diet.startsWith("ngt:") && !formData.ngtSpecify) {
      setWarningModalVisible(true);
      setRegistrationSuccessMessage("Please specify NGT details");
      return false;
    }

    if (formData.diet.startsWith("other:") && !formData.otherDietSpecify) {
      setWarningModalVisible(true);
      setRegistrationSuccessMessage("Please specify other diet details");
      return false;
    }

    return true;
  };

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

  const allowedDestinations = ["/directory"]; // Add allowed destinations here

  const months = Array.from({ length: 12 }, (_, index) => ({
    label: (index + 1).toString().padStart(2, "0"),
    value: (index + 1).toString().padStart(2, "0"),
  }));

  const days = Array.from({ length: 31 }, (_, index) => ({
    label: (index + 1).toString().padStart(2, "0"),
    value: (index + 1).toString().padStart(2, "0"),
  }));

  const years = Array.from({ length: 150 }, (_, index) => ({
    label: (new Date().getFullYear() - index).toString(),
    value: (new Date().getFullYear() - index).toString(),
  })).reverse();

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
      setFormData((prevData) => ({ ...prevData, age }));
    }
  }, [formData.birthYear, formData.birthMonth, formData.birthDay]);

  const handleNavigate = (destination) => {
    if (allowedDestinations.includes(destination)) {
      if (isFormFilled) {
        setModalVisible(true);
      } else {
        router.push(destination);
      }
    } else {
      console.error("Invalid destination:", destination);
    }
  };

  const handleDietChange = (value) => {
    if (value === "NGTF") {
      setFormData({ ...formData, diet: "ngt:", ngtSpecify: "" });
    } else if (value === "other") {
      setFormData({ ...formData, diet: "other:", otherDietSpecify: "" });
    } else {
      setFormData({ ...formData, diet: value, ngtSpecify: "", otherDietSpecify: "" });
    }
  };

  const handleDietSpecifyChange = (text, type) => {
    if (type === "ngt") {
      setFormData({ ...formData, diet: `ngt:${text}`, ngtSpecify: text });
    } else {
      setFormData({ ...formData, diet: `other:${text}`, otherDietSpecify: text });
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
    const option = dietOptions.find(opt => opt.value === diet);
    return option ? option.label : diet;
  };

  const handleRegister = async () => {
    if (!isFormComplete()) {
      return;
    }

    // Calculate age one final time before submission
    const age = calculateAge(
      parseInt(formData.birthYear),
      parseInt(formData.birthMonth),
      parseInt(formData.birthDay)
    );

    const patientData = {
      first_name: formData.firstName,
      middle_name: formData.middleName,
      last_name: formData.surname,
      sex: formData.sex,
      date_of_birth: `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`,
      contact_number: formData.phoneNumber,
      bed_number: parseInt(formData.bedNumber),
      room_number: parseInt(formData.roomNumber),
      age: formData.age,
      blood_group: formData.bloodType,
      religion: formData.religion,
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
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
    };

    if (
      formData.diet === "NGT insertion" ||
      formData.diet === "NGT feeding"
    ) {
      patientData.ngt_details = formData.ngtSpecify;
    } else if (formData.diet === "Others") {
      patientData.other_diet_details = formData.otherDietSpecify;
    }

    try {
      const response = await fetch(`${BASE_API}/api/patients/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });

      if (response.ok) {
        setRegistrationSuccessMessage("Patient registered successfully!");
        setRegistrationSuccessVisible(true);
        // Reset form after successful registration
        setFormData({
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
      } else {
        const errorData = await response.json();
        console.error("Error registering patient:", errorData);
        setRegistrationSuccessMessage("Failed to register patient. Please try again.");
        setRegistrationSuccessVisible(true);
      }
    } catch (error) {
      console.error("Error registering patient:", error);
      setRegistrationSuccessMessage("Failed to register patient. Please try again.");
      setRegistrationSuccessVisible(true);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Sidebar onNavigate={handleNavigate} />
          <View
            style={[
              styles.contentContainer,
              { marginLeft: isSidebarExpanded ? 200 : 70 },
            ]}
          >
            <AppText style={styles.screenTitle}>Register New Patient</AppText>
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
                  onChangeText={(text) =>
                    setFormData({ ...formData, firstName: text })
                  }
                />
                <AppText style={styles.label}>Middle Name</AppText>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) =>
                    setFormData({ ...formData, middleName: text })
                  }
                />
                <AppText style={styles.label}>
                  Surname <AppText style={{ color: "#5879A5" }}>*</AppText>
                </AppText>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) =>
                    setFormData({ ...formData, surname: text })
                  }
                />

                <AppText style={styles.label}>
                  Sex <AppText style={{ color: "#5879A5" }}>*</AppText>
                </AppText>
                <View>
                  <RNPickerSelect
                    Icon={() => (
                      <Icon name="arrow-drop-down" size={20} color="gray" />
                    )}
                    items={[
                      { label: "Male", value: "M" },
                      { label: "Female", value: "F" },
                    ]}
                    value={formData.sex}
                    onValueChange={(value) =>
                      setFormData({ ...formData, sex: value })
                    }
                    placeholder={
                      formData.sex ? {} : { label: "Select Sex", value: "" }
                    }
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                  />
                </View>

                <AppText style={styles.label}>
                  Date of Birth{" "}
                  <AppText style={{ color: "#5879A5" }}>*</AppText>
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
                        setFormData({ ...formData, birthMonth: value })
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
                        setFormData({ ...formData, birthDay: value })
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
                        setFormData({ ...formData, birthYear: value })
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
                      setFormData({ ...formData, bloodType: value })
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
                    onValueChange={(value) => {
                      // Reset otherReligionSpecify if not "Other"
                      if (value !== "Other") {
                        setFormData({
                          ...formData,
                          religion: value,
                          otherReligionSpecify: "",
                        });
                      } else {
                        setFormData({ ...formData, religion: value });
                      }
                    }}
                    placeholder={{ label: "Select Religion", value: "" }}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                  />
                </View>

                {formData.religion === "Other" ? (
                  <>
                    <AppText style={styles.label}>
                      Specify Other Religion{" "}
                      <AppText style={{ color: "#5879A5" }}>*</AppText>
                    </AppText>
                    <TextInput
                      style={styles.input}
                      onChangeText={(text) =>
                        setFormData({ ...formData, otherReligionSpecify: text })
                      }
                      value={formData.otherReligionSpecify}
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
                      onChangeText={(text) =>
                        setFormData({ ...formData, height: text })
                      }
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
                      onChangeText={(text) =>
                        setFormData({ ...formData, weight: text })
                      }
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
                      <AppText style={{ color: "#5879A5" }}>*</AppText>
                    </AppText>
                    <TextInput
                      style={styles.input}
                      onChangeText={(text) =>
                        handleDietSpecifyChange(text, "ngt")
                      }
                      value={formData.ngtSpecify}
                      placeholder="e.g., Formula"
                    />
                  </>
                ) : null}

                {formData.diet.startsWith("other:") ? (
                  <>
                    <AppText style={styles.label}>
                      Specify Other Diet{" "}
                      <AppText style={{ color: "#5879A5" }}>*</AppText>
                    </AppText>
                    <TextInput
                      style={styles.input}
                      onChangeText={(text) =>
                        handleDietSpecifyChange(text, "other")
                      }
                      value={formData.otherDietSpecify}
                      placeholder="Please specify the diet"
                    />
                  </>
                ) : null}

                <AppText style={styles.label}>
                  Contact Number{" "}
                  <AppText style={{ color: "#5879A5" }}>*</AppText>
                </AppText>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) =>
                    setFormData({ ...formData, phoneNumber: text })
                  }
                />

                <AppText style={styles.label}>
                  Bed Number <AppText style={{ color: "#5879A5" }}>*</AppText>
                </AppText>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) =>
                    setFormData({ ...formData, bedNumber: text })
                  }
                />

                <AppText style={styles.label}>
                  Room Number <AppText style={{ color: "#5879A5" }}>*</AppText>
                </AppText>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) =>
                    setFormData({ ...formData, roomNumber: text })
                  }
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
                  onChangeText={(text) =>
                    setFormData({ ...formData, chiefComplaint: text })
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
                  onChangeText={(text) =>
                    setFormData({ ...formData, admittingDiagnosis: text })
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
                  onChangeText={(text) =>
                    setFormData({ ...formData, finalDiagnosis: text })
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
                  onChangeText={(text) =>
                    setFormData({ ...formData, emergencyFirstName: text })
                  }
                />
                <AppText style={styles.label}>
                  Surname <AppText style={{ color: "#5879A5" }}>*</AppText>
                </AppText>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) =>
                    setFormData({ ...formData, emergencySurname: text })
                  }
                />
                <AppText style={styles.label}>
                  Relation to Patient{" "}
                  <AppText style={{ color: "#5879A5" }}>*</AppText>
                </AppText>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) =>
                    setFormData({ ...formData, relation: text })
                  }
                />
                <AppText style={styles.label}>
                  Contact Number{" "}
                  <AppText style={{ color: "#5879A5" }}>*</AppText>
                </AppText>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) =>
                    setFormData({ ...formData, emergencyPhone: text })
                  }
                />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => handleNavigate("/directory")}
                style={[styles.button, styles.leaveButton]}
              >
                <AppText style={styles.buttonText}>Cancel</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleRegister}
                style={[styles.button, styles.stayButton]}
              >
                <AppText style={styles.buttonText}>Register Patient</AppText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Cancel Confirmation Modal */}
          <Modal visible={modalVisible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <AppText style={styles.modalTitle}>
                  Cancel Patient Registration
                </AppText>
                <AppText style={styles.modalMessage}>
                  Are you sure you want to cancel patient registration?
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
                      router.push("/directory");
                    }}
                  >
                    <AppText style={styles.modalButtonText}>Leave</AppText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <Modal visible={warningModalVisible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <AppText style={styles.modalTitle}>Incomplete Form</AppText>
                <AppText style={styles.modalMessage}>
                  {registrationSuccessMessage}
                </AppText>
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.stayButton]}
                    onPress={() => {
                      setWarningModalVisible(false);
                      handleRegister(); // Consider if you want to attempt registration with missing fields
                    }}
                  >
                    <AppText style={styles.modalButtonText}>Proceed</AppText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.leaveButton]}
                    onPress={() => setWarningModalVisible(false)}
                  >
                    <AppText style={styles.modalButtonText}>Go Back</AppText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Patient Registered Successfully Alert */}
          <CustomAlert
            visible={registrationSuccessVisible}
            message={registrationSuccessMessage}
            onClose={() => {
              setRegistrationSuccessVisible(false);
              router.push("/directory"); // Redirect after successful registration
            }}
          />
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
