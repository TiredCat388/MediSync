import { Slot } from 'expo-router';
import { NotificationProvider, useNotification } from '../notifcontext';
import GlobalNotification from './notification/globalnotif';  // Import GlobalNotification component

export default function Layout() {
  return (
    <NotificationProvider>
      <Slot />  
      <GlobalNotification /> 
    </NotificationProvider>
  );
}
