import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import Sidebar from "./components/sidebar";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { Audio } from "expo-av";

export default function SettingsScreen() {
  const [volume, setVolume] = useState(50); // Default volume
  const [alertSound, setAlertSound] = useState("default"); // Default alert sound
  const [sidebarWidth, setSidebarWidth] = useState(70); // Default collapsed
  const [isSaving, setIsSaving] = useState(false); // For showing loading state
  const [isSaved, setIsSaved] = useState(false); // To track if settings are saved

  // Load settings from AsyncStorage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedVolume = await AsyncStorage.getItem("volume");
        const storedAlertSound = await AsyncStorage.getItem("alertSound");

        if (storedVolume !== null) {
          setVolume(JSON.parse(storedVolume)); // Parse and set volume
        }
        if (storedAlertSound !== null) {
          setAlertSound(storedAlertSound); // Set alert sound
        }
      } catch (error) {
        console.error("Error loading settings from AsyncStorage:", error);
      }
    };

    loadSettings(); // Call function to load settings when the component mounts
  }, []);

  const saveSettings = async () => {
    setIsSaving(true); // Set saving state to true (button disabled, show loading)
    setIsSaved(false); // Reset saved state before saving

    try {
      await AsyncStorage.setItem("volume", JSON.stringify(volume)); // Save volume
      await AsyncStorage.setItem("alertSound", alertSound); // Save alert sound
      setIsSaved(true); // Mark as saved after success
      console.log("Settings saved!");
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false); // Reset saving state after saving
    }
  };

  const playSound = async (soundFile) => {
    try {
      const { sound } = await Audio.Sound.createAsync(soundFile);
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const handleAlertSoundChange = async (itemValue) => {
    setAlertSound(itemValue);

    // Play selected sound
    let soundFile;
    switch (itemValue) {
      case "alarm 1":
        soundFile = require("../assets/sounds/alarm 1.mp3");
        break;
      case "alarm 2":
        soundFile = require("../assets/sounds/alarm 2.mp3");
        break;
      case "alarm 3":
        soundFile = require("../assets/sounds/alarm 3.mp3");
        break;
      case "alarm 4":
        soundFile = require("../assets/sounds/alarm 4.mp3");
        break;
      default:
        soundFile = require("../assets/sounds/alarm 1.mp3");
    }

    await playSound(soundFile);
  };

  const handleVolumeChange = (value) => {
    setVolume(value);
  };

  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      {/* Sidebar Component */}
      <Sidebar setSidebarWidth={setSidebarWidth} />

      {/* Main Settings Content */}
      <View style={[styles.container, { marginLeft: sidebarWidth }]}>
        <Text style={styles.heading}>Settings</Text>

        <Text style={styles.label}>Volume</Text>
        <View style={styles.volumeContainer}>
          <Ionicons
            name="volume-low-outline"
            size={40}
            color="#808080"
            style={{ marginRight: 10 }}
          />
          <View style={styles.sliderWrapper}>
            <View style={styles.trackBackground}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={volume}
                onValueChange={handleVolumeChange}
                minimumTrackTintColor="#5879A5"
                maximumTrackTintColor="transparent"
                thumbTintColor="#5879A5"
              />
            </View>
          </View>
          <Ionicons
            name="volume-high-outline"
            size={40}
            color="#808080"
            style={{ marginLeft: 10 }}
          />
        </View>

        <Text style={styles.label}>Alert Sound</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={alertSound}
            onValueChange={handleAlertSoundChange}
            style={styles.picker}
            dropdownIconColor="#3b5f8a"
          >
            <Picker.Item label="Alarm 1" value="alarm 1" />
            <Picker.Item label="Alarm 2" value="alarm 2" />
            <Picker.Item label="Alarm 3" value="alarm 3" />
            <Picker.Item label="Alarm 4" value="alarm 4" />
          </Picker>
        </View>

        {/* Save Button */}
        <View style={styles.saveButtonWrapper}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: isSaving ? "#A0C4FF" : "#4E84D3" },
            ]}
            onPress={saveSettings}
            disabled={isSaving} // Disable the button while saving
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? "Saving..." : isSaved ? "Saved" : "Save Settings"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 10,
    padding: 40,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 50,
    color: "#000",
  },
  sliderWrapper: {
    borderWidth: 2,
    borderColor: "#808080",
    borderRadius: 15,
  },
  thumbStyle: {
    width: 20,
    height: 20,
    borderRadius: 15,
    backgroundColor: "#5879A5",
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
    height: 50,
    marginHorizontal: 10,
    borderRadius: 15,
    backgroundColor: "e0e0e0",
  },
  pickerWrapper: {
    alignSelf: "left",
    width: 1000,
    borderWidth: 2,
    borderColor: "#5879A5",
    borderRadius: 12,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    fontSize: 16,
    paddingLeft: 15,
    borderWidth: 0,
    width: "100%",
    color: "#000",
  },
  trackBackground: {
    width: 900,
    height: 25,
    borderRadius: 12,
    justifyContent: "center",
  },
  saveButtonWrapper: {
    marginTop: 30,
    width: "100%",
    alignItems: "flex-end",
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
});
