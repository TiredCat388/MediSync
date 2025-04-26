import React, { createContext, useContext, useState, useEffect } from 'react';

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
    const interval = setInterval(async () => {
      try {
        const response = await fetch('[replace_with_your_api_endpoint]');
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
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification, visible, notificationData }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
