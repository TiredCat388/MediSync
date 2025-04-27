import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import styles from "./settingstyle";
import Sidebar from './components/sidebar';

export default function SettingsScreen() {
  const [volume, setVolume] = useState(0.5);
  const [selectedSound, setSelectedSound] = useState("Default");

  return (
<<<<<<< Updated upstream
    <View style={styles.container}>
      <Text style={styles.heading}>SETTINGS</Text>
=======
    <View style={{ flex: 1, flexDirection: "row" }}>
>>>>>>> Stashed changes

      {/* Volume Control */}
      <Text style={styles.label}>Volume</Text>
      <View style={styles.volumeRow}>
        <FontAwesome name="volume-down" size={24} color="#000" />
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={setVolume}
          minimumTrackTintColor="#3b5998"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#3b5998"
        />
        <FontAwesome name="volume-up" size={24} color="#000" />
      </View>

      {/* Alert Sound Picker */}
      <Text style={styles.label}>Alert Sound</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedSound}
          onValueChange={(itemValue) => setSelectedSound(itemValue)}
          style={styles.picker}
          mode="dropdown"
        >
          <Picker.Item label="Default" value="Default" />
          <Picker.Item label="Chime" value="Chime" />
          <Picker.Item label="Alarm 1" value="Alarm1" />
          <Picker.Item label="Alarm 2" value="Alarm2" />
        </Picker>
      </View>
    </View>
  );
<<<<<<< Updated upstream
}
=======
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
    borderWidth: 4,
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
    width: 885,
    height: 40, 
    marginHorizontal: 10,
    borderRadius: 15, 
    backgroundColor: "e0e0e0", 
  },
  pickerWrapper: {
    alignSelf: "left",
    width: 965,
    borderWidth: 4,
    borderColor: "#3b5f8a",
    borderRadius: 20,
    overflow: "hidden",
    
  },
  picker: {
    height: 44,
    width: "100%",
    color: "#000",
  },
  trackBackground: {
    width: 900,
    height: 25, 
    borderRadius: 15,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
  },
});
>>>>>>> Stashed changes
