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
import styles from "./updatepatientstyle"; // Assuming you have this file

export default function UpdatePatientScreen() {
  const router = useRouter();
  const { patient_number } = useLocalSearchParams(); // Get the patient number from the route params
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
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
            emergencyFirstName: data.emergency_contact?.first_name || "",
            emergencySurname: data.emergency_contact?.last_name || "",
            relation: data.emergency_contact?.relation_to_patient || "",
            emergencyPhone: data.emergency_contact?.contact_number || "",
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
            date_of_birth: `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`,
            contact_number: formData.phoneNumber,
            bed_number: formData.bedNumber
              ? parseInt(formData.bedNumber)
              : null,
            room_number: formData.roomNumber
              ? parseInt(formData.roomNumber)
              : null,
            age: formData.age ? parseInt(formData.age) : null,
            emergency_contact: {
              first_name: formData.emergencyFirstName,
              last_name: formData.emergencySurname,
              relation_to_patient: formData.relation,
              contact_number: formData.emergencyPhone,
            },
          }),
        }
      );

      if (response.ok) {    
        router.push("/viewpatient?patient_number=" + patient_number); 
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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formContainer}>
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>Patient Details</Text>
              <Text style={styles.label}>First Name</Text>
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
              <Text style={styles.label}>Surname</Text>
              <TextInput
                style={styles.input}
                value={formData.surname}
                onChangeText={(text) => handleInputChange("surname", text)}
              />

              <Text style={styles.label}>Date of Birth</Text>
              <View style={styles.dobContainer}>
                <RNPickerSelect
                  items={months}
                  value={formData.birthMonth}
                  onValueChange={(value) =>
                    handleInputChange("birthMonth", value)
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
                    handleInputChange("birthDay", value)
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
                    handleInputChange("birthYear", value)
                  }
                  placeholder={{ label: "YYYY", value: "" }}
                  style={{
                    inputAndroid: styles.dobSelect,
                    inputIOS: styles.dobSelect,
                  }}
                />
              </View>

              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={formData.phoneNumber}
                onChangeText={(text) => handleInputChange("phoneNumber", text)}
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>Bed Number</Text>
              <TextInput
                style={styles.input}
                value={formData.bedNumber}
                onChangeText={(text) => handleInputChange("bedNumber", text)}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Room Number</Text>
              <TextInput
                style={styles.input}
                value={formData.roomNumber}
                onChangeText={(text) => handleInputChange("roomNumber", text)}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                value={formData.age}
                editable={false}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>Emergency Contact Details</Text>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                value={formData.emergencyFirstName}
                onChangeText={(text) =>
                  handleInputChange("emergencyFirstName", text)
                }
              />
              <Text style={styles.label}>Surname</Text>
              <TextInput
                style={styles.input}
                value={formData.emergencySurname}
                onChangeText={(text) =>
                  handleInputChange("emergencySurname", text)
                }
              />
              <Text style={styles.label}>Relation to Patient</Text>
              <TextInput
                style={styles.input}
                value={formData.relation}
                onChangeText={(text) => handleInputChange("relation", text)}
              />
              <Text style={styles.label}>Phone Number</Text>
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
              onPress={() => router.push("/viewpatient?patient_number=" + patient_number)}
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
        </ScrollView>
      </View>
    </View>
  );
}
