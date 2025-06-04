import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { NotificationProvider } from '../notifcontext';
import GlobalNotification from '../app/notification/globalnotif';
import { SettingsProvider } from "../SettingsContext";
import { Provider as PaperProvider } from 'react-native-paper';

export default function Layout() {
  const [fontsLoaded] = useFonts({
    AnekGujarati: require('../app/fonts/AnekGujarati.ttf'),
    AGBold: require('../app/fonts/AnekGujarati-Bold.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <SettingsProvider>
          <NotificationProvider>
            <Slot />
            <GlobalNotification />
          </NotificationProvider>
        </SettingsProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
