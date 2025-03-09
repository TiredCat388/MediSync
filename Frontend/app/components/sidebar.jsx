import React, { useState } from 'react';
import { Animated, TouchableOpacity, Modal, Text, View, Image } from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from './sidebarstyle';

const Sidebar = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [sidebarWidth] = useState(new Animated.Value(70));
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [sidebarColor, setSidebarColor] = useState('#e0e0e0');
  const [iconColor, setIconColor] = useState('gray'); 
  const [textColor, setTextColor] = useState('gray');

  const router = useRouter();

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
    } else if (icon === 'file') {
      router.push('/logs');
    } else if (icon === 'calendar') {
      router.push('/calendar');
    } else if (icon === 'clock') {
      router.push('/clock');
    } else if (icon === 'settings') {
      router.push('/logs');
    } else if (icon === 'logout') {
      setLogoutModalVisible(true);  
    }
  };

  const handleLogout = () => {
    router.replace('/'); 
  };

  return (
    <Animated.View style={[styles.sidebar, { width: sidebarWidth, backgroundColor: sidebarColor }]}>
      {/* Sidebar Container */}
      <View style={styles.sidebarContent}>
        {/* Icons Container (Fixed Width) */}
        <View style={styles.iconsContainer}>
          <TouchableOpacity onPress={() => handleSidebarPress('menu')} style={styles.iconLabelContainer}>
            <FontAwesome name="bars" size={24} color={iconColor} />
            {isSidebarExpanded && <Text style={[styles.iconLabel, { color: textColor }]}>Menu</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleSidebarPress('file')} style={styles.iconLabelContainer}>
            <FontAwesome name="file-text-o" size={24} color={iconColor} />
            {isSidebarExpanded && <Text style={[styles.iconLabel, { color: textColor }]}>Directory</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleSidebarPress('calendar')} style={styles.iconLabelContainer}>
            <FontAwesome name="calendar" size={24} color={iconColor} />
            {isSidebarExpanded && <Text style={[styles.iconLabel, { color: textColor }]}>Calendar</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleSidebarPress('clock')} style={styles.iconLabelContainer}>
            <Feather name="clock" size={24} color={iconColor} />
            {isSidebarExpanded && <Text style={[styles.iconLabel, { color: textColor }]}>Clock</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleSidebarPress('settings')} style={styles.iconLabelContainer}>
            <FontAwesome name="cog" size={27} color={iconColor} />
            {isSidebarExpanded && <Text style={[styles.iconLabel, { color: textColor }]}>Settings</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleSidebarPress('logout')} style={styles.iconLabelContainer}>
            <Feather name="log-out" size={24} color={iconColor} />
            {isSidebarExpanded && <Text style={[styles.iconLabel, { color: textColor }]}>Logout</Text>}
          </TouchableOpacity>
        </View>

        {/* Logo at the Bottom */}
        <View style={styles.logoContainer}>
          <Image
            source={isSidebarExpanded
              ? require('../../assets/images/medisync-logo.png')  //new image when expanded
              : require('../../assets/images/medisync-logo-bw.png')}  //origina image when collapsed
            style={styles.logo}
          />
          {isSidebarExpanded && (
            <Text style={[styles.logoText, { color: textColor }]}>Medisync</Text>
          )}
        </View>
      </View>

      {/* Logout Confirmation Modal */}
      <Modal visible={logoutModalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalText}>Are you sure you want to log out?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setLogoutModalVisible(false)}  //closes the modal without logging out
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.logoutButton]}
                onPress={() => {
                  handleLogout();  // trigger the logout and navigation
                  setLogoutModalVisible(false);  //closes the modal
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