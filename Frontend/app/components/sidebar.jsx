import React, { useState, useEffect } from 'react';
import { Animated, TouchableOpacity, Modal, Text, View, Image } from 'react-native';
import { FontAwesome, Feather, Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import styles from './sidebarstyle';
import { useNotification } from '../../notifcontext';
import AppText from './AppText';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [sidebarWidth] = useState(new Animated.Value(70));
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [sidebarColor, setSidebarColor] = useState('#5879A5');
  const [showSubOptions, setShowSubOptions] = useState(false);
  const [isDirectoryExpanded, setIsDirectoryExpanded] = useState(false);
  const { showNotification } = useNotification();
  const [overlayOpacity] = useState(new Animated.Value(0));

  const directoryPaths = ['/directory', '/archive', '/logs'];

  useEffect(() => {
    const inDirectory = directoryPaths.some((path) => pathname.startsWith(path));

    if (inDirectory && isSidebarExpanded) {
      setShowSubOptions(true);
      setIsDirectoryExpanded(true);
    } else {
      setShowSubOptions(false);
      setIsDirectoryExpanded(false);
    }
  }, [pathname, isSidebarExpanded]);

  const handleSidebarPress = (icon) => {
    if (icon === 'menu') {
      Animated.timing(sidebarWidth, {
        toValue: isSidebarExpanded ? 70 : 200,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setIsSidebarExpanded(!isSidebarExpanded);
      if (isSidebarExpanded) {
        setShowSubOptions(false);
        setIsDirectoryExpanded(false);
      }
    } else if (icon === 'file') {
      if (!isSidebarExpanded) {
        router.push('/directory');
      } else {
        setShowSubOptions((prev) => !prev);
        setIsDirectoryExpanded((prev) => !prev);
      }
    } else if (icon === 'calendar') {
      router.push('/calendar');
    } else if (icon === 'clock') {
      router.push('/clock');
    } else if (icon === 'settings') {
      router.push('/settings');
    } else if (icon === 'logout') {
      setLogoutModalVisible(true);
    }
  };

  const handleLogout = () => {
    router.replace('/');
  };

  return (
    <>
      {isSidebarExpanded && (
        <TouchableOpacity
          style={styles.overlayBackground}
          activeOpacity={1}
          onPress={() => {
            Animated.timing(sidebarWidth, {
              toValue: 70,
              duration: 300,
              useNativeDriver: false,
            }).start();
            setIsSidebarExpanded(false);
            setShowSubOptions(false);
            setIsDirectoryExpanded(false);
          }}
        />
      )}
      <Animated.View style={[styles.sidebar, { width: sidebarWidth, backgroundColor: sidebarColor }]}>
        <View style={styles.sidebarContent}>
          <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={() => handleSidebarPress('menu')} style={styles.iconLabelContainer}>
              <FontAwesome name="bars" size={24} color={"white"} />
              {isSidebarExpanded && <AppText style={[styles.iconLabel]}>Menu</AppText>}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                handleSidebarPress('file');
              }}
              style={[styles.iconLabelContainer, { width: '100%' }]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome name="file-text-o" size={24} color={"white"} />
                {isSidebarExpanded && <AppText style={[styles.iconLabel, {fontWeight: 'bold'} ]}>Directory</AppText>}
              </View>
              {isSidebarExpanded && (
                <Feather
                  name={isDirectoryExpanded ? 'chevron-down' : 'chevron-left'}
                  size={20}
                  color="white"
                  style={{ marginLeft: 20 }}
                />
              )}
            </TouchableOpacity>
            {isSidebarExpanded && showSubOptions && (
              <View style={{ marginLeft: 30 }}>
                <View style={styles.subOptionContainer}>
                  <TouchableOpacity
                    onPress={() => router.push('/directory')}
                    style={[styles.subOption, pathname === '/directory' && styles.activesubItem]}
                  >
                    <AppText style={styles.subOptionText}>Patients</AppText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => router.push('/archive')}
                    style={[styles.subOption, pathname === '/archive' && styles.activesubItem]}
                  >
                    <AppText style={styles.subOptionText}>Archive</AppText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => router.push('/logs')}
                    style={[styles.subOption, pathname === '/logs' && styles.activesubItem]}
                  >
                    <AppText style={styles.subOptionText}>Logs</AppText>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            <TouchableOpacity
              onPress={() => handleSidebarPress('calendar')}
              style={[styles.iconLabelContainer, pathname === '/calendar' && isSidebarExpanded  && styles.activeItem]}
            >
              <FontAwesome name="calendar" size={24} color={"white"} />
              {isSidebarExpanded && <AppText style={[styles.iconLabel, { color: "white" }]}>Calendar</AppText>}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSidebarPress('clock')}
              style={[styles.iconLabelContainer, pathname === '/clock' && isSidebarExpanded && styles.activeItem]}
            >
              <Feather name="clock" size={24} color={"white"} />
              {isSidebarExpanded && <AppText style={[styles.iconLabel, { color: "white" }]}>Clock</AppText>}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSidebarPress('settings')}
              style={[styles.iconLabelContainer, pathname === '/settings' && isSidebarExpanded && styles.activeItem]}
            >
              <Ionicons name="settings-outline" size={25} color={"white"} />
              {isSidebarExpanded && <AppText style={[styles.iconLabel, { color: "white" }]}>Settings</AppText>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleSidebarPress('logout')} style={styles.iconLabelContainer}>
              <Feather name="log-out" size={24} color={"white"} />
              {isSidebarExpanded && <AppText style={[styles.iconLabel, { color: "white" }]}>Logout</AppText>}
            </TouchableOpacity>
          </View>

          <View style={styles.logoContainer}>
            <Image
              rresizeMode="contain"
              source={require('../../assets/images/medisync.png')}
              style={styles.logo}
            />
            {isSidebarExpanded && <AppText style={[styles.logoText, { color: "white" }]}>Medisync</AppText>}
          </View>
        </View>

        {/* Logout Modal */}
        <Modal visible={logoutModalVisible} transparent animationType="fade">
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              <AppText style={styles.modalTitle}>Confirm Logout</AppText>
              <AppText style={styles.modalText}>Are you sure you want to log out?</AppText>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setLogoutModalVisible(false)}
                >
                  <AppText style={styles.modalButtonText}>Cancel</AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.logoutButton]}
                  onPress={() => {
                    handleLogout();
                    setLogoutModalVisible(false);
                  }}
                >
                  <AppText style={styles.modalButtonText}>Log Out</AppText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </Animated.View>
    </>
  );
};

export default Sidebar;