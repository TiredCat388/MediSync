import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function PatientDetails() {
  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        {[
          "bars",
          "file",
          "calendar",
          "clock",
          "cogs",
          "sync"
        ].map((icon, index) => (
          <TouchableOpacity key={index} onPress={() => console.log(`${icon} clicked`)}>
            <FontAwesome5 name={icon} size={24} color="black" style={styles.icon} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Content */}
      <ScrollView style={styles.mainContent}>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deactivateButton}>
            <Text style={styles.buttonText}>Deactivate Patient</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.patientId}>PATIENT ID: 0012345AB</Text>
        
        <View style={styles.infoContainer}>
          <View style={styles.sectionContainer}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Patient Details</Text>
              <Text>Name: DELA CRUZ, JUAN</Text>
              <Text>Birth of Date: 09/19/1996</Text>
              <Text>Contact Details: 09919491104</Text>
            </View>
            <View style={styles.section}>
              <Text>Room No.</Text>
              <Text>420</Text>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>View List of Medications</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.sectionContainer}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Emergency Contact Details</Text>
              <Text>Name: DELA CRUZ, ANNA MARIE</Text>
              <Text>Relation to Patient: SISTER</Text>
              <Text>Contact Details: 09289607745</Text>
            </View>
          </View>
        </View>

        {/* Separate Edit Button Just Below the Rectangle */}
        <TouchableOpacity style={styles.externalEditButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row" },
  sidebar: { width: 60, backgroundColor: "#f0f0f0", alignItems: "center", paddingVertical: 20 },
  icon: { marginVertical: 15 },
  mainContent: { flex: 1, padding: 20 },
  headerButtons: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 10 },
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