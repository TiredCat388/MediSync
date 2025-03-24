import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from "react-native";
import { DataTable, Button } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from 'expo-router';
import Sidebar from './components/sidebar';

const { width } = Dimensions.get('window');
const isTablet = width > 900;
const sidebarWidth = 70;

export default function PatientDetails() {
  const router = useRouter();
  const { patient_number } = useLocalSearchParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMedications, setShowMedications] = useState(false);

  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowPress = (id) => {
    setSelectedRow(id);
  };

  useEffect(() => {
    fetchPatientDetails();
  }, [patient_number]);

  const fetchPatientDetails = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/patients/by-number/${patient_number}/`);
      if (!response.ok) {
        throw new Error('Patient not found');
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

  const medicationData = [
    { id: 1, name: "Aspirin", time: "8:00 AM", notes: ["Take with food"] },
    { id: 2, name: "Ibuprofen", time: "12:00 PM", notes: ["Avoid alcohol"] },
    { id: 3, name: "Paracetamol", time: "6:00 PM", notes: ["Drink plenty of water", "More text", "Other comments that may be longer than simple phrases or contain specific instructions."] },
    { id: 4, name: "Aspirin", time: "8:00 AM", notes: ["Take with food"] },
    { id: 5, name: "Ibuprofen", time: "12:00 PM", notes: ["Avoid alcohol"] },
    { id: 6, name: "Paracetamol", time: "6:00 PM", notes: ["Drink plenty of water"] },
    { id: 7, name: "Aspirin", time: "8:00 AM", notes: ["Take with food"] },
    { id: 8, name: "Ibuprofen", time: "12:00 PM", notes: ["Avoid alcohol"] },
    { id: 9, name: "Paracetamol", time: "6:00 PM", notes: ["Drink plenty of water"] },
    { id: 10, name: "Aspirin", time: "8:00 AM", notes: ["Take with food"] },
    { id: 11, name: "Ibuprofen", time: "12:00 PM", notes: ["Avoid alcohol"] },
    { id: 12, name: "Paracetamol", time: "6:00 PM", notes: ["Drink plenty of water"] },
  ];

  if (loading) {
    return <Text>Loading patient details...</Text>;
  }

  return (
    <View style={styles.container}>
      <Sidebar />
      <ScrollView style={[styles.mainContent, { marginLeft: sidebarWidth }]}> 
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push('/directory')}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deactivateButton}>
            <Text style={styles.deactbuttonText}>Deactivate Patient</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.patientId}>PATIENT ID: {patient?.patient_number}</Text>

        <View style={styles.infoContainer}>
          <View style={styles.detailsSection}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Patient Details</Text>
              <Text style={styles.boldLabel}>Name</Text>
              <Text>{patient?.last_name}, {patient?.first_name} {patient?.middle_name}</Text>
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
              <Text>{patient?.emergency_contact?.first_name} {patient?.emergency_contact?.last_name}</Text>
              <Text style={styles.boldLabel}>Relation to Patient</Text>
              <Text>{patient?.emergency_contact?.relation_to_patient}</Text>
              <Text style={styles.boldLabel}>Contact Details</Text>
              <Text>{patient?.emergency_contact?.contact_number}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.medicationToggleButton} onPress={() => setShowMedications(!showMedications)}>
          <Text style={styles.buttonText}>{showMedications ? "Hide" : "View"} Medication List</Text>
        </TouchableOpacity>

        {showMedications && (
          <View>
            <View style={[styles.tableContainer, { maxHeight: 350 }]}> 
              <ScrollView nestedScrollEnabled={true}>
                <DataTable>
                  <DataTable.Header style={styles.tableHeader}>
                    <DataTable.Title style={styles.columnId}>Schedule ID</DataTable.Title>
                    <DataTable.Title style={styles.columnName}>Medication</DataTable.Title>
                    <DataTable.Title style={styles.columnTime}>Time</DataTable.Title>
                    <DataTable.Title style={styles.columnNotes}>Notes</DataTable.Title>
                    <DataTable.Title style={styles.columnActions}></DataTable.Title>
                  </DataTable.Header>

                  {medicationData.map((item) => (
                    <DataTable.Row key={item.id} 
                    style={[
                      styles.row, 
                      selectedRow === item.id && styles.selectedRow
                    ]}
                    onPress={() => handleRowPress(item.id)}>
                      <DataTable.Cell style={styles.columnId}>{patient?.patient_number} - {item.id}</DataTable.Cell>
                      <DataTable.Cell style={styles.columnName}>{item.name}</DataTable.Cell>
                      <DataTable.Cell style={styles.columnTime}>{item.time}</DataTable.Cell>
                      <DataTable.Cell style={styles.columnNotes}>
                        <Text style={styles.notesText} numberOfLines={0}>
                          {item.notes.map(note => `• ${note}`).join("\n")}
                        </Text>
                      </DataTable.Cell>
                      <DataTable.Cell style={styles.columnActions}>
                        <Feather name="more-horizontal" size={20} color="black" />
                      </DataTable.Cell>
                    </DataTable.Row>
                  ))}
                </DataTable>
              </ScrollView>
            </View>

            <View style={styles.buttonWrapper}>
              <Button mode="contained" style={styles.addMedicationButton} onPress={() => router.push('/newmedsched')}>
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
  headerButtons: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 10 },
  backButton: { backgroundColor: "#ccc", padding: 10, borderRadius: 5, marginRight: 10 },
  deactivateButton: { backgroundColor: "#C15959", padding: 10, borderRadius: 5 },
  patientId: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  infoContainer: { flexDirection: "row", backgroundColor: "#e0e0e0", padding: 15, borderRadius: 8 },
  detailsSection: { flex: 1, paddingHorizontal: 10 },
  divider: { width: 1, backgroundColor: "gray", marginHorizontal: 10 },
  sectionTitle: { fontWeight: "bold", fontSize: 20, marginBottom: 5 },
  medicationToggleButton: { backgroundColor: "#ddd", padding: 10, alignItems: "center", borderRadius: 5, marginTop: 15 },
  buttonText: { fontWeight: "bold" },
  deactbuttonText: { fontWeight: "bold", color: 'white' },
  tableContainer: { marginTop: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, maxHeight: 500, overflow: "visible" },
  tableHeader: { backgroundColor: "#ddd" },
  row: { borderBottomWidth: 1, borderColor: "#ccc" },
  buttonWrapper: { alignItems: "flex-end", marginTop: 10 },
  addMedicationButton: { backgroundColor: "#5879a5", paddingHorizontal: 10, borderRadius: 10 },
  columnActions: { flex: 1, justifyContent: "flex-end", alignItems: "flex-end" },
  columnNotes: { flex: 3},
});

