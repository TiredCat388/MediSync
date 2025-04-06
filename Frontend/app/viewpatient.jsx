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


const { width } = Dimensions.get("window");
const isTablet = width > 900;
const sidebarWidth = 70;


export default function PatientDetails() {
  const router = useRouter();
  const { patient_number } = useLocalSearchParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  const [medicationData, setMedicationData] = useState([]);
  const [showMedications, setShowMedications] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Search bar state
  const [openMenuId, setOpenMenuId] = useState(null);



  useEffect(() => {
    fetchPatientDetails();
  }, [patient_number]);

  const fetchPatientDetails = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/patients/by-number/${patient_number}/`
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

  const fetchMedications = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/medications/?patient_number=${patient_number}`
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

  const deleteSchedule = async (scheduleId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/medications/${scheduleId}/`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log("Deleted successfully");
        // Optionally, refresh the medications list
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
          <TouchableOpacity style={styles.deactivateButton}>
            <Text style={styles.deactbuttonText}>Deactivate Patient</Text>
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
            <View
              style={[
                styles.tableContainer,
                { maxHeight: 350, overflow: "visible" },
              ]}
            >
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
                                    deleteSchedule(item.schedule_id);
                                  }}
                                >
                                  <Text
                                    style={[
                                      styles.menuItemText,
                                      styles.deleteText,
                                    ]}
                                  >
                                    Delete
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
                router.push(`/newmedsched?patient_number=${patient_number}`)}
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

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", backgroundColor: "#f0f0f0" },
  mainContent: { flex: 1, padding: 20, marginLeft: sidebarWidth },
  boldLabel: { fontWeight: "bold", fontSize: 16, marginTop: 10 },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  deactivateButton: {
    backgroundColor: "#C15959",
    padding: 10,
    borderRadius: 5,
  },
  patientId: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  infoContainer: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    padding: 15,
    borderRadius: 8,
  },
  detailsSection: { flex: 1, paddingHorizontal: 10 },
  divider: { width: 1, backgroundColor: "gray", marginHorizontal: 10 },
  sectionTitle: { fontWeight: "bold", fontSize: 20, marginBottom: 5 },
  medicationToggleButton: {
    backgroundColor: "#5879a5",
    padding: 10,
    alignItems: "flex-start", 
    borderRadius: 5,
    marginTop: 15,
    alignSelf: "flex-start", 
    marginLeft: 0, 
  },
  buttonText: {
    fontWeight: "bold",
    color: "white", 
  },
  deactbuttonText: { fontWeight: "bold", color: "white" },
  tableContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    maxHeight: 500,
    overflow: "visible",
  },
  tableHeader: {
    backgroundColor: "#f6f6f6",
    flexDirection: "row",
    alignItems: "center",
  },
  row: { borderBottomWidth: 2, borderColor: "#ccc" },
  buttonWrapper: { alignItems: "flex-end", marginTop: 10 },
  addMedicationButton: {
    backgroundColor: "#5879a5",
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  searchInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    fontSize: 14,
    width: 140,
    height: 24.5,
  },

  columnId: {
    flex: 1.2,
  },

  columnName: {
    flex: 1.2,
  },

  columnTime: {
    flex: 1.2,
  },

  columnNotes: {
    flex: 3,
  },

  columnActions: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },

  popupMenu: {
    position: "absolute",
    top: 30,
    right: 0,
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    elevation: 10, 
    zIndex: 9999, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: 130,
  },

  menuItem: {
    paddingVertical: 8,
  },

  menuItemText: {
    fontSize: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },

  updateText: {
    color: "#000", 
    fontWeight: "500",
  },

  deleteText: {
    color: "#", 
    fontWeight: "500",
  },
});
