import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import { useRouter } from "expo-router";
import Sidebar from "./components/sidebar";
import RNPickerSelect from "react-native-picker-select";
import styles from "./registerstyle";

export default function RegisterNewPatient() {
  const router = useRouter();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    surname: "",
    birthMonth: "",
    birthDay: "",
    birthYear: "",
    phoneNumber: "",
    bedNumber: "",
    roomNumber: "",
    age: "",
    emergencyFirstName: "",
    emergencySurname: "",
    relation: "",
    emergencyPhone: "",
    gender: "",
    religion: "",
    height: "",
    weight: "",
    bloodType: "",
    chiefComplaint: "",
    diagnosis: "",
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [warningModalVisible, setWarningModalVisible] = useState(false);
  const isFormFilled = Object.values(formData).some((value) => value !== "");
  const isFormComplete = Object.values(formData).every(
    (value) => typeof value === "string" ? value.trim() !== "" : value !== ""
  );

  const allowedDestinations = ["/directory", "/another-allowed-path"]; // Add allowed destinations here

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

  const days = Array.from({ length: 31 }, (_, index) => ({
    label: (index + 1).toString().padStart(2, "0"),
    value: (index + 1).toString().padStart(2, "0"),
  }));

  const years = Array.from({ length: 100 }, (_, index) => ({
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
      try {
        const response = await fetch("http://127.0.0.1:8000/api/patients/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: formData.firstName,
            middle_name: formData.middleName,
            last_name: formData.surname,
            gender: formData.gender,
            religion: formData.religion, 
            height: formData.height,
            weight: formData.weight,
            blood_type: formData.bloodType,
            date_of_birth: `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`,
            contact_number: formData.phoneNumber,
            bed_number: formData.bedNumber,
            room_number: formData.roomNumber,
            age: formData.age,
            emergency_contact: {
              first_name: formData.emergencyFirstName,
              last_name: formData.emergencySurname,
              relation_to_patient: formData.relation,
              contact_number: formData.emergencyPhone,
            
            },
          }),
        });

        if (response.ok) {
          router.push("/directory");
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
              <RNPickerSelect
                items={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                ]}
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData({ ...formData, gender: value })
                }
                placeholder={{ label: "Select Sex", value: "" }}
                style={{
                  inputAndroid: styles.input,
                  inputIOS: styles.input,
                }}
              />

              <Text style={styles.label}>Religion</Text>
                <RNPickerSelect
                  items={[
                    { label: "Roman Catholic", value: "Catholic" },
                    { label: "Christianity", value: "Christianity" },
                    { label: "Islam", value: "Islam" },
                    { label: "Hinduism", value: "Hinduism" },
                    { label: "Buddhism", value: "Buddhism" },
                    { label: "Judaism", value: "Judaism" },
                    { label: "Atheism", value: "Atheism" },
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
                  }}
                />
           <View style={styles.inlineContainer}>
            <View style={styles.inlineItem}>
              <Text style={styles.label}>Height</Text>
              <View style={styles.heightRow}>
                <View style={styles.heightInputContainer}>
                  <TextInput
                    style={styles.heightInput}
                    keyboardType="numeric"
                    placeholder=" "
                    value={formData.height}
                    onChangeText={(text) => setFormData({ ...formData, height: text })}
                  />
                  <Text style={styles.unitLabel}>meters</Text>
                </View>
              </View>
            </View>

            <View style={styles.inlineItem}>
              <Text style={styles.label}>Weight</Text>
              <View style={styles.weightRow}>
                <View style={styles.weightInputContainer}>
                  <TextInput
                    style={styles.weightInput}
                    keyboardType="numeric"
                    placeholder=" "
                    value={formData.weight}
                    onChangeText={(text) => setFormData({ ...formData, weight: text })}
                  />
                  <Text style={styles.unitLabel}>kg</Text>
                </View>
              </View>
            </View>
          </View>
                    
            <Text style={styles.label}>Blood Type</Text>
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
              onValueChange={(value) => setFormData({ ...formData, bloodType: value })}
              placeholder={{ label: "Select Blood Type", value: "" }}
              style={{
                inputAndroid: styles.input,
                inputIOS: styles.input,
              }}
            />
            
            <Text style={styles.label}>Date of Birth</Text>
            <View style={styles.dobContainer}>
              <RNPickerSelect
                items={months}
                value={formData.birthMonth}
                onValueChange={(value) =>
                  setFormData({ ...formData, birthMonth: value })
                }
                placeholder={{ label: "MM", value: "" }}
                style={{
                  inputAndroid: styles.dobSelect,
                  inputIOS: styles.dobSelect,
                }}
              />
              <RNPickerSelect
                items={days}
                value={formData.birthDay}
                onValueChange={(value) =>
                  setFormData({ ...formData, birthDay: value })
                }
                placeholder={{ label: "DD", value: "" }}
                style={{
                  inputAndroid: styles.dobSelect,
                  inputIOS: styles.dobSelect,
                }}
              />
              <RNPickerSelect
                items={years}
                value={formData.birthYear}
                onValueChange={(value) =>
                  setFormData({ ...formData, birthYear: value })
                }
                placeholder={{ label: "YYYY", value: "" }}
                style={{
                  inputAndroid: styles.dobSelect,
                  inputIOS: styles.dobSelect,
                }}
              />
            </View>

            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.ageInput}
              value={formData.age.toString()}
              editable={false}
            />
          </View>

          <View style={styles.divider} />
          <View style={styles.column}>

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
                  router.push("/directory");
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
    </View>
  );
}