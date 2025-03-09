import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from 'expo-router';
import Sidebar from './components/sidebar';

export default function PatientDetails() {
  const router = useRouter();
  const { patient_number } = useLocalSearchParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Sidebar />
        <View style={styles.mainContent}>
          <Text>Loading patient details...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Sidebar />
        <View style={styles.mainContent}>
          <Text>Error: {error}</Text>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.push('/directory')}
          >
            <Text style={styles.buttonText}>Back to Directory</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Sidebar />

      {/* Main Content */}
      <ScrollView style={styles.mainContent}>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.push('/directory')}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deactivateButton}>
            <Text style={styles.buttonText}>Deactivate Patient</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.patientId}>PATIENT ID: {patient?.patient_number}</Text>
        
        <View style={styles.infoContainer}>
          <View style={styles.sectionContainer}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Patient Details</Text>
              <Text>Name: {patient?.last_name}, {patient?.first_name} {patient?.middle_name}</Text>
              <Text>Birth Date: {patient?.date_of_birth}</Text>
              <Text>Contact Details: {patient?.contact_number}</Text>
            </View>
            <View style={styles.section}>
              <Text>Room No.</Text>
              <Text>{patient?.room_number}</Text>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>View List of Medications</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.sectionContainer}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Emergency Contact Details</Text>
              <Text>Name: {patient?.emergency_contact?.first_name} {patient?.emergency_contact?.last_name}</Text>
              <Text>Relation to Patient: {patient?.emergency_contact?.relation_to_patient}</Text>
              <Text>Contact Details: {patient?.emergency_contact?.contact_number}</Text>
            </View>
          </View>
        </View>

        {/* Edit Button */}
        <TouchableOpacity style={styles.externalEditButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", backgroundColor: "#f0f0f0" },
  sidebar: { width: 50, backgroundColor: "#e0e0e0", alignItems: "center", paddingTop: 16 },
  sidebarIcon: { marginBottom: 24 },
  mainContent: { flex: 1, padding: 20, marginLeft: 70 },
  headerButtons: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 10},
  backButton: { backgroundColor: "#ccc", padding: 10, borderRadius: 5, marginRight: 10 },
  deactivateButton: { backgroundColor: "#ffb3b3", padding: 10, borderRadius: 5 },
  patientId: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  infoContainer: { backgroundColor: "#e0e0e0", padding: 15, borderRadius: 8, flexDirection: "row", justifyContent: "space-between" },
  sectionContainer: { flex: 1 },
  section: { marginBottom: 10 },
  sectionTitle: { fontWeight: "bold", marginBottom: 5 },
  divider: { width: 1, backgroundColor: "black", marginHorizontal: 10 },
  button: { backgroundColor: "#ccc", padding: 10, alignItems: "center", borderRadius: 5, marginTop: 10 },
  buttonText: { fontWeight: "bold" },
  externalEditButton: { backgroundColor: "#ddd", padding: 12, alignItems: "center", borderRadius: 5, alignSelf: "flex-end", marginTop: 10 },
  editButtonText: { fontSize: 14, fontWeight: "bold" }
});