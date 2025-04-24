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
    <View style={styles.container}>
      <Text style={styles.heading}>SETTINGS</Text>

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
}