import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import Sidebar from "./components/sidebar";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { SafeAreaView } from "react-native-safe-area-context";
import AppText from './components/AppText';
import styles from "./stylesheets/settingstyle";

export default function SettingsScreen() {
  const [volume, setVolume] = useState(50);
  const [alertSound, setAlertSound] = useState("default");
  const [sidebarWidth, setSidebarWidth] = useState(70);
  const [isSaving, setIsSaving] = useState(false); // For showing loading state
  const [isSaved, setIsSaved] = useState(false); // To track if settings are saved
  const [soundObject, setSoundObject] = useState(null);
  const [volumeChangeTimeout, setVolumeChangeTimeout] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedVolume = await AsyncStorage.getItem("volume");
        const storedAlertSound = await AsyncStorage.getItem("alertSound");

        if (storedVolume !== null) {
          setVolume(JSON.parse(storedVolume));
        }
        if (storedAlertSound !== null) {
          setAlertSound(storedAlertSound);
        }
      } catch (error) {
        console.error("Error loading settings from AsyncStorage:", error);
      }
    };

    loadSettings();
  }, []);

  // Save settings to AsyncStorage
  const saveSettings = async () => {
    setIsSaving(true);
    setIsSaved(false);

    try {
      await AsyncStorage.setItem("volume", JSON.stringify(volume));
      await AsyncStorage.setItem("alertSound", alertSound);
      setIsSaved(true);
      console.log("Settings saved!");
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Play sound at current volume
  const playSound = async (soundFile, vol = volume) => {
    try {
      if (vol === 0) return;

      // Stop any currently playing sound
      if (soundObject) {
        await soundObject.unloadAsync();
        setSoundObject(null);
      }

      const { sound } = await Audio.Sound.createAsync(soundFile, {
        shouldPlay: true,
        volume: vol / 100,
      });

      setSoundObject(sound);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
          setSoundObject(null);
        }
      });
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  // Play feedback sound as slider moves
  const handleVolumeChange = (value) => {
    setVolume(value);

    // Clear any existing timeout to debounce
    if (volumeChangeTimeout) {
      clearTimeout(volumeChangeTimeout);
    }

    const newTimeout = setTimeout(async () => {
      let soundFile;
      switch (alertSound) {
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

      if (value > 0) {
        await playSound(soundFile, value);
      } else if (soundObject) {
        await soundObject.unloadAsync();
        setSoundObject(null);
      }
    }, 500); // Wait 200ms after last change before playing sound

    setVolumeChangeTimeout(newTimeout);
  };

  const handleVolumeRelease = async (value) => {
    let soundFile;
    switch (alertSound) {
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

    if (value > 0) {
      await playSound(soundFile, value);
    } else if (soundObject) {
      await soundObject.unloadAsync();
      setSoundObject(null);
    }
  };

  // Play sound when alert sound changes
  const handleAlertSoundChange = async (itemValue) => {
    setAlertSound(itemValue);

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


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        {/* Sidebar Component */}
        <Sidebar setSidebarWidth={setSidebarWidth} />

        {/* Main Settings Content */}
        <View style={[styles.container, { marginLeft: sidebarWidth }]}>
          <AppText style={styles.heading}>Settings</AppText>

          <AppText style={styles.label}>Volume</AppText>
          <View style={styles.volumeContainer}>
            {volume === 0 ? (
              <Ionicons
                name="volume-mute-outline"
                size={40}
                color="#808080"
                style={{ marginRight: 10 }}
              />
            ) : (
              <Ionicons
                name="volume-low-outline"
                size={40}
                color="#808080"
                style={{ marginRight: 10 }}
              />
            )}
            <View style={styles.sliderWrapper}>
              <View style={styles.trackBackground}>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={100}
                  value={volume}
                  onValueChange={(value) => setVolume(value)} // update UI only
                  onSlidingComplete={handleVolumeRelease}     // play sound here
                  minimumTrackTintColor="#5879A5"
                  maximumTrackTintColor="#e0e0e0"
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

          <AppText style={styles.label}>Alert Sound</AppText>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={alertSound}
              onValueChange={handleAlertSoundChange}
              style={styles.picker}
              dropdownIconColor="#5879A5"
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
                { backgroundColor: isSaving ? "#333333" : "#4E84D3" },
              ]}
              onPress={saveSettings}
              disabled={isSaving}
            >
              <AppText style={styles.saveButtonText}>
                {isSaving ? "Saving..." : isSaved ? "Saved" : "Save Settings"}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}