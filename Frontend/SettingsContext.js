import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [volume, setVolume] = useState(50);
  const [alertSound, setAlertSound] = useState("alarm 1");

  useEffect(() => {
    const load = async () => {
      const v = await AsyncStorage.getItem("volume");
      const s = await AsyncStorage.getItem("alertSound");
      if (v !== null) setVolume(JSON.parse(v));
      if (s !== null) setAlertSound(s);
    };
    loadSettings();
  }, []);

  const saveSettings = async (newVolume, newAlertSound) => {
    await AsyncStorage.setItem("volume", JSON.stringify(newVolume));
    await AsyncStorage.setItem("alertSound", newAlertSound);
    await loadSettings(); // <-- reload from AsyncStorage
  };

  const loadSettings = async () => {
    const v = await AsyncStorage.getItem("volume");
    const s = await AsyncStorage.getItem("alertSound");
    if (v !== null) setVolume(JSON.parse(v));
    if (s !== null) setAlertSound(s);
  };

  return (
    <SettingsContext.Provider value={{ volume, alertSound, setVolume, setAlertSound, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);