import React, { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import Sidebar from "./components/sidebar";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import AppText from './components/AppText';
import styles from "./stylesheets/settingstyle";
import RNPickerSelect from "react-native-picker-select";
import { useSettings } from "../SettingsContext";
import { Audio } from "expo-av";

export default function SettingsScreen() {
  const { volume, alertSound, saveSettings } = useSettings();
  const [localVolume, setLocalVolume] = useState(volume);
  const [localAlertSound, setLocalAlertSound] = useState(alertSound);
  const [sidebarWidth, setSidebarWidth] = useState(70);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [soundObject, setSoundObject] = useState(null);

  // Sync localVolume with context volume
  useEffect(() => {
    setLocalVolume(volume);
  }, [volume]);

  useEffect(() => {
    setLocalAlertSound(alertSound);
  }, [alertSound]);

  const soundFiles = {
    "alarm 1": require("../assets/sounds/alarm 1.mp3"),
    "alarm 2": require("../assets/sounds/alarm 2.mp3"),
    "alarm 3": require("../assets/sounds/alarm 3.mp3"),
    "alarm 4": require("../assets/sounds/alarm 4.mp3"),
  };

  // Play sound at current volume
  const playSound = async (soundFile, vol = localVolume) => {
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

  // Save settings using context
  const handleSave = async () => {
    setIsSaving(true);
    setIsSaved(false);
    try {
      await saveSettings(localVolume, localAlertSound);
      setIsSaved(true);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Play sound when alert sound changes
  const handleAlertSoundChange = async (itemValue) => {
    setLocalAlertSound(itemValue);

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

    await playSound(soundFile, localVolume);
  };

  const handleVolumeRelease = async (value) => {
    const selectedSound = soundFiles[localAlertSound] || soundFiles["alarm 1"];

    if (value > 0) {
      await playSound(selectedSound, value);
    } else if (soundObject) {
      await soundObject.unloadAsync();
      setSoundObject(null);
    }
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
            {localVolume === 0 ? ( // use localVolume here
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
                  value={localVolume}
                  onValueChange={setLocalVolume}
                  onSlidingComplete={handleVolumeRelease}
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
            <RNPickerSelect
              onValueChange={handleAlertSoundChange}
              value={localAlertSound}
              items={[
                { label: "Alarm 1", value: "alarm 1" },
                { label: "Alarm 2", value: "alarm 2" },
                { label: "Alarm 3", value: "alarm 3" },
                { label: "Alarm 4", value: "alarm 4" },
              ]}
              placeholder={{ label: "Default", value: "" }}
              style={{
                inputIOS: styles.picker,
                inputAndroid: styles.picker,
                placeholder: { color: "#808080" },
              }}
              Icon={() => (
                <Ionicons name="chevron-down" size={24} color="#808080" style={{ top: 12, right: 10 }} />
              )}
              useNativeAndroidPickerStyle={false}
            />
          </View>

          {/* Save Button */}
          <View style={styles.saveButtonWrapper}>
            <TouchableOpacity
              style={[
                styles.saveButton,
                { backgroundColor: isSaving ? "#333333" : "#4E84D3" },
              ]}
              onPress={handleSave}
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