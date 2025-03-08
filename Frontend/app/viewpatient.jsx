import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styles from "./viewstyle";

export default function PatientDetails() {
  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        <FontAwesome name="menu" size={24} color="black" style={styles.sidebarIcon} />
        <FontAwesome name="calendar" size={24} color="black" style={styles.sidebarIcon} />
        <FontAwesome name="clock" size={24} color="black" style={styles.sidebarIcon} />
        <FontAwesome name="settings" size={24} color="black" style={styles.sidebarIcon} />
        <FontAwesome name="refresh-cw" size={24} color="black" style={styles.sidebarIcon} />
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
              <Text>Birth Date: 09/19/1996</Text>
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

        {/* Edit Button */}
        <TouchableOpacity style={styles.externalEditButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}