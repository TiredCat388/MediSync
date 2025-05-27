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
import { styles } from "./stylesheets/viewpatientstyle";
import Constants from "expo-constants";
import { SafeAreaView } from "react-native-safe-area-context";
import AppText from './components/AppText';

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
    fetchMedications(); 
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

  const archivePatient = async () => {
    try {
      const response = await fetch(
        `${BASE_API}/api/patients/${patient_number}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_archived: true,
          }),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Patient archived successfully");
        router.push("/archive");
      } else {
        Alert.alert("Error", "Failed to archive patient");
      }
    } catch (error) {
      console.error("Archive patient error:", error);
      Alert.alert("Error", "An error occurred while archiving the patient");
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

  const deleteSchedule = async (schedule_id, patient_number) => {
    try {
      const response = await fetch(
        `${BASE_API}/api/medications/${patient_number}/${schedule_id}/`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log("Deleted successfully");
        fetchMedications();
      } else {
        console.error("Failed to delete medication");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };
  if (loading) {
    return <AppText>Loading patient details...</AppText>;
  }

  const displayValue = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    (typeof value === "string" && value.trim() === "")
  ) {
    return <AppText>N/A</AppText>;
  }
  return value;
};

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>
      <Sidebar />
      <ScrollView style={[styles.mainContent, { marginLeft: sidebarWidth }]}>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/directory")}
          >
            <AppText style={styles.buttonText}>Back</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.UpdateButton}
            onPress={() =>
              router.push(`/updatepatient?patient_number=${patient_number}`)
            }
          >
            <AppText style={styles.buttonText}>Update Patient</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deactivateButton}
            onPress={async () => {
              try {
                // Assuming you have a function to update archive status
                await archivePatient(patient_number);
                Alert.alert("Success", "Patient has been archived.");
              } catch (error) {
                Alert.alert("Error", "Failed to archive patient.");
              }
            }}
          >
            <AppText style={styles.deactbuttonText}>Archive Patient</AppText>
          </TouchableOpacity>
        </View>

        <AppText style={styles.patientId}>
          PATIENT ID: {displayValue(patient?.patient_number)} |{" "}
          {displayValue(patient?.last_name?.toUpperCase())}, {displayValue(patient?.first_name)}
        </AppText>

        <View style={styles.infoContainer}>
          <View style={styles.detailsSection}>
            <View style={styles.section}>
              <AppText style={styles.sectionTitle}>Patient Details</AppText>
              <AppText style={styles.boldLabel}>Name</AppText>
              <AppText>
                {displayValue(patient?.last_name?.toUpperCase())}, {displayValue(patient?.first_name)}{" "}
                {displayValue(patient?.middle_name)
                  ? `${patient.middle_name.charAt(0)}.`
                  : ""}
              </AppText>
              <AppText style={styles.boldLabel}>Sex</AppText>
              <AppText>{displayValue(patient?.sex)}</AppText>
              <AppText style={styles.boldLabel}>Birth Date</AppText>
              <AppText>{displayValue(patient?.date_of_birth)}</AppText>
              <AppText style={styles.boldLabel}>Age</AppText>
              <AppText>{displayValue(patient?.age)}</AppText>
              <AppText style={styles.boldLabel}>Blood Type</AppText>
              <AppText>{displayValue(patient?.blood_group)}</AppText>
            </View>
          </View>

          <View style={styles.dividers} />

          <View style={styles.detailsSection}>
            <AppText style={styles.sectionTitle}> </AppText>
            <View style={styles.section}>
              <AppText style={styles.boldLabel}>Religion</AppText>
              <AppText>{displayValue(patient?.religion)}</AppText>
              <AppText style={styles.boldLabel}>Height (meters)</AppText>
              <AppText>{displayValue(patient?.height)}</AppText>
              <AppText style={styles.boldLabel}>Weight (kilograms)</AppText>
              <AppText>{displayValue(patient?.weight)}</AppText>
              <AppText style={styles.boldLabel}>BMI (kg/m²)</AppText>
              <AppText>{displayValue(patient?.BMI)}</AppText>
              <AppText style={styles.boldLabel}>Diet</AppText>
              <AppText>{displayValue(patient?.diet)}</AppText>
            </View>
          </View>

          <View style={styles.dividers} />

          <View style={styles.subsdetailsSection}>
            <AppText style={styles.sectionTitle}> </AppText>
            <View style={styles.section}>
              <AppText style={styles.boldLabel}>Contact Details</AppText>
              <AppText>{displayValue(patient?.contact_number)}</AppText>
              <AppText style={styles.boldLabel}>Room No</AppText>
              <AppText>{displayValue(patient?.room_number)}</AppText>
              <AppText style={styles.boldLabel}>Chief Complaint/s</AppText>
              <AppText>{displayValue(patient?.chief_complaint)}</AppText>
              <AppText style={styles.boldLabel}>Admitting Diagnosis</AppText>
              <AppText>{displayValue(patient?.admitting_diagnosis)}</AppText>
              <AppText style={styles.boldLabel}>Final Diagnosis</AppText>
              <AppText>{displayValue(patient?.Final_diagnosis)}</AppText>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.subdetailsSection}>
            <View style={styles.section}>
              <AppText style={styles.sectionTitle}>Emergency Contact Details</AppText>
              <AppText style={styles.boldLabel}>Name</AppText>
              <AppText>
                {displayValue(patient?.emergency_contact?.first_name)}{" "}
                {displayValue(patient?.emergency_contact?.last_name)}
              </AppText>
              <AppText style={styles.boldLabel}>Relation to Patient</AppText>
              <AppText>{displayValue(patient?.emergency_contact?.relation_to_patient)}</AppText>
              <AppText style={styles.boldLabel}>Contact Details</AppText>
              <AppText>{displayValue(patient?.emergency_contact?.contact_number)}</AppText>
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
                          <View style={{ position: "relative" }}>
                            <TouchableOpacity
                              style={styles.customizeButton}
                              onPress={() =>
                                setOpenMenuId(
                                  openMenuId === item.schedule_id
                                    ? null
                                    : item.schedule_id
                                )
                              }
                            >
                              <Feather
                                name="more-horizontal"
                                size={20}
                                color="black"
                              />
                            </TouchableOpacity>

                            {openMenuId === item.schedule_id && (
                              <View style={styles.popupMenu}>
                                <TouchableOpacity
                                  style={styles.menuItem}
                                  onPress={() => {
                                    router.push(
                                      `/updatemed?schedule_id=${item.schedule_id}&patient_number=${patient_number}`
                                    );
                                  }}
                                >
                                  <AppText
                                    style={[
                                      styles.menuItemText,
                                      styles.updateText,
                                    ]}
                                  >
                                    Update
                                  </AppText>
                                </TouchableOpacity>

                                <TouchableOpacity
                                  style={styles.menuItem}
                                  onPress={() => {
                                    setOpenMenuId(null);
                                    deleteSchedule(
                                      item.schedule_id,
                                      patient_number
                                    );
                                  }}
                                >
                                  <AppText
                                    style={[
                                      styles.menuItemText,
                                      styles.deleteText,
                                    ]}
                                  >
                                    Archive
                                  </AppText>
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        </DataTable.Cell>
                      </DataTable.Row>
                    </View>
                  ))}
                </DataTable>
              </ScrollView>
            </View>

            <View style={styles.buttonWrapper}>
              <Button
                mode="contained"
                style={styles.addMedicationButton}
                onPress={() =>
                  router.push(`/newmedsched?patient_number=${patient_number}`)
                }
              >
                Add Medication
              </Button>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
    </SafeAreaView>
  );
}