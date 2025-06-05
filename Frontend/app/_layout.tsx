import { Slot, usePathname } from 'expo-router';
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

  const pathname = usePathname();
  const hideNotification = pathname === '/' || pathname === '/index';

  if (!fontsLoaded) return null;

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <SettingsProvider>
          <NotificationProvider>
            <Slot />
            {!hideNotification && <GlobalNotification />}
          </NotificationProvider>
        </SettingsProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
