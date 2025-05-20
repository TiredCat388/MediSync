import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import { useRouter } from "expo-router";
import Sidebar from "./components/sidebar";
import RNPickerSelect from "react-native-picker-select";
import styles from "./registerstyle";
import CustomAlert from "./components/alert"; // Import CustomAlert
import { ScrollView } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Constants from 'expo-constants';

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
    ngtSpecify: "", // For specifying NGT details
    otherDietSpecify: "", // For specifying other diet details
    emergencyFirstName: "",
    emergencySurname: "",
    relation: "",
    emergencyPhone: "",
    chiefComplaint: "",
    admittingDiagnosis: "", // Add new field for admitting diagnosis
    finalDiagnosis: "", // Add new field for final diagnosis
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Sidebar onNavigate={handleNavigate} />
        <View style={[styles.contentContainer, { marginLeft: isSidebarExpanded ? 200 : 70 }]}>
          <Text style={styles.screenTitle}>Register New Patient</Text>
          <View style={styles.formContainer}>
            <ScrollView style={styles.column}>
              <Text style={styles.sectionTitle}>Patient Details <Text style={{ color: 'red', fontSize: 16 }}>* Required</Text>
              </Text>
              <Text style={styles.label}>
                First Name <Text style={{ color: 'red' }}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) =>
                  setFormData({ ...formData, firstName: text })
                }
              />
              <Text style={styles.label}>Middle Name</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) =>
                  setFormData({ ...formData, middleName: text })
                }
              />
              <Text style={styles.label}>Surname <Text style={{ color: 'red' }}>*</Text></Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) =>
                  setFormData({ ...formData, surname: text })
                }
              />

              <Text style={styles.label}>
              Sex <Text style={{ color: 'red' }}>*</Text>
              </Text>
              <View>
                <RNPickerSelect
                  items={[
                    { label: "Male", value: "M"},
                    { label: "Female", value: "F"},
                  ]}
                  value={formData.sex}
                  onValueChange={(value) =>
                    setFormData({ ...formData, sex: value })
                  }
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
                    onValueChange={(value) =>
                      setFormData({ ...formData, birthMonth: value })
                    }
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
                    onValueChange={(value) =>
                      setFormData({ ...formData, birthDay: value })
                    }
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
                <View style={{ flex: 1 }}>
                  <RNPickerSelect
                    items={years}
                    value={formData.birthYear}
                    onValueChange={(value) =>
                      setFormData({ ...formData, birthYear: value })
                    }
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

              <Text style={styles.label}>
              Blood Type <Text style={{ color: 'red' }}>*</Text>
              </Text>
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
                    { label: "Rhnull", value: "Rhnull"},
                  ]}
                  value={formData.bloodType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, bloodType: value })
                  }
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
                  onValueChange={(value) =>
                    setFormData({ ...formData, religion: value })
                  }
                  placeholder={{ label: "Select Religion", value: "" }}
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
                  <Text style={styles.label}>
                  Specify Other Religion <Text style={{ color: 'red' }}>*</Text>
                  </Text>
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
                style={{ flexDirection: "row", justifyContent: "space-between" }}
              >
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.label}>
                  Height (meters) <Text style={{ color: 'red' }}>*</Text>
                  </Text>
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
                  <Text style={styles.label}>
                  Weight (kg) <Text style={{ color: 'red' }}>*</Text>
                  </Text>
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

              <Text style={styles.label}>
              Diet <Text style={{ color: 'red' }}>*</Text>
              </Text>
              <View>
                <RNPickerSelect
                  items={dietOptions}
                  value={formData.diet.split(":")[0]}
                  onValueChange={handleDietChange}
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

              {formData.diet.startsWith("ngt:") ? (
                <>
                  <Text style={styles.label}>
                  Specify NGT Details <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={(text) => handleDietSpecifyChange(text, "ngt")}
                    value={formData.ngtSpecify}
                    placeholder="e.g., Formula"
                  />
                </>
              ) : null}

              {formData.diet.startsWith("other:") ? (
                <>
                  <Text style={styles.label}>
                  Specify Other Diet <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={(text) => handleDietSpecifyChange(text, "other")}
                    value={formData.otherDietSpecify}
                    placeholder="Please specify the diet"
                  />
                </>
              ) : null}

              <Text style={styles.label}>Contact Number <Text style={{ color: 'red' }}>*</Text></Text> 
              <TextInput
                style={styles.input}
                onChangeText={(text) =>
                  setFormData({ ...formData, phoneNumber: text })
                }
              />

              <Text style={styles.label}>
              Bed Number <Text style={{ color: 'red' }}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) =>
                  setFormData({ ...formData, bedNumber: text })
                }
              />

              <Text style={styles.label}>
              Room Number <Text style={{ color: 'red' }}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) =>
                  setFormData({ ...formData, roomNumber: text })
                }
              />

              <Text style={styles.label}>
              Chief Complaint/s <Text style={{ color: 'red' }}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, { height: 150, textAlignVertical: "top" }]}
                multiline
                numberOfLines={4}
                onChangeText={(text) =>
                  setFormData({ ...formData, chiefComplaint: text })
                }
              />

              <Text style={styles.label}>
              Admitting Diagnosis <Text style={{ color: 'red' }}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, { height: 150, textAlignVertical: "top" }]}
                multiline
                numberOfLines={4}
                onChangeText={(text) =>
                  setFormData({ ...formData, admittingDiagnosis: text })
                }
              />

              <Text style={styles.label}>Final Diagnosis</Text>
              <TextInput
                style={[styles.input, { height: 150, textAlignVertical: "top" }]}
                multiline
                numberOfLines={4}
                onChangeText={(text) =>
                  setFormData({ ...formData, finalDiagnosis: text })
                }
              />
            </ScrollView>

            <View style={styles.divider} />
            
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>Emergency Contact Details</Text>
              <Text style={styles.label}>
              First Name <Text style={{ color: 'red' }}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) =>
                  setFormData({ ...formData, emergencyFirstName: text })
                }
              />
              <Text style={styles.label}>Surname <Text style={{ color: 'red' }}>*</Text></Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) =>
                  setFormData({ ...formData, emergencySurname: text })
                }
              />
              <Text style={styles.label}>
              Relation to Patient <Text style={{ color: 'red' }}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) =>
                  setFormData({ ...formData, relation: text })
                }
              />
              <Text style={styles.label}>Contact Number <Text style={{ color: 'red' }}>*</Text></Text>
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
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleRegister}
              style={[styles.button, styles.stayButton]}
            >
              <Text style={styles.buttonText}>Register Patient</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cancel Confirmation Modal */}
        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Cancel Patient Registration</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to cancel patient registration?
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
                    router.push("/directory");
                  }}
                >
                  <Text style={styles.modalButtonText}>Leave</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={warningModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Incomplete Form</Text>
              <Text style={styles.modalMessage}>
                {registrationSuccessMessage}
              </Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.stayButton]}
                  onPress={() => {
                    setWarningModalVisible(false);
                    handleRegister(); // Consider if you want to attempt registration with missing fields
                  }}
                >
                  <Text style={styles.modalButtonText}>Proceed</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.leaveButton]}
                  onPress={() => setWarningModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Go Back</Text>
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
  );
}
