import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import { useRouter } from "expo-router";
import Sidebar from "./components/sidebar";
import RNPickerSelect from "react-native-picker-select";
import styles from "./registerstyle";
import CustomAlert from "./components/alert"; // Import CustomAlert

export default function RegisterNewPatient() {
  const router = useRouter();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    surname: "",
    sex: null,
    birthMonth: "",
    birthDay: "",
    birthYear: "",
    phoneNumber: "",
    bedNumber: "",
    roomNumber: "",
    age: "",
    bloodType: null,
    religion: null,
    height: "",
    weight: "",
    diet: "DAT", // Default to DAT
    ngtSpecify: "", // For specifying NGT details
    otherDietSpecify: "", // For specifying other diet details
    emergencyFirstName: "",
    emergencySurname: "",
    relation: "",
    emergencyPhone: "",
    chiefComplaint: "",
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
  const isFormComplete = Object.values(formData).every((value) =>
    typeof value === "string"
      ? value.trim() !== ""
      : value !== null && value !== ""
  );

  const allowedDestinations = ["/directory", "/another-allowed-path"]; // Add allowed destinations here

  const months = Array.from({ length: 12 }, (_, index) => ({
    label: (index + 1).toString().padStart(2, "0"),
    value: (index + 1).toString().padStart(2, "0"),
  }));

  const days = Array.from({ length: 31 }, (_, index) => ({
    label: (index + 1).toString().padStart(2, "0"),
    value: (index + 1).toString().padStart(2, "0"),
  }));

  const years = Array.from({ length: 100 }, (_, index) => ({
    label: (new Date().getFullYear() - index).toString(),
    value: (new Date().getFullYear() - index).toString(),
  })).reverse();

  const dietOptions = [
    { label: "Therapeutic diet", value: "Therapeutic diet" },
    { label: "Clear liquid", value: "Clear liquid" },
    { label: "Full liquid", value: "Full liquid" },
    { label: "Soft diet", value: "Soft diet" },
    { label: "DAT (Diet As Tolerated)", value: "DAT" },
    { label: "NGT insertion", value: "NGT insertion" },
    { label: "NGT feeding", value: "NGT feeding" },
    {
      label: "Total parenteral Nutrition (TPN)",
      value: "Total parenteral Nutrition",
    },
    { label: "Others", value: "Others" },
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

  const handleRegister = async () => {
    if (!isFormComplete) {
      setWarningModalVisible(true);
    } else {
      const patientData = {
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.surname,
        sex: formData.sex,
        date_of_birth: `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`,
        contact_number: formData.phoneNumber,
        bed_number: formData.bedNumber,
        room_number: formData.roomNumber,
        age: formData.age,
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
        const response = await fetch("http://127.0.0.1:8000/api/patients/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(patientData),
        });

        if (response.ok) {
          setRegistrationSuccessMessage("Patient registered successfully!");
          setRegistrationSuccessVisible(true);
          // Optionally reset the form after successful registration
          setFormData({
            firstName: "",
            middleName: "",
            surname: "",
            sex: null,
            birthMonth: "",
            birthDay: "",
            birthYear: "",
            phoneNumber: "",
            bedNumber: "",
            roomNumber: "",
            age: "",
            bloodType: null,
            religion: null,
            height: "",
            weight: "",
            diet: "DAT", // Reset diet to default
            ngtSpecify: "",
            otherDietSpecify: "",
            emergencyFirstName: "",
            emergencySurname: "",
            relation: "",
            emergencyPhone: "",
            chiefComplaint: "",
          });
        } else {
          const errorData = await response.json();
          console.error("Error registering patient:", errorData);
        }
      } catch (error) {
        console.error("Error registering patient:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Sidebar onNavigate={handleNavigate} />
      <View
        style={[
          styles.contentContainer,
          { marginLeft: isSidebarExpanded ? 200 : 70 },
        ]}
      >
        <Text style={styles.screenTitle}>Register New Patient</Text>
        <View style={styles.formContainer}>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Patient Details</Text>
            <Text style={styles.label}>First Name</Text>
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
            <Text style={styles.label}>Surname</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) =>
                setFormData({ ...formData, surname: text })
              }
            />

            <Text style={styles.label}>Sex</Text>
            <View>
              <RNPickerSelect
                items={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                ]}
                value={formData.sex}
                onValueChange={(value) =>
                  setFormData({ ...formData, sex: value })
                }
                placeholder={{ label: "Select Sex", value: null }}
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

            <Text style={styles.label}>Date of Birth</Text>
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
                  placeholder={{ label: "MM", value: "" }}
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
                  placeholder={{ label: "DD", value: "" }}
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
                  placeholder={{ label: "YYYY", value: "" }}
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

            <Text style={styles.label}>Blood Type</Text>
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
                onValueChange={(value) =>
                  setFormData({ ...formData, bloodType: value })
                }
                placeholder={{ label: "Select Blood Type", value: null }}
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
                  // Add more religions as needed
                ]}
                value={formData.religion}
                onValueChange={(value) =>
                  setFormData({ ...formData, religion: value })
                }
                placeholder={{ label: "Select Religion", value: null }}
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

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.label}>Height (cm)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="e.g., 170"
                  value={formData.height}
                  onChangeText={(text) =>
                    setFormData({ ...formData, height: text })
                  }
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Weight (kg)</Text>
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

            <Text style={styles.label}>Diet</Text>
            <View>
              <RNPickerSelect
                items={dietOptions}
                value={formData.diet}
                onValueChange={(value) =>
                  setFormData({ ...formData, diet: value })
                }
                placeholder={{ label: "DAT (Diet as Tolerated)", value: "DAT" }} 
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

            {formData.diet === "NGT insertion" ||
            formData.diet === "NGT feeding" ? (
              <>
                <Text style={styles.label}>Specify NGT Details</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) =>
                    setFormData({ ...formData, ngtSpecify: text })
                  }
                  value={formData.ngtSpecify}
                  placeholder="e.g., Size, Insertion Date"
                />
              </>
            ) : null}

            {formData.diet === "Others" ? (
              <>
                <Text style={styles.label}>Specify Other Diet</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) =>
                    setFormData({ ...formData, otherDietSpecify: text })
                  }
                  value={formData.otherDietSpecify}
                  placeholder="Please specify the diet"
                />
              </>
            ) : null}

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) =>
                setFormData({ ...formData, phoneNumber: text })
              }
            />

            <Text style={styles.label}>Bed Number</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) =>
                setFormData({ ...formData, bedNumber: text })
              }
            />

            <Text style={styles.label}>Room Number</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) =>
                setFormData({ ...formData, roomNumber: text })
              }
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Emergency Contact Details</Text>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) =>
                setFormData({ ...formData, emergencyFirstName: text })
              }
            />
            <Text style={styles.label}>Surname</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) =>
                setFormData({ ...formData, emergencySurname: text })
              }
            />
            <Text style={styles.label}>Relation to Patient</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) =>
                setFormData({ ...formData, relation: text })
              }
            />
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) =>
                setFormData({ ...formData, emergencyPhone: text })
              }
            />

            <Text style={styles.sectionsubTitle}>
              Chief's Complaint/Admitting Diagnosis
            </Text>
            <TextInput
              style={[styles.input, { height: 300, textAlignVertical: "top" }]}
              multiline
              numberOfLines={4} // Optional: Specify the initial number of visible lines
              onChangeText={(text) =>
                setFormData({ ...formData, chiefComplaint: text })
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
              Some details are missing. Are you sure you want to proceed?
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
  );
}
