import React from "react";
import NotificationToast from './notif'; 
import { useNotification } from '../../notifcontext';

export default function GlobalNotification() {
  const { visible, notificationData, hideNotification } = useNotification();

  return (
    <NotificationToast
      visible={visible}
      data={notificationData}
      onHide={hideNotification}
    />
  );
}
