import React, { createContext, useContext, useState, useEffect } from 'react';
import Constants from 'expo-constants';

const BASE_API = Constants.expoConfig.extra.BASE_API;
const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [notificationData, setNotificationData] = useState(null);

  const showNotification = (data) => {
    setNotificationData(data);
    setVisible(true);
  };

  const hideNotification = () => {
    setVisible(false);
    setNotificationData(null);
  };

  useEffect(() => {
    let interval;

    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_API}/api/medications/`);
        const schedules = await response.json();

        const now = new Date();

        const upcoming = schedules.filter((sched) => {
          const schedTime = new Date(sched.time);
          const diff = schedTime - now;
          return diff > 0 && diff < 5 * 60 * 1000;
        });

        if (upcoming.length > 1) {
          showNotification({
            multiple: true,
            message: 'Multiple upcoming medications scheduled.',
            scheduleIds: upcoming.map((sched) => sched.id),
          });
        }

        if (upcoming.length === 1) {
          const sched = upcoming[0];
          showNotification({
            scheduleId: sched.id,
            patient: sched.patient,
            medication: sched.medication,
            dosage: sched.dosage,
            room: sched.room,
            quantity: sched.quantity,
            notes: sched.notes,
          });
        }
      } catch (error) {
        console.error('Error fetching medication schedules:', error);
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
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification, visible, notificationData }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
