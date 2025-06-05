import React, { useState, useRef, useEffect } from "react";
import { TouchableWithoutFeedback, View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import AppText from '../components/AppText';
import { router } from 'expo-router';
import { useNavigation } from "@react-navigation/native";
import Animated, { 
  useAnimatedStyle, 
  withTiming,
  useSharedValue
} from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function NotificationToast({ data, visible, onHide, isMultiple }) {
  const translateY = useSharedValue(-150);
  const navigation = useNavigation();
  const [expanded, setExpanded] = useState(false);  

  useEffect(() => {
    translateY.value = withTiming(visible ? 0 : -150, {
      duration: 300
    });
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }]
    };
  });

  const handleHide = () => {
    setExpanded(false);  
    onHide();
  };

  if (!data) return null;

  // Apply styles for multiple alerts (when there are more than 2)
  const bannerStyle = isMultiple ? styles.multipleBanner : styles.banner;
  const cardStyle = isMultiple ? styles.multipleCard : styles.card;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={cardStyle}>
        <TouchableWithoutFeedback onPress={() => setExpanded((prev) => !prev)}>
          <View style={bannerStyle}>
            <AppText style={styles.title}>
              {isMultiple ? "MULTIPLE UPCOMING MEDICATIONS" : "UPCOMING MEDICATION ALERT"}
            </AppText>
            {!isMultiple && <AppText style={styles.subtitle}>Schedule ID: {data.scheduleId}</AppText>}
          </View>
        </TouchableWithoutFeedback>

        {expanded && !isMultiple && (
          <View style={styles.detailsContainer}>
            <View style={styles.row}>
              <View style={styles.col}>
                <AppText style={styles.label}>Patient:</AppText>
                <AppText style={styles.text}>{data.patient_name}</AppText>

                <AppText style={styles.label}>Medication:</AppText>
                <AppText style={styles.text}>{data.medication} - {data.dosage} {data.dosage_unit} - {data.form}</AppText>

                <AppText style={styles.label}>Route:</AppText>
                <AppText style={styles.text}>{data.route}</AppText>

                <AppText style={styles.label}>Physician ID:</AppText>
                <AppText style={styles.text}>{data.physician}</AppText>
              </View>

              <View style={styles.col}>
                <AppText style={styles.label}>Room No:</AppText>
                <AppText style={styles.text}>{data.room}</AppText>

                <AppText style={styles.label}>Adminster on:</AppText>
                <AppText style={styles.text}>{data.dosage_time}</AppText>

                <AppText style={styles.label}>Notes:</AppText>
                <AppText style={styles.text}>{data.notes}</AppText>
              </View>
            </View>

            <View style={styles.buttons}>
              <Pressable
                style={styles.confirmButton}
                onPress={() => {
                  router.push('/clock');
                  handleHide(); 
                }}
              >
                <AppText style={styles.confirmText}>View Alerts</AppText>
              </Pressable>
            </View>
          </View>
        )}

        {expanded && isMultiple && (
          <View style={styles.detailsContainer}>
            <View style={styles.buttons}>
              <Pressable
                style={styles.confirmButton}
                onPress={() => {
                  router.push('/clock');
                  handleHide();  // Hide and minimize after navigating
                }}
              >
                <AppText style={styles.confirmText}>View Alerts</AppText>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    width: "80%",
    alignSelf: "center",
    backgroundColor: "transparent",
    zIndex: 9999,
    elevation: 10,
    paddingTop: 30,
  },
  card: {
    backgroundColor: "#5879a5",
    borderRadius: 12,
    overflow: "hidden",
  },
  multipleCard: {
    backgroundColor: "#5879a5",
    borderRadius: 12,
    overflow: "hidden",
  },
  banner: {
    padding: 16,
  },
  multipleBanner: {
    padding: 16, 
  },
  title: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 20,
    paddingLeft: 10,
  },
  subtitle: {
    color: "#fff",
    fontSize: 18,
    paddingLeft: 10,
    marginTop: 2,
  },
  detailsContainer: {
    padding: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  col: {
    width: "48%",
  },
  label: {
    fontWeight: "bold",
    marginTop: 4,
    color: "#fff",
    fontSize: 20,
    paddingLeft: 14,
  },
  text: {
    marginTop: 4,
    color: "#fff",
    fontSize: 18,
    paddingLeft: 14,
    paddingBottom: 20,
  },
  buttons: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  confirmButton: {
    backgroundColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 100,
    borderRadius: 6,
  },
  confirmText: {
    color: "black",
    fontSize: 18,
  },
});
