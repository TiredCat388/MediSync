import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
} from "react-native";
import { DataTable, Button } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import Sidebar from "./components/sidebar";
import { Feather } from "@expo/vector-icons";
import { Alert } from "react-native";
import { styles } from "./historystyle";
import { useNavigation } from "@react-navigation/native";
import Constants from 'expo-constants';

const BASE_API = Constants.expoConfig.extra.BASE_API;

const { width } = Dimensions.get("window");
const isTablet = width > 900;
const sidebarWidth = 70;

export default function PatientDetails() {
  const router = useRouter();
  const { patient_number, schedule_id } = useLocalSearchParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  const [medicationData, setMedicationData] = useState([]);
  const [showMedications, setShowMedications] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // Search bar state
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    fetchPatientDetails();
    fetchMedications(); // load meds right away
  }, [patient_number]);

  const fetchPatientDetails = async () => {
    try {
      const response = await fetch(
        `${BASE_API}/api/patients/by-number/${patient_number}/`
      );
      if (!response.ok) {
        throw new Error("Patient not found");
      }
      const data = await response.json();
      setPatient(data);
    } catch (err) {
      console.error("Error fetching patient:", err.message);
      setPatient({
        patient_number: patient_number || "12345",
        first_name: "John",
        middle_name: "Adam",
        last_name: "Doe",
        date_of_birth: "1990-01-01",
        contact_number: "123-456-7890",
        room_number: "101",
        emergency_contact: {
          first_name: "Jane",
          last_name: "Doe",
          relation_to_patient: "Sister",
          contact_number: "987-654-3210",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const activatePatient = async (patient_number) => {
    try {
      const response = await fetch(
        `${BASE_API}/api/patients/${patient_number}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_archived: false,
          }),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Patient activated successfully");
        router.push("/directory"); // Navigate back to the directory
      } else {
        Alert.alert("Error", "Failed to activate patient");
      }
    } catch (error) {
      console.error("Activate patient error:", error);
      Alert.alert("Error", "An error occurred while activating the patient");
    }
  };

  const fetchMedications = async () => {
    try {
      const response = await fetch(
        `${BASE_API}/api/medications/?patient_number=${patient_number}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch medications");
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setMedicationData(data);
      } else {
        console.error("Unexpected API response format:", data);
        setMedicationData([]);
      }
    } catch (err) {
      console.error("Error fetching medications:", err.message);
      setMedicationData([]);
    }
  };

  const filteredMedications = medicationData.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.schedule_id.toString().includes(query) ||
      item.Medication_name.toLowerCase().includes(query)
    );
  });

  return (
    <View style={styles.container}>
      <Sidebar />
      <ScrollView style={[styles.mainContent, { marginLeft: sidebarWidth }]}>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/archive")}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.activateButton}
            onPress={async () => {
              try {
                await activatePatient(patient_number);
              } catch (error) {
                Alert.alert("Error", "Failed to activate patient.");
              }
            }}
          >
            <Text style={styles.activatebuttonText}>Activate Patient</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.patientId}>
          PATIENT ID: {patient?.patient_number}
        </Text>

        <View style={styles.infoContainer}>
          <View style={styles.detailsSection}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Patient Details</Text>
              <Text style={styles.boldLabel}>Name</Text>
              <Text>
                {patient?.last_name}, {patient?.first_name}{" "}
                {patient?.middle_name}
              </Text>
              <Text style={styles.boldLabel}>Birth Date</Text>
              <Text>{patient?.date_of_birth}</Text>
              <Text style={styles.boldLabel}>Contact Details</Text>
              <Text>{patient?.contact_number}</Text>
              <Text style={styles.boldLabel}>Room No</Text>
              <Text>{patient?.room_number}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsSection}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Emergency Contact Details</Text>
              <Text style={styles.boldLabel}>Name</Text>
              <Text>
                {patient?.emergency_contact?.first_name}{" "}
                {patient?.emergency_contact?.last_name}
              </Text>
              <Text style={styles.boldLabel}>Relation to Patient</Text>
              <Text>{patient?.emergency_contact?.relation_to_patient}</Text>
              <Text style={styles.boldLabel}>Contact Details</Text>
              <Text>{patient?.emergency_contact?.contact_number}</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 15,
          }}
        >
          <TouchableOpacity
            style={styles.medicationToggleButton}
            onPress={async () => {
              if (!showMedications) {
                await fetchMedications();
              }
              setShowMedications(!showMedications);
            }}
          >
            <Text style={styles.buttonText}>
              {showMedications ? "Hide" : "View"} Medication List
            </Text>
          </TouchableOpacity>
        </View>

        {showMedications && (
          <View>
            <View style={[styles.tableContainer]}>
              <ScrollView nestedScrollEnabled={true}>
                <DataTable>
                  <View style={styles.headerRowContainer}>
                    <DataTable.Header style={styles.tableHeader}>
                      <DataTable.Title style={styles.columnId}>
                        Schedule ID
                      </DataTable.Title>
                      <DataTable.Title style={styles.columnName}>
                        Medication Name
                      </DataTable.Title>
                      <DataTable.Title style={styles.columnTime}>
                        Time
                      </DataTable.Title>
                      <DataTable.Title style={styles.columnNotes}>
                        Notes
                      </DataTable.Title>
                      <DataTable.Title style={styles.searchBarColumn}>
                        <TextInput
                          style={styles.searchInput}
                          placeholder="Search"
                          placeholderTextColor="#888"
                          value={searchQuery}
                          onChangeText={setSearchQuery}
                        />
                      </DataTable.Title>
                    </DataTable.Header>
                  </View>

                  {filteredMedications.map((item) => (
                    <View
                      key={item.schedule_id}
                      style={{
                        zIndex: openMenuId === item.schedule_id ? 10 : 0,
                      }}
                    >
                      <DataTable.Row style={styles.row}>
                        <DataTable.Cell style={styles.columnId}>
                          {item.schedule_id}
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.columnName}>
                          {item.Medication_name}
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.columnTime}>
                          {item.Medication_Time}
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.columnNotes}>
                          {item.Medication_notes}
                        </DataTable.Cell>

                        <DataTable.Cell style={styles.columnActions}>
                          <View style={{ position: "relative" }}></View>
                        </DataTable.Cell>
                      </DataTable.Row>
                    </View>
                  ))}
                </DataTable>
              </ScrollView>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
