import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
} from "react-native";
import { DataTable, Button } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import Sidebar from "./components/sidebar";
import { Alert } from "react-native";
import { styles } from "./stylesheets/historystyle";
import Constants from 'expo-constants';
import { SafeAreaView } from "react-native-safe-area-context";
import AppText from './components/AppText';

const BASE_API = Constants.expoConfig.extra.BASE_API;

const { width } = Dimensions.get("window");
const isTablet = width > 900;
const sidebarWidth = 70;

const TESTING_PATIENT = {
  patient_number: "999999",
  first_name: "Archive",
  middle_name: "T",
  last_name: "Patient",
  sex: "Other",
  date_of_birth: "1990-01-01",
  age: 34,
  blood_group: "A+",
  religion: "None",
  height: "1.65",
  weight: "60",
  BMI: "22.0",
  diet: "Regular",
  contact_number: "09123456789",
  room_number: "N/A",
  chief_complaint: "Testing Archive",
  admitting_diagnosis: "Testing",
  Final_diagnosis: "Testing",
  emergency_contact: {
    first_name: "Jane",
    last_name: "Doe",
    relation_to_patient: "Sibling",
    contact_number: "09998887777",
  },
  is_archived: true,
  date_archived: new Date().toISOString(),
};

const TESTING_MEDICATIONS = [
  {
    schedule_id: 1,
    Medication_name: "TestMed 1",
    Medication_Time: "08:00 AM",
    Medication_notes: "Morning dose",
    patient_number: "999999",
  },
  {
    schedule_id: 2,
    Medication_name: "TestMed 2",
    Medication_Time: "12:00 PM",
    Medication_notes: "Noon dose",
    patient_number: "999999",
  },
  {
    schedule_id: 3,
    Medication_name: "TestMed 3",
    Medication_Time: "04:00 PM",
    Medication_notes: "Afternoon dose",
    patient_number: "999999",
  },
  {
    schedule_id: 4,
    Medication_name: "TestMed 4",
    Medication_Time: "08:00 PM",
    Medication_notes: "Evening dose",
    patient_number: "999999",
  },
  {
    schedule_id: 5,
    Medication_name: "TestMed 5",
    Medication_Time: "10:00 PM",
    Medication_notes: "Bedtime dose",
    patient_number: "999999",
  },
];

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
    if (patient_number === "999999") {
      setPatient(TESTING_PATIENT);
      setLoading(false);
      return;
    }
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
        router.push("/directory"); 
      } else {
        Alert.alert("Error", "Failed to activate patient");
      }
    } catch (error) {
      console.error("Activate patient error:", error);
      Alert.alert("Error", "An error occurred while activating the patient");
    }
  };

  const fetchMedications = async () => {
    if (patient_number === "999999") {
      setMedicationData(TESTING_MEDICATIONS);
      return;
    }
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
        setMedicationData([]);
      }
    } catch (err) {
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
    <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>
      <Sidebar />
      <ScrollView style={[styles.mainContent, { marginLeft: sidebarWidth }]}>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/archive")}
          >
            <AppText style={styles.buttonText}>Back</AppText>
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
            <AppText style={styles.buttonText}>Activate Patient</AppText>
          </TouchableOpacity>
        </View>

        <AppText style={styles.patientId}>
          PATIENT ID: {patient?.patient_number} |{" "}
          {patient?.last_name?.toUpperCase()}, {patient?.first_name}
        </AppText>

        <View style={styles.infoContainer}>
          <View style={styles.detailsSection}>
            <View style={styles.section}>
              <AppText style={styles.sectionTitle}>Patient Details</AppText>
              <AppText style={styles.boldLabel}>Name</AppText>
              <AppText style={styles.rowText}>
                {patient?.last_name?.toUpperCase()}, {patient?.first_name}{" "}
                {patient?.middle_name
                  ? `${patient.middle_name.charAt(0)}.`
                  : ""}
              </AppText>
              <AppText style={styles.boldLabel}>Sex</AppText>
              <AppText style={styles.rowText}>{patient?.sex}</AppText>
              <AppText style={styles.boldLabel}>Birth Date</AppText>
              <AppText style={styles.rowText}>{patient?.date_of_birth}</AppText>
              <AppText style={styles.boldLabel}>Age</AppText>
              <AppText style={styles.rowText}>{patient?.age}</AppText>
              <AppText style={styles.boldLabel}>Blood Type</AppText>
              <AppText style={styles.rowText}>{patient?.blood_group}</AppText>
            </View>
          </View>

          <View style={styles.dividers} />

          <View style={styles.detailsSection}>
            <AppText style={styles.sectionTitle}> </AppText>
            <View style={styles.section}>
              <AppText style={styles.boldLabel}>Religion</AppText>
              <AppText style={styles.rowText}>{patient?.religion}</AppText>
              <AppText style={styles.boldLabel}>Height</AppText>
              <AppText style={styles.rowText}>{patient?.height}</AppText>
              <AppText style={styles.boldLabel}>Weight</AppText>
              <AppText style={styles.rowText}>{patient?.weight}</AppText>
              <AppText style={styles.boldLabel}>Diet</AppText>
              <AppText style={styles.rowText}>{patient?.diet}</AppText>
              <AppText style={styles.boldLabel}>Contact Details</AppText>
              <AppText style={styles.rowText}>{patient?.contact_number}</AppText>
            </View>
          </View>

          <View style={styles.dividers} />

          <View style={styles.subsdetailsSection}>
            <AppText style={styles.sectionTitle}> </AppText>
            <View style={styles.section}>
              <AppText style={styles.boldLabel}>Room No</AppText>
              <AppText style={styles.rowText}>{patient?.room_number}</AppText>
              <AppText style={styles.boldLabel}>Chief Complaint/s</AppText>
              <AppText style={styles.rowText}>{patient?.chief_complaint}</AppText>
              <AppText style={styles.boldLabel}>Admitting Diagnosis</AppText>
              <AppText style={styles.rowText}>{patient?.admitting_diagnosis}</AppText>
              <AppText style={styles.boldLabel}>Final Diagnosis</AppText>
              <AppText style={styles.rowText}>{patient?.Final_diagnosis}</AppText>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.subdetailsSection}>
            <View style={styles.section}>
              <AppText style={styles.sectionTitle}>Emergency Contact Details</AppText>
              <AppText style={styles.boldLabel}>Name</AppText>
              <AppText style={styles.rowText}>
                {patient?.emergency_contact?.first_name}{" "}
                {patient?.emergency_contact?.last_name}
              </AppText>
              <AppText style={styles.boldLabel}>Relation to Patient</AppText>
              <AppText style={styles.rowText}>{patient?.emergency_contact?.relation_to_patient}</AppText>
              <AppText style={styles.boldLabel}>Contact Details</AppText>
              <AppText style={styles.rowText}>{patient?.emergency_contact?.contact_number}</AppText>
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
            <AppText style={styles.buttonText}>
              {showMedications ? "Hide" : "View"} Medication List
            </AppText>
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
                        <AppText style={styles.tableHeaderText}>Schedule ID</AppText>
                      </DataTable.Title>
                      <DataTable.Title style={styles.columnName}>
                        <AppText style={styles.tableHeaderText}>Medication Name</AppText>
                      </DataTable.Title>
                      <DataTable.Title style={styles.columnTime}>
                        <AppText style={styles.tableHeaderText}>Time</AppText>
                      </DataTable.Title>
                      <DataTable.Title style={styles.columnNotes}>
                        <AppText style={styles.tableHeaderText}>Notes</AppText>
                      </DataTable.Title>
                      <DataTable.Title style={styles.searchBarColumn}>
                        <TextInput
                          style={styles.searchInput}
                          placeholder="Search"
                          placeholderTextColor="#999999"
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
                          <AppText style={styles.rowText}>{item.schedule_id}</AppText>
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.columnName}>
                          <AppText style={styles.rowText}>{item.Medication_name}</AppText>
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.columnTime}>
                          <AppText style={styles.rowText}>{item.Medication_Time}</AppText>
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.columnNotes}>
                          <AppText style={styles.rowText}>{item.Medication_notes}</AppText>
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.columnActions}>
                          <View style={{ position: "relative" }} />
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
    </SafeAreaView>
  );
}
