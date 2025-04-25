import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import Sidebar from "./components/sidebar";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function SettingsScreen() {
  const [volume, setVolume] = useState(50);
  const [alertSound, setAlertSound] = useState("default");
  const [sidebarWidth, setSidebarWidth] = useState(70); // Default collapsed

  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      {/* Sidebar Component */}
      <Sidebar setSidebarWidth={setSidebarWidth} />

      {/* Main Settings Content */}
      <View style={[styles.container, { marginLeft: sidebarWidth }]}>
        <Text style={styles.heading}>SETTINGS</Text>

        <Text style={styles.label}>Volume</Text>
        <View style={styles.volumeContainer}>
          <Ionicons
            name="volume-low"
            size={24}
            color="#333"
            style={{ marginRight: 10 }}
          />
          <View style={styles.sliderWrapper}>
            <View style={styles.trackBackground}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={volume}
                onValueChange={setVolume}
                minimumTrackTintColor="#3b5f8a"
                maximumTrackTintColor="transparent"
                thumbTintColor="#3b5f8a"
              />
            </View>
          </View>
          <Ionicons
            name="volume-high"
            size={24}
            color="#333"
            style={{ marginLeft: 10 }}
          />
        </View>

        <Text style={styles.label}>Alert Sound</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={alertSound}
            onValueChange={(itemValue) => setAlertSound(itemValue)}
            style={styles.picker}
            dropdownIconColor="#3b5f8a"
          >
            <Picker.Item label="Default" value="default" />
            <Picker.Item label="Chime" value="chime" />
            <Picker.Item label="Alarm 1" value="alarm1" />
            <Picker.Item label="Alarm 2" value="alarm2" />
          </Picker>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 10,
    padding: 90,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 50,
    color: "#000",
  },
  sliderWrapper: {
    borderWidth: 2,
    borderColor: "#3b5f8a",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  thumbStyle: {
    width: 20, 
    height: 20, 
    borderRadius: 15, 
    backgroundColor: "#3b5f8a", 
  },
  label: {
    fontSize: 25,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 20,
    color: "#000",
  },
  volumeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", 
    marginBottom: 16,
    alignSelf: "flex-start", 
    paddingHorizontal: 12, 
  },
  slider: {
    flex: 1,
    width: 900,
    height: 40, 
    marginHorizontal: 10,
    borderRadius: 15, 
    backgroundColor: "e0e0e0", 
  },
  pickerWrapper: {
    alignSelf: "left",
    width: 1000,
    borderWidth: 1,
    borderColor: "#3b5f8a",
    borderRadius: 3,
    overflow: "hidden",
    
  },
  picker: {
    height: 44,
    width: "100%",
    color: "#000",
  },
  trackBackground: {
    width: 900,
    height: 25, // ← bigger height for the thick oval background
    borderRadius: 15,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
  },
});
