import React, { useState, useEffect } from 'react';
import { Animated, TouchableOpacity, Modal, Text, View, Image } from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import styles from './sidebarstyle';
import { useNotification } from '../../notifcontext';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [sidebarWidth] = useState(new Animated.Value(70));
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [sidebarColor, setSidebarColor] = useState('#e0e0e0');
  const [iconColor, setIconColor] = useState('gray');
  const [textColor, setTextColor] = useState('gray');
  const [showSubOptions, setShowSubOptions] = useState(false);
  const [isDirectoryExpanded, setIsDirectoryExpanded] = useState(false);
  const { showNotification } = useNotification();

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
      setSidebarColor(isSidebarExpanded ? '#e0e0e0' : '#5879a5');
      const newColor = isSidebarExpanded ? 'gray' : 'white';
      setIconColor(newColor);
      setTextColor(newColor);
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
    <Animated.View style={[styles.sidebar, { width: sidebarWidth, backgroundColor: sidebarColor }]}>
      <View style={styles.sidebarContent}>
        <View style={styles.iconsContainer}>
          <TouchableOpacity onPress={() => handleSidebarPress('menu')} style={styles.iconLabelContainer}>
            <FontAwesome name="bars" size={24} color={iconColor} />
            {isSidebarExpanded && <Text style={[styles.iconLabel, { color: textColor }]}>Menu</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              handleSidebarPress('file');
            }}
            style={[styles.iconLabelContainer, { width: '100%' }]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome name="file-text-o" size={24} color={iconColor} />
              {isSidebarExpanded && <Text style={[styles.iconLabel, { color: textColor }]}>Directory</Text>}
            </View>

            {isSidebarExpanded && (
              <Feather
                name={isDirectoryExpanded ? 'chevron-down' : 'chevron-left'}
                size={20}
                color="white"
                style={{ marginLeft: 35 }}
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
                  <Text style={styles.subOptionText}>Patients</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push('/archive')}
                  style={[styles.subOption, pathname === '/archive' && styles.activesubItem]}
                >
                  <Text style={styles.subOptionText}>Archive</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push('/logs')}
                  style={[styles.subOption, pathname === '/logs' && styles.activesubItem]}
                >
                  <Text style={styles.subOptionText}>Logs</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <TouchableOpacity
            onPress={() => handleSidebarPress('calendar')}
            style={[styles.iconLabelContainer, pathname === '/calendar' && styles.activeItem]}
          >
            <FontAwesome name="calendar" size={24} color={iconColor} />
            {isSidebarExpanded && <Text style={[styles.iconLabel, { color: textColor }]}>Calendar</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleSidebarPress('clock')}
            style={[styles.iconLabelContainer, pathname === '/clock' && styles.activeItem]}
          >
            <Feather name="clock" size={24} color={iconColor} />
            {isSidebarExpanded && <Text style={[styles.iconLabel, { color: textColor }]}>Clock</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleSidebarPress('settings')}
            style={[styles.iconLabelContainer, pathname === '/settings' && styles.activeItem]}
          >
            <FontAwesome name="cog" size={27} color={iconColor} />
            {isSidebarExpanded && <Text style={[styles.iconLabel, { color: textColor }]}>Settings</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleSidebarPress('logout')} style={styles.iconLabelContainer}>
            <Feather name="log-out" size={24} color={iconColor} />
            {isSidebarExpanded && <Text style={[styles.iconLabel, { color: textColor }]}>Logout</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.logoContainer}>
          <Image
            resizeMode="contain"
            source={
              isSidebarExpanded
                ? require('../../assets/images/medisync-logo.png')
                : require('../../assets/images/medisync-logo-bw.png')
            }
            style={styles.logo}
          />
          {isSidebarExpanded && <Text style={[styles.logoText, { color: textColor }]}>Medisync</Text>}
        </View>
      </View>

      {/* Logout Modal */}
      <Modal visible={logoutModalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalText}>Are you sure you want to log out?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.logoutButton]}
                onPress={() => {
                  handleLogout();
                  setLogoutModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

export default Sidebar;
