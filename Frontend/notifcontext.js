import React, { createContext, useContext, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { useSettings } from "./SettingsContext"; // <-- Add this import
import Constants from 'expo-constants';

const BASE_API = Constants.expoConfig.extra.BASE_API;
const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [visible, setVisible] = React.useState(false);
  const [notificationData, setNotificationData] = React.useState(null);
  const [soundObject, setSoundObject] = React.useState(null);
  const { volume, alertSound } = useSettings();

  const patientsRef = useRef([]);
  const alertedAt60Min = useRef(new Set());
  const alertedAt30Min = useRef(new Set());
  const alertedAt1Min = useRef(new Set());

  const log = (msg, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[NotificationProvider][${timestamp}] ${msg}`, data || "");
  };

  const showNotification = (data) => {
    setNotificationData(data);
    setVisible(true);
  };

  const hideNotification = () => {
    setVisible(false);
    setNotificationData(null);
  };

  const getSoundFile = (soundName) => {
    switch (soundName) {
      case "alarm 1":
        return require("./assets/sounds/alarm 1.mp3");
      case "alarm 2":
        return require("./assets/sounds/alarm 2.mp3");
      case "alarm 3":
        return require("./assets/sounds/alarm 3.mp3");
      case "alarm 4":
        return require("./assets/sounds/alarm 4.mp3");
      case "default":
        return require("./assets/sounds/alarm 1.mp3");
      default:
        return require("./assets/sounds/alarm 1.mp3");
    }
  };

  const playAlertSound = async () => {
    try {
      if (volume === 0) {
        log("Volume is zero — not playing sound");
        return;
      }

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      if (soundObject) {
        await soundObject.unloadAsync();
        setSoundObject(null);
      }

      const file = getSoundFile(alertSound);
      const { sound } = await Audio.Sound.createAsync(file, {
        shouldPlay: true,
        volume: volume / 100,
      });

      setSoundObject(sound);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
          setSoundObject(null);
        }
      });

      log("Playing alert sound", { alertSound, volume });
    } catch (error) {
      console.error("Error playing alert sound:", error);
    }
  };

  const getPatientById = (id) => {
    return patientsRef.current.find((p) => p.patient_number === id) || null;
  };

  useEffect(() => {
    // Fetch patients ONCE
    const fetchPatients = async () => {
      try {
        const response = await fetch(`${BASE_API}/api/patients/`);
        const data = await response.json();
        patientsRef.current = data;
      } catch (error) {
        console.error("Error fetching patient list:", error);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    let interval;

    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_API}/api/medications/`);
        const schedules = await response.json();

        const now = new Date();

        const upcoming = [];

        schedules.forEach((sched) => {
          const schedTime = new Date(sched.next_dose_time);
          const diffMs = schedTime - now;
          const diffMinutes = diffMs / (1000 * 60);
          const scheduleId = sched.id;
          const alertKey60 = `${scheduleId}_${sched.next_dose_time}_60`;
          const alertKey30 = `${scheduleId}_${sched.next_dose_time}_30`;

          const patient = getPatientById(sched.patient_number);
          if (patient?.is_archived) return;

          // Reset alert flags if dose time passed so next alerts can trigger
          if (diffMinutes < -1) {
            alertedAt60Min.current.delete(scheduleId);
            alertedAt30Min.current.delete(scheduleId);
            return;
          }
          if (
            diffMinutes >= -1 && diffMinutes <= 1
          ) {
            upcoming.push(sched);
            return;
          }

          // 60-minute alert
          if (
            !alertedAt60Min.current.has(alertKey60) &&
            diffMinutes >= 59 && diffMinutes <= 61
          ) {
            alertedAt60Min.current.add(alertKey60);
            upcoming.push(sched);
            return;
          }

          // 30-minute alert
          if (
            !alertedAt30Min.current.has(alertKey30) &&
            diffMinutes >= 29 && diffMinutes <= 31
          ) {
            alertedAt30Min.current.add(alertKey30);
            upcoming.push(sched);
            return;
          }

          // 1-minute alert (for testing)
        });

        if (upcoming.length > 1) {
          showNotification({
            multiple: true,
            message: "Multiple upcoming medications scheduled.",
            scheduleIds: upcoming.map((sched) => sched.id),
          });
          await playAlertSound();
        } else if (upcoming.length === 1) {
          const sched = upcoming[0];
          const patient = getPatientById(sched.patient_number);
          showNotification({
            scheduleId: sched.id,
            medication: sched.Medication_name,
            dosage_unit: sched.Medication_unit,
            dosage: sched.Medication_strength,
            room: patient?.room_number,
            route: sched.Medication_route,
            notes: sched.notes,
            form: sched.Medication_form,
            physician: sched.physicianID,
            dosage_time: sched.next_dose_time.split("T")[1]?.split("+")[0]?.slice(0, 5),
            patient_name: patient ? `${patient.last_name.toUpperCase()}, ${patient.first_name}` : "Unknown",
          });
          await playAlertSound();
        }
      } catch (error) {
        console.error("Error fetching medication schedules:", error);
      }
    };

    const now = new Date();
    const msUntilNextMinute = 60000 - (now.getTime() % 60000);

    const timeout = setTimeout(() => {
      fetchData();
      interval = setInterval(fetchData, 60000);
    }, msUntilNextMinute);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [volume, alertSound]);

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification, visible, notificationData }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
