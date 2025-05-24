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
    return <Text>Loading patient details...</Text>;
  }

  return (
    <View style={styles.container}>
      <Sidebar />
      <ScrollView style={[styles.mainContent, { marginLeft: sidebarWidth }]}>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/directory")}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.UpdateButton}
            onPress={() =>
              router.push(`/updatepatient?patient_number=${patient_number}`)
            }
          >
            <Text style={styles.buttonText}>Update Patient</Text>
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
            <Text style={styles.deactbuttonText}>Archive Patient</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.patientId}>
           PATIENT ID: {patient?.patient_number} |{" "}
                    {patient?.last_name?.toUpperCase()},{patient?.first_name}
        </Text>
        
        <View style={styles.infoContainer}>
          <View style={styles.detailsSection}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Patient Details</Text>
              <Text style={styles.boldLabel}>Name</Text>
              <Text>
                {patient?.last_name?.toUpperCase()}, {patient?.first_name}{" "}
                {patient?.middle_name}{" "}
              </Text>
              <Text style={styles.boldLabel}>Sex</Text>
              <Text>{patient?.sex}</Text>
              <Text style={styles.boldLabel}>Birth Date</Text>
              <Text>{patient?.date_of_birth}</Text>
              <Text style={styles.boldLabel}>Age</Text>
              <Text>{patient?.age}</Text>
              <Text style={styles.boldLabel}>Blood Type</Text>
              <Text>{patient?.blood_group}</Text>
            </View>
          </View>

          <View style={styles.dividers} />

          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}> </Text>
            <View style={styles.section}>
              <Text style={styles.boldLabel}>Religion</Text>
              <Text>{patient?.religion}</Text>
              <Text style={styles.boldLabel}>Height</Text>
              <Text>{patient?.height}</Text>
              <Text style={styles.boldLabel}>Weight</Text>
              <Text>{patient?.weight}</Text>
              <Text style={styles.boldLabel}>Diet</Text>
              <Text>{patient?.diet}</Text>
              <Text style={styles.boldLabel}>Contact Details</Text>
              <Text>{patient?.contact_number}</Text>
            </View>
          </View>

          <View style={styles.dividers} />

          <View style={styles.subsdetailsSection}>
            <Text style={styles.sectionTitle}> </Text>
            <View style={styles.section}>
              <Text style={styles.boldLabel}>Room No</Text>
              <Text>{patient?.room_number}</Text>
              <Text style={styles.boldLabel}>Chief Complaint/s</Text>
              <Text>{patient?.chief_complaint}</Text>
              <Text style={styles.boldLabel}>Admitting Diagnosis</Text>
              <Text>{patient?.admitting_diagnosis}</Text>
              <Text style={styles.boldLabel}>Final Diagnosis</Text>
              <Text>{patient?.Final_diagnosis}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.subdetailsSection}>
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
                                  <Text
                                    style={[
                                      styles.menuItemText,
                                      styles.updateText,
                                    ]}
                                  >
                                    Update
                                  </Text>
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
                                  <Text
                                    style={[
                                      styles.menuItemText,
                                      styles.deleteText,
                                    ]}
                                  >
                                    Archive
                                  </Text>
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
  );
}